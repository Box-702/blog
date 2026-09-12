---
title: Function Calling 与 MCP 速览
date: 2026-09-12
tags: [Function Calling, MCP, Agent, 协议]
category: 后端
summary: Function Calling 管模型怎么表达要调哪个工具，MCP 管工具怎么标准化地供出来。记录两者的调用流程、MCP 的三种原语与传输方式，以及它们如何配合工作。
---

# Function Calling 与 MCP 速览

> 一句话：Function Calling 是模型「说我要调这个工具」，MCP 是工具「按统一协议对外提供」。前者是模型能力，后者是接入标准。

## Function Calling 是什么

模型不执行代码，只输出一段结构化的调用意图（工具名 + JSON 参数），真正执行的是你的应用。

请求里声明可用工具：

```json
{
  "model": "gpt-4o",
  "messages": [{ "role": "user", "content": "北京现在天气怎么样？" }],
  "tools": [{
    "type": "function",
    "function": {
      "name": "get_weather",
      "description": "查询指定城市的当前天气",
      "parameters": {
        "type": "object",
        "properties": { "city": { "type": "string", "description": "城市名" } },
        "required": ["city"]
      }
    }
  }]
}
```

模型返回的不是自然语言，而是 `tool_calls`：

```json
{
  "role": "assistant",
  "content": null,
  "tool_calls": [{
    "id": "call_abc",
    "type": "function",
    "function": { "name": "get_weather", "arguments": "{\"city\":\"北京\"}" }
  }]
}
```

要点：

- `arguments` 是 JSON **字符串**而不是对象，拿到后要自己 parse。
- `id` 用于把执行结果对上，并行调用时每个 call 一个 id。
- `tool_choice` 控制是否强制调用：`auto` / `required` / 指定某个工具 / `none`。
- 加 `strict: true` 让模型输出严格符合 JSON Schema，减少解析失败。

## 一次调用的完整循环

```
用户提问
  → 模型返回 tool_calls
  → 应用执行函数，把结果作为 role:"tool" 消息追加
  → 带上结果再次请求模型
  → 模型给出最终回答
```

回填结果：

```json
{ "role": "tool", "tool_call_id": "call_abc", "content": "{\"temp\": 24, \"desc\": \"晴\"}" }
```

- 循环可能跑多轮（模型连续调多个工具），要设最大轮数兜底。
- 函数执行报错也要回填，让模型知道失败原因，别直接抛给用户。

## 为什么还需要 MCP

Function Calling 只规定了「模型怎么要工具」，没规定「工具从哪来」。每个应用都得自己写一遍工具定义、鉴权、连接，N 个模型 × M 个工具就是 N×M 份适配代码。

MCP（Model Context Protocol）把这一层标准化成 **Host / Client / Server** 三角：

| 角色 | 说明 |
| --- | --- |
| **Host** | 宿主应用（Claude Desktop、Cursor、IDE），管模型与会话 |
| **Client** | Host 内部组件，与一个 Server 保持 1:1 连接 |
| **Server** | 对外暴露能力的服务，可以是本地进程或远程服务 |

Server 提供三种原语，按「谁来决定使用」区分：

| 原语 | 谁控制 | 用途 |
| --- | --- | --- |
| **Tools** | 模型 | 可执行的函数，模型自己决定调 |
| **Resources** | 应用 | 只读上下文（文件、数据库行），由应用挑选后塞给模型 |
| **Prompts** | 用户 | 预置模板，通常暴露成斜杠命令 |

## MCP 怎么传

底层是 JSON-RPC 2.0，两种主流传输：

| 传输 | 场景 |
| --- | --- |
| **stdio** | 本地进程，Host 起子进程走标准输入输出，最常用 |
| **Streamable HTTP** | 远程服务，单个 HTTP 端点，可升级为 SSE 流式返回 |

一次工具调用的消息（Client → Server）：

```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/call",
  "params": { "name": "get_weather", "arguments": { "city": "北京" } } }
```

四个高频方法：

| 方法 | 作用 |
| --- | --- |
| `initialize` | 握手，交换协议版本与能力 |
| `tools/list` | 拉取工具清单（含 JSON Schema） |
| `tools/call` | 执行工具 |
| `resources/read` | 读取资源内容 |

## 两者怎么配合

MCP Server 的 `tools/list` 返回的工具描述，Host 直接转成模型的 `tools` 参数；模型 function call 命中后，Host 再翻译成 `tools/call` 发给 Server：

```
tools/list（MCP）       →  tools（Function Calling）
tool_calls（模型返回）   →  tools/call（MCP）
工具结果                →  role:"tool" 消息回填
```

一句话记：**Function Calling 是模型侧的「调用意图」，MCP 是基础设施侧的「工具供给标准」**，两者互补而非替代。

## 小结

| 对比 | Function Calling | MCP |
| --- | --- | --- |
| 归属 | 模型 API 能力 | 开放协议 |
| 解决 | 模型怎么表达调用 | 工具怎么标准化接入 |
| 协议 | 各家 API 自定（结构类似） | JSON-RPC 2.0 |
| 执行方 | 你的应用代码 | MCP Server |
| 原语 | tools | tools / resources / prompts |
| 关系 | 决定调什么 | 决定从哪调、怎么调 |

---

**相关资源：**
- [MCP 官方文档](https://modelcontextprotocol.io/)
- [MCP 规范](https://spec.modelcontextprotocol.io/)
- [OpenAI Function Calling 文档](https://platform.openai.com/docs/guides/function-calling)
