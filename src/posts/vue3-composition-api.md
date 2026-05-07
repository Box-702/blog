---
title: Vue 3 组合式 API 入门笔记
date: 2026-05-05
tags: [Vue, 前端]
summary: ref、reactive、computed、watch 的基本用法和踩坑记录。
---

# Vue 3 组合式 API 入门笔记

## ref vs reactive

`ref` 用于基本类型，`reactive` 用于对象：

```js
import { ref, reactive } from "vue"

const count = ref(0)
const user = reactive({ name: "Alice", age: 20 })
```

模板中用 `ref` 不需要 `.value`，Vue 会自动解包。

## computed

```js
const double = computed(() => count.value * 2)
```

只有当依赖变化时才会重新计算。

## 总结

组合式 API 让逻辑复用变得简单，写起来比 Options API 更灵活。
