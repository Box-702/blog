---
title: FastAPI 响应封装：用 Pydantic 给 ORM 对象做一层「翻译」
date: 2026-09-06
tags: [Python, FastAPI, Pydantic]
category: 后端
summary: 数据库里的 ORM 对象不能直接返回给前端。以注册接口为例，记录怎么用 Pydantic 的三层模型过滤敏感字段、转换响应结构，以及 from_attributes、by_alias 这几个关键配置各自干什么。
---

# FastAPI 响应封装：用 Pydantic 给 ORM 对象做一层「翻译」

要解决的问题只有一个：`crud.create_user()` 返回的 ORM User 对象不能直接丢给前端——里面有加密后的 password，而且前端要的是 `userInfo` 这种驼峰结构。所以中间加一层 Pydantic 模型做翻译。

## 三个模型，各管一件事

```python
class UserInfoBase(BaseModel):
    """一份用户资料长什么样"""
    nickname: Optional[str] = Field(None, max_length=50)
    avatar: Optional[str] = Field(None, max_length=255)
    gender: Optional[str] = None
    bio: Optional[str] = Field(None, max_length=255)

class UserInfoResponse(UserInfoBase):
    """完整的用户（对外展示版）"""
    id: int
    username: str
    model_config = ConfigDict(from_attributes=True)

class UserAuthResponse(BaseModel):
    """登录/注册的最终响应"""
    token: str
    # 前端要的键名是 userInfo，Python 变量名做不到驼峰开头，用别名
    user_info: UserInfoResponse = Field(..., alias="userInfo")
    model_config = ConfigDict(populate_by_name=True)
```

- `UserInfoBase`：资料字段全是 `Optional`，因为注册时允许为空。`max_length` 和数据库的 `String(50)`、`String(255)` 一一对应，超长数据在这一层就被拦下，到不了数据库。
- `UserInfoResponse`：补上 `id` 和 `username`。注意它**没有** password 字段——模型里没声明的字段，输出时自然不会出现，这就是过滤敏感信息的全部原理。
- `UserAuthResponse`：套上外层 `{token, userInfo}`，对应前端期望的结构。

## 注册接口的完整数据流

```python
# ① crud.create_user() 返回 ORM 对象
User(id=1, username='tom', password='$2b$12$...', nickname=None, ...)

# ② 从 ORM 对象属性取值，只挑模型声明的字段
resp = UserInfoResponse.model_validate(new_user)
# ✂️ password 在这一步被自然丢弃

# ③ 套上外层
data = UserAuthResponse(token='xxx', user_info=resp)

# ④ 序列化，user_info 按 alias 输出为 userInfo
data.model_dump(by_alias=True)
# {'token': 'xxx', 'userInfo': {'id': 1, 'username': 'tom', ...}}

# ⑤ 包上统一的 {code, message, data} 返回给前端
```

login 完全一样，只是第①步换成查库得到的 user。

`from_attributes=True` 是这套机制的核心开关：没有它，`model_validate()` 只接受字典；有了它，Pydantic 会去对象属性上逐个取值（`obj.id`、`obj.username`……），所以可以直接喂一个 SQLAlchemy 对象。

## 两个容易懵的点

**构造时用 `user_info=`，输出却变成 `userInfo`**——这是 `populate_by_name=True`（构造时认字段名）和 `by_alias=True`（输出时认别名）这对配置配合的结果。构造和序列化各用一套名字，互不冲突。

**为什么不直接把 ORM 对象塞进字典**——FastAPI 默认的 JSON 编码器遇到 SQLAlchemy 对象会把它的 `__dict__`（包括 `_sa_instance_state` 内部状态）全翻出来，结果不可控。先过一层 `model_validate` 相当于声明了一份白名单，白名单之外的（password、内部状态）一概不带出去。

最后，路由里手工拼 `{code, message, data}` 外壳的部分，和 `utils/response.py` 里的 `success_response` 是兼容的——后者做的是同一件事的另一半（统一外壳 + `jsonable_encoder` 兜底），想让 register/login 也走它，直接把 `data` 传进去就行。
