---
title: JSON-RPC 2.0 速览
date: 2026-09-11
tags: [JSON-RPC, 协议, RPC]
category: 后端
summary: JSON-RPC 是一个用 JSON 传消息的轻量远程调用协议：一个请求对象 + 一个响应对象，加上通知、批量与标准错误码。记录请求/响应结构、四类错误码和 Python 最小示例。
---

# JSON-RPC 2.0 速览

> 一句话：JSON-RPC 就是用 JSON 传「调用方法 + 传参」和「返回结果」的轻量 RPC 协议，无状态、与传输层无关（HTTP / WebSocket / TCP 都行）。

## 请求与响应

请求对象固定三个字段，`id` 用来把响应和请求对上：

```json
{
  "jsonrpc": "2.0",
  "method": "user.get",
  "params": { "id": 1 },
  "id": 1
}
```

响应对象二选一：成功给 `result`，失败给 `error`，两者不会同时出现：

```json
{ "jsonrpc": "2.0", "result": { "name": "tom" }, "id": 1 }
```

```json
{ "jsonrpc": "2.0", "error": { "code": -32601, "message": "Method not found" }, "id": 1 }
```

要点：

- `params` 可以是对象（按名传参）或数组（按位置传参），省略即无参。
- 响应里的 `id` 必须和请求一致；解析不到请求（如 JSON 解析失败）时 `id` 为 `null`。

## 通知与批量

**通知**：不带 `id` 的请求，服务端不返回任何东西，用于「发了不管」。

```json
{ "jsonrpc": "2.0", "method": "log.write", "params": { "msg": "hi" } }
```

**批量**：请求体是数组，服务端返回数组，顺序不限，按 `id` 对应。

```json
[
  { "jsonrpc": "2.0", "method": "user.get", "params": { "id": 1 }, "id": 1 },
  { "jsonrpc": "2.0", "method": "user.get", "params": { "id": 2 }, "id": 2 }
]
```

- 批量里全是通知时，服务端返回空、不返回数组。
- 单个请求也要按协议回错误对象，而不是 HTTP 500。

## 标准错误码

| code | 含义 |
| --- | --- |
| `-32700` | Parse error：JSON 解析失败 |
| `-32600` | Invalid Request：不是合法请求对象 |
| `-32601` | Method not found：方法不存在 |
| `-32602` | Invalid params：参数不合法 |
| `-32603` | Internal error：服务端内部错误 |
| `-32000 ~ -32099` | 预留，服务端自定义业务错误 |

`error` 里可附 `data` 放细节，`message` 保持一句话。

## Python 最小服务端

```python
import json

def handle(req):
    if req.get("jsonrpc") != "2.0" or "method" not in req:
        return {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": req.get("id")}
    method, params = req["method"], req.get("params", {})
    result = {"user.get": lambda p: {"id": p["id"], "name": "tom"}}.get(method)
    if result is None:
        return {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": req.get("id")}
    return {"jsonrpc": "2.0", "result": result(params), "id": req.get("id")}
```

- 分发就是「方法名 → 处理函数」的字典，别用一长串 if。
- 无论成功失败都返回 200，错误放进 body 的 `error` 字段。

## 小结

| 概念 | 规则 |
| --- | --- |
| 请求 | `jsonrpc` + `method` + `params` + `id` |
| 成功响应 | `result` + 同 `id` |
| 失败响应 | `error{code,message,data}` + 同 `id` |
| 通知 | 无 `id`，不返回 |
| 批量 | 数组进、数组出，按 `id` 对应 |
| 错误码 | -32700 ~ -32603 标准，-32000 起自定义 |

它常被拿来做 MCP、LSP 这类工具协议的底座：只规定消息长什么样，怎么传输由你决定。

---

**相关资源：**
- [JSON-RPC 2.0 规范](https://www.jsonrpc.org/specification)
