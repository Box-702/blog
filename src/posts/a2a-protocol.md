---
title: Agent-to-Agent（A2A）协议速览
date: 2026-09-11
tags: [A2A, Agent, 协议]
category: 后端
summary: A2A 是让不同厂商、不同框架的 AI Agent 互相发现与协作的开放协议。记录 Agent Card、Task、Message、Artifact 四个核心概念，方法列表，以及它和 MCP 的分工。
---

# Agent-to-Agent（A2A）协议速览

> 一句话：A2A（Agent2Agent）让一个 Agent 能发现并调用另一个 Agent 的能力，跨厂商、跨框架，底层消息走 JSON-RPC 2.0。

## 和 MCP 的分工

两个协议常被一起提，但管的事不同：

| | MCP | A2A |
| --- | --- | --- |
| 连接 | Agent ↔ **工具/数据** | Agent ↔ **Agent** |
| 视角 | 我怎么用工具 | 我怎么委托另一个 Agent |
| 粒度 | 函数、资源、提示词 | 任务（Task） |

一句话记：**MCP 管「用工具」，A2A 管「找同事」**。

## 四个核心概念

| 概念 | 作用 |
| --- | --- |
| **Agent Card** | Agent 的名片，描述自己是谁、会什么、怎么调 |
| **Task** | 一次委托的工作单元，有状态、可查询、可取消 |
| **Message** | 双方对话消息，由若干 Part 组成（文本/文件/数据） |
| **Artifact** | 任务产出的结果（文件、结构化数据） |

## Agent Card

放在 `/.well-known/agent-card.json`，客户端靠它发现能力：

```json
{
  "name": "weather-agent",
  "description": "查询城市天气",
  "url": "https://example.com/a2a",
  "version": "1.0.0",
  "capabilities": { "streaming": true, "pushNotifications": false },
  "skills": [
    { "id": "get-weather", "name": "查天气", "description": "给定城市返回当前天气",
      "tags": ["weather"], "examples": ["北京今天天气"] }
  ]
}
```

- `skills` 是能力清单，客户端据此把任务路由给对应 Agent。
- `capabilities` 声明是否支持流式（SSE）和推送通知。

## 方法列表

A2A 方法本身是 JSON-RPC 的 `method`：

| 方法 | 作用 |
| --- | --- |
| `message/send` | 发消息，同步拿回任务结果 |
| `message/stream` | 发消息，SSE 流式返回中间状态 |
| `tasks/get` | 按 id 查任务状态与产出 |
| `tasks/cancel` | 取消任务 |
| `tasks/pushNotificationConfig/set` | 配置长任务完成后的回调 |

## 发一条消息

```json
{
  "jsonrpc": "2.0",
  "method": "message/send",
  "id": 1,
  "params": {
    "message": {
      "role": "user",
      "messageId": "m-1",
      "parts": [{ "kind": "text", "text": "北京今天天气" }]
    }
  }
}
```

返回的是一个 **Task**，不是最终答案——长任务会先返回 `submitted`/`working`，再靠 `tasks/get` 或流式更新拿结果：

```json
{ "jsonrpc": "2.0", "id": 1,
  "result": { "id": "task-1", "status": { "state": "working" } } }
```

要点：

- Task 状态机大致为 `submitted → working → completed / failed / canceled`。
- `parts` 的 `kind` 支持 `text`、`file`、`data`，所以能传文件和结构化数据，不只是聊天。
- 需要过程反馈就用 `message/stream`，别用轮询硬等。

## 小结

| 要点 | 内容 |
| --- | --- |
| 定位 | 跨系统 Agent 互相发现与协作 |
| 传输 | JSON-RPC 2.0，通常跑在 HTTP/SSE 上 |
| 发现 | Agent Card（`/.well-known/agent-card.json`） |
| 工作单元 | Task，有状态、可取消、可查询 |
| 结果 | Artifact；过程用流式或推送通知 |
| 与 MCP | MCP 连工具，A2A 连别的 Agent |

A2A 本质是给 Agent 之间定义了一套「怎么自我介绍、怎么派活、怎么交付」的通用语言，谁实现都不影响互联。

---

**相关资源：**
- [A2A 官方站点](https://a2a-protocol.org/)
- [A2A GitHub（Linux Foundation）](https://github.com/a2aproject/A2A)
