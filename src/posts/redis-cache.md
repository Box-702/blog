---
title: Redis 操作与缓存策略速查
date: 2026-09-08
tags: [Redis, 缓存, Python]
category: 后端
summary: 缓存操作就是围绕 Redis 做存、取、删、判断、过期。记录 redis-py 的四个核心命令、一层简单的缓存封装，以及 Cache-Aside 读写策略和穿透、击穿、雪崩三个经典问题的应对。
---

# Redis 操作与缓存策略速查

> 一句话：缓存操作就是围绕 Redis 做「存、取、删、判断、过期」，让数据访问更快、数据库压力更小。Redis 存储数据的方式是 key – value。

## 四个核心操作

`pip install redis`，先拿到连接：

```python
import redis

r = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)
```

`decode_responses=True` 让返回值是 `str` 而不是 `bytes`，Web 项目里基本必加。

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `setex` | `setex(key, expire, value)` | 设置缓存并指定过期时间（秒），原子操作 |
| `get` | `get(key)` | 获取缓存值，不存在返回 `None` |
| `delete` | `delete(key)` | 删除指定的缓存键 |
| `exists` | `exists(key)` | 检查键是否存在，存在返回 1，否则 0 |

```python
r.setex("user:1", 300, "tom")   # 存 300 秒
r.get("user:1")                  # 'tom'；过期后为 None
r.exists("user:1")               # 1 或 0
r.delete("user:1")               # 删除
```

要点：

- ✅ 一切缓存都该有过期时间，`setex` 一步完成「存 + 过期」，优先于 `set`。
- ✅ key 用统一前缀分层命名：`user:1`、`post:42:likes`，方便排查和批量清理。

## 封装一层缓存操作

直接在业务里散写 `r.setex` 很快会失控，包一层把「前缀、默认过期时间、序列化」收口：

```python
import json

class Cache:
    def __init__(self, r, prefix="app:", default_ttl=300):
        self.r = r
        self.prefix = prefix
        self.default_ttl = default_ttl

    def _k(self, key):
        return self.prefix + key

    def set(self, key, value, ttl=None):
        self.r.setex(self._k(key), ttl or self.default_ttl,
                     json.dumps(value, ensure_ascii=False))

    def get(self, key):
        val = self.r.get(self._k(key))
        return json.loads(val) if val is not None else None

    def delete(self, key):
        self.r.delete(self._k(key))

    def exists(self, key):
        return bool(self.r.exists(self._k(key)))
```

- 统一 JSON 序列化，业务层只跟 Python 对象打交道。
- 统一默认 TTL，忘写过期时间也不会留下永久僵尸缓存。

## 缓存策略：Cache-Aside（旁路缓存）

最常用的模式，一句话：**读走缓存、未命中查库回填；写先更新数据库、再删缓存**。

读：

```python
def get_user(uid):
    user = cache.get(f"user:{uid}")
    if user is not None:
        return user                          # ① 命中，直接返回
    user = db.query(User).get(uid)           # ② 未命中，查数据库
    if user:
        cache.set(f"user:{uid}", user)       # ③ 回填缓存
    return user
```

写：

```python
def update_user(uid, data):
    db.update(User, uid, data)               # ① 先更新数据库
    cache.delete(f"user:{uid}")               # ② 再删缓存（不是更新缓存）
```

为什么是「删缓存」而不是「改缓存」：

- 写多读少时，改完的缓存可能一次都没被读，白写。
- 并发写时两次更新到达顺序不确定，缓存可能留下旧值；删除让下次读自然回填，永远一致。

## 三个经典问题

| 问题 | 场景 | 应对 |
| --- | --- | --- |
| **缓存穿透** | 查询根本不存在的数据，每次都打到数据库 | 缓存空值（短 TTL）；参数校验；布隆过滤器 |
| **缓存击穿** | 热点 key 过期瞬间，大量请求同时压到数据库 | 互斥锁只放一个请求去回填；热点数据不过期 |
| **缓存雪崩** | 大批 key 同一时刻过期，数据库被整体冲垮 | TTL 加随机抖动，错开过期时间 |

两个最常写的招：

```python
import random

def cache_set(key, value, base=300):
    # TTL 加随机值，避免大量 key 同时过期（防雪崩）
    cache.set(key, value, ttl=base + random.randint(0, 60))

def get_user_safe(uid):
    key = f"user:{uid}"
    user = cache.get(key)
    if user is not None:
        return user
    user = db.query(User).get(uid)
    if user is None:
        cache.r.setex(key, 60, "null")       # 空值缓存 60 秒（防穿透）
        return None
    cache_set(key, user)
    return user
```

## 小结

| 操作/策略 | 做法 |
| --- | --- |
| 存 + 过期 | `setex(key, expire, value)` |
| 取 | `get(key)`，不存在返回 `None` |
| 删 | `delete(key)` |
| 判断 | `exists(key)` |
| 读策略 | Cache-Aside：未命中查库后回填 |
| 写策略 | 先更新数据库，再删缓存 |
| 防穿透 | 缓存空值 / 布隆过滤器 |
| 防击穿 | 互斥锁回填 / 热点不过期 |
| 防雪崩 | TTL 加随机值 |

缓存的本质是用「多一层判断」换「少一次数据库查询」，前提是过期和失效策略想清楚，否则一致性只会更糟。

---

**相关资源：**
- [Redis 官方文档](https://redis.io/docs/latest/)
- [redis-py GitHub](https://github.com/redis/redis-py)
