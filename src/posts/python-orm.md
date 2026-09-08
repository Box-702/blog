---
title: Python ORM 速查笔记 — SQLAlchemy 2.0 核心用法
date: 2026-09-10
tags: [Python, ORM, SQLAlchemy, 数据库]
category: 后端
summary: 简明扼要的 Python ORM 速查笔记。以 SQLAlchemy 2.0 为主线，覆盖模型定义、增删改查、查询与联表、关系映射、唯一约束、事务与会话管理，并补充 Django ORM 与异步方案的对比，方便随时查用。
---

# Python ORM 速查笔记 — SQLAlchemy 2.0 核心用法

> 一句话：ORM（Object-Relational Mapping）把数据库表映射成 Python 类，把行映射成对象，让你用「操作对象」代替「手写 SQL」。

## 什么是 ORM，为什么用它

- **表 → 类**：一张表对应一个 Python 类。
- **行 → 对象**：一行数据对应一个类的实例。
- **列 → 属性**：一个字段对应实例的一个属性。

为什么用：

- ✅ 不用拼接字符串，避免 SQL 注入。
- ✅ 跨数据库（SQLite / PostgreSQL / MySQL / …）切换方便。
- ✅ 复杂关联（一对多、多对多）用对象关系表达，代码可读。
- ✅ 配合迁移工具（Alembic）管理表结构变更。

代价：

- ⚠️ 有学习成本，隐式行为（惰性加载、事务边界）需要理解。
- ⚠️ 复杂聚合/超大数据量时，直接写 SQL 更可控。

## 主流 ORM 对比

| ORM | 特点 | 适用场景 |
| --- | --- | --- |
| **SQLAlchemy** | 功能最全，SQL 表达式 + ORM 两层，2.0 统一风格 | 复杂业务、企业级、灵活查询 |
| **SQLModel** | SQLAlchemy + Pydantic 结合，类型友好 | FastAPI 项目、追求简洁 |
| **Django ORM** | 与 Django 深度绑定，自带迁移、Admin | Django 生态 |
| **Peewee** | 轻量、简单，单文件即可用 | 小型项目、脚本 |
| **Tortoise ORM** | 异步、类 Django 风格 | asyncio + FastAPI |
| **SQLObject** | 老牌但维护少 | 不使用 |

本文以 **SQLAlchemy 2.0** 为准（`pip install sqlalchemy`），它是目前 Python ORM 的事实标准。

## SQLAlchemy 2.0 核心

### 1. 建立连接

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 本地 SQLite
engine = create_engine("sqlite:///app.db")

# 需要表名（内存库）时
# engine = create_engine("sqlite:///:memory:")

# PostgreSQL / MySQL
# engine = create_engine("postgresql+psycopg2://user:pass@host:5432/db")
# engine = create_engine("mysql+pymysql://user:pass@host:3306/db")

# 推荐：连接池 + 回显 SQL（调试用）
engine = create_engine("sqlite:///app.db", echo=True, pool_pre_ping=True)

# 会话工厂（ORM 操作入口）
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()
```

`echo=True` 会在控制台打印执行的 SQL，调 bug 必备。`pool_pre_ping=True` 每次取连接前检测，避免失效连接。

### 2. 定义模型（2.0 风格）

SQLAlchemy 2.0 用 `Mapped` + `mapped_column` 做类型标注：

```python
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    """所有模型的基类。"""
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(120))
    age: Mapped[int | None] = mapped_column(Integer, nullable=True, default=18)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # 关系：一个 User 有多个 Post
    posts: Mapped[list["Post"]] = relationship(back_populates="author")

class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    body: Mapped[str] = mapped_column(Text)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    author: Mapped["User"] = relationship(back_populates="posts")

# 建表（开发期方便；生产用 Alembic 迁移）
from sqlalchemy import create_engine
Base.metadata.create_all(engine)
```

要点：

- `Mapped[可选/必填]` 决定是否 `nullable`：`int | None` → 可空。
- `mapped_column(...)` 是原来的 `Column(...)`，仍兼容旧写法。
- `relationship` 描述对象关联，`back_populates` 让两端双向关联。
- 建表、改表别用 `create_all`，生产环境用 **Alembic**。

**联合唯一约束**：单字段唯一用 `unique=True`；多字段组合唯一（如防止重复收藏）用 `UniqueConstraint`：

```python
from sqlalchemy import UniqueConstraint

class Favorite(Base):
    __tablename__ = "favorites"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"))

    # 同一用户对同一文章只能收藏一次，违反时插入报错
    __table_args__ = (
        UniqueConstraint("user_id", "post_id", name="user_post_unique"),
    )
```

### 3. 增删改查（CRUD）

```python
# 新增
u = User(name="Alice", email="alice@example.com")
session.add(u)              # 加入会话（还没写库）
session.flush()             # 可选：立即拿到自增 id
session.commit()            # 提交事务
session.refresh(u)          # 从库刷新最新状态

# 批量新增
session.add_all([
    User(name="Bob", email="bob@example.com"),
    User(name="Carol", email="carol@example.com"),
])
session.commit()

# 查询
u = session.get(User, 1)          # 按主键取
user = session.execute(
    select(User).where(User.name == "Alice")
).scalar_one()                     # 恰好一条，否则抛异常
```

### 4. 查询（select）

```python
from sqlalchemy import select, and_, or_, func

# 全部
users = session.execute(select(User)).scalars().all()

# 条件
sel = select(User).where(User.age >= 18)
# 多条件：and_（逗号即 and）
sel = select(User).where(User.age >= 18, User.email.like("%@example.com"))
# 或
sel = select(User).where(or_(User.name == "Alice", User.name == "Bob"))

# 排序 / 分页
sel = select(User).order_by(User.created_at.desc()).offset(20).limit(10)

# 只取某些列
sel = select(User.name, User.email).where(User.age > 30)

# 统计
count = session.execute(select(func.count()).select_from(User)).scalar()

# 去重 / 取第一条
first = session.execute(select(User).order_by(User.id)).scalars().first()
```

**联表查询**：`select(主体模型, 关联表字段.label("别名")).join(关联模型, 条件)`，`.label()` 给字段重命名，结果是行元组：

```python
sel = (
    select(Post, User.name.label("author_name"))
    .join(User, Post.user_id == User.id)
)

for post, author_name in session.execute(sel):
    print(post.title, author_name)
```

如果只是为了取关联对象（不额外取字段），用下面的 `selectinload` 预加载即可，不用手写 join。

常用查询方法：

- `session.execute(sel).scalars().all()` → 取实体对象列表
- `session.execute(sel).scalar_one()` → 唯一一条
- `session.execute(sel).scalar()` → 第一个或 `None`
- `session.get(Model, pk)` → 按主键

### 5. 更新与删除

```python
# 方式一：拿到对象再改（推荐，简单直观）
u = session.get(User, 1)
u.name = "Alice Updated"
session.commit()

# 方式二：批量更新（一步 SQL）
from sqlalchemy import update
session.execute(update(User).where(User.age < 18).values(age=18))
session.commit()

# 删除
u = session.get(User, 1)
session.delete(u)
session.commit()

# 批量删除
from sqlalchemy import delete
session.execute(delete(User).where(User.age > 100))
session.commit()
```

### 6. 关系映射（一对多 / 多对多）

**一对多**（见上面的 User ↔ Post）：用 `ForeignKey` + 双向 `relationship`。

```python
# 查询关联对象
u = session.get(User, 1)
u.posts            # 惰性加载，访问时触发 SQL（N+1 隐患）
posts = u.posts    # 也可在查询时用 selectinload 预加载，见下文
```

**多对多**：需要一张中间表。

```python
from sqlalchemy import Table, Column

# 中间表（关联表，不映射成模型）
post_tags = Table(
    "post_tags", Base.metadata,
    Column("post_id", ForeignKey("posts.id"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id"), primary_key=True),
)

class Tag(Base):
    __tablename__ = "tags"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    posts: Mapped[list["Post"]] = relationship(
        secondary=post_tags, back_populates="tags"
    )

class Post(Base):
    # ... 在 Post 里加：
    tags: Mapped[list["Tag"]] = relationship(
        secondary=post_tags, back_populates="posts"
    )
```

### 7. 避免 N+1：预加载

访问 `u.posts` 默认是惰性加载，循环里取会触发大量 SQL（N+1）。用 `selectinload` / `joinedload`：

```python
from sqlalchemy.orm import selectinload

posts = session.execute(
    select(Post).options(selectinload(Post.author))
).scalars().all()
# selectinload：第二次 IN 查询；joinedload：JOIN 一次查出
```

### 8. 事务与会话管理

- `session.add/delete` 只是**登记**，`session.commit()` 才真正落库。
- `session` 默认开启事务，`commit` 后自动提交并关闭事务。
- 出错会回滚：

```python
try:
    u = session.get(User, 1)
    u.name = "X"
    session.commit()
except Exception:
    session.rollback()   # 回滚到上一次 commit，可继续用
    raise
finally:
    session.close()      # 用后必关
```

推荐用上下文管理器保证关闭：

```python
with SessionLocal() as session:
    u = session.get(User, 1)
    u.name = "Y"
    session.commit()
```

### 9. 异步 SQLAlchemy 2.0

配合 `asyncpg`（PG）或 `aiosqlite`，用 `create_async_engine`：

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db")
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def main():
    async with SessionLocal() as session:
        users = (await session.execute(select(User))).scalars().all()
        print(users)

import asyncio
asyncio.run(main())
```

异步版所有 `execute` 都要 `await`，模型定义完全相同。

## Django ORM 速览（与 SQLAlchemy 对照）

如果你用 Django，ORM 更「一站式」（自带迁移、Admin、关联查询）：

```python
# models.py
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    posts = models.ManyToManyField("Post", related_name="authors")  # 或外键

# 查询（QuerySet 是惰性的）
User.objects.filter(age__gte=18).order_by("-created_at")[:10]
User.objects.get(name="Alice")
User.objects.create(name="Bob")

# 关联：select_related / prefetch_related 解决 N+1
users = User.objects.prefetch_related("posts")
```

Django 的 `objects` 就是它的「Session+select」入口，风格更简洁，但灵活性不如 SQLAlchemy 的 SQL 表达式层。

## 常见坑点

- **N+1 查询**：循环里访问惰性关联触发大量 SQL，用 `selectinload`/`prefetch_related` 预加载。
- **会话泄漏**：`session` 用完没 `close()`，连接池被占满；用 `with` 上下文。
- **循环导入**：模型之间互相引用时用字符串 `"Post"` 关系，或用 `TYPE_CHECKING`。
- **时区**：存 UTC，显示时再转本地；`DateTime(timezone=True)`（PG）。
- **`create_all` 不适用于生产**：改表不会自动迁移，用 Alembic。
- **提交前用 `expire_on_commit=False`（异步）**：否则 commit 后访问属性会重新查库。

## 小结

| 操作 | 写法 |
| --- | --- |
| 建模型 | `Mapped` + `mapped_column`，继承 `DeclarativeBase` |
| 新增 | `session.add(obj)` → `commit` |
| 查询 | `session.execute(select(Model).where(...))` |
| 更新 | 改对象属性 → `commit`，或 `update().values()` |
| 删除 | `session.delete(obj)` 或 `delete().where(...)` |
| 关联 | `ForeignKey` + `relationship(back_populates=...)` |
| 联表查询 | `select(A, B.x.label("y")).join(B, 条件)` |
| 联合唯一 | `__table_args__ = (UniqueConstraint(...),)` |
| 防 N+1 | `options(selectinload(...))` |
| 异步 | `create_async_engine` + `async_sessionmaker` |

写好 ORM 的核心，是把「对象关系」和「数据库关系」对应清楚，其余都是熟练度。

---

**相关资源：**
- [SQLAlchemy 官方文档](https://docs.sqlalchemy.org/en/20/)
- [SQLAlchemy 2.0 ORM 教程](https://docs.sqlalchemy.org/en/20/orm/)
- [Alembic 迁移工具](https://alembic.sqlalchemy.org/)
