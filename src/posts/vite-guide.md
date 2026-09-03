---
title: Vite 入门指南
date: 2026-05-07
tags: [工具]
category: 前端
summary: 了解为什么 Vite 成为现代前端开发的首选构建工具。
---

# Vite 入门指南

Vite 是下一代前端构建工具，由 Vue 作者尤雨溪开发。

## 为什么选择 Vite

### 极速的开发体验

Vite 利用浏览器原生 ES 模块，实现了**毫秒级**的冷启动：

```javascript
// 不再需要打包整个应用
// 浏览器直接请求模块
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

### 按需编译

传统工具（如 Webpack）需要打包所有模块，而 Vite 只在请求时编译：

| 工具 | 冷启动时间 | 热更新速度 |
|------|-----------|-----------|
| Webpack | 10-30s | 1-3s |
| Vite | 300ms | 50ms |

## 快速开始

```bash
# 创建项目
npm create vite@latest my-app -- --template vue

# 安装依赖
cd my-app
npm install

# 启动开发服务器
npm run dev
```

## 核心特性

### 1. 插件系统

Vite 使用 Rollup 插件接口：

```javascript
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()]
}
```

### 2. CSS 预处理器

开箱即用支持 Sass、Less、Stylus：

```vue
<style lang="scss">
$primary: #42b883;

.button {
  background: $primary;
  &:hover {
    darken($primary, 10%);
  }
}
</style>
```

### 3. 环境变量

```bash
# .env
VITE_API_URL=https://api.example.com
```

```javascript
console.log(import.meta.env.VITE_API_URL)
```

## 生产构建

Vite 使用 Rollup 进行生产构建，自动优化：

- Tree Shaking
- 代码分割
- CSS 提取
- 资源哈希

```bash
npm run build
```

## 总结

Vite 的优势：

- ✅ 极速冷启动
- ✅ 即时热更新
- ✅ 开箱即用
- ✅ 优秀的 TypeScript 支持
- ✅ 丰富的插件生态

如果你还在使用 Webpack，强烈建议尝试 Vite！

---

**相关资源：**
- [Vite 官方文档](https://vitejs.dev)
- [Vite GitHub](https://github.com/vitejs/vite)
