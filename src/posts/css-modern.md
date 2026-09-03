---
title: 现代 CSS 技巧
date: 2026-05-09
tags: [CSS]
category: 前端
summary: 掌握现代 CSS 特性，让你的样式代码更简洁高效。
---

# 现代 CSS 技巧

CSS 已经进化了很多，让我们看看一些实用的现代特性。

## CSS 变量

CSS 变量（Custom Properties）让样式管理更灵活：

```css
:root {
  --primary-color: #42b883;
  --spacing-unit: 8px;
  --border-radius: 4px;
}

.button {
  background: var(--primary-color);
  padding: var(--spacing-unit) calc(var(--spacing-unit) * 2);
  border-radius: var(--border-radius);
}

/* 暗黑模式 */
@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #5aab8b;
  }
}
```

## Flexbox 布局

### 常见布局模式

```css
/* 水平垂直居中 */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 等分布局 */
.equal-width {
  display: flex;
  gap: 16px;
}

.equal-width > * {
  flex: 1;
}

/* 底部固定 */
.sticky-footer {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.sticky-footer main {
  flex: 1;
}
```

## Grid 布局

### 响应式网格

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

/* 布局 */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

## 容器查询

容器查询让组件根据父容器大小响应：

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: flex;
    gap: 16px;
  }
  
  .card-image {
    width: 200px;
  }
}

@container card (max-width: 399px) {
  .card {
    display: block;
  }
  
  .card-image {
    width: 100%;
  }
}
```

## 嵌套规则

Sass 的嵌套功能现在原生支持了：

```css
/* 传统写法 */
.nav { }
.nav ul { }
.nav ul li { }
.nav ul li a { }

/* 嵌套写法 */
.nav {
  ul {
    list-style: none;
    
    li {
      display: inline-block;
      
      a {
        color: inherit;
        text-decoration: none;
      }
    }
  }
}
```

## 逻辑属性

使用逻辑属性实现更好的国际化支持：

```css
/* 物理属性 */
.box {
  margin-left: 16px;
  margin-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
}

/* 逻辑属性 */
.box {
  margin-inline: 16px;
  padding-block: 8px;
}

/* 更多逻辑属性 */
.logical {
  margin-inline-start: 16px;  /* 左 */
  margin-inline-end: 16px;    /* 右 */
  padding-block-start: 8px;   /* 上 */
  padding-block-end: 8px;     /* 下 */
  border-inline-start: 1px solid;  /* 左边框 */
}
```

## :has() 选择器

父选择器终于来了：

```css
/* 包含图片的卡片 */
.card:has(img) {
  padding: 0;
}

.card:has(img) .card-content {
  padding: 16px;
}

/* 表单验证 */
.form-group:has(:invalid) {
  border-color: red;
}

.form-group:has(:focus) {
  border-color: blue;
}

/* 导航激活状态 */
nav:has(.active) {
  background: rgba(0,0,0,0.05);
}
```

## 平滑滚动

```css
html {
  scroll-behavior: smooth;
}

/* 滚动吸附 */
.scroll-container {
  scroll-snap-type: x mandatory;
  overflow-x: auto;
}

.scroll-item {
  scroll-snap-align: start;
}
```

## 动画性能

使用 `transform` 和 `opacity` 实现高性能动画：

```css
/* 好的动画 */
.good-animation {
  transition: transform 0.3s, opacity 0.3s;
}

.good-animation:hover {
  transform: translateY(-4px);
  opacity: 0.8;
}

/* 避免的动画 */
.bad-animation {
  transition: width 0.3s, height 0.3s;  /* 触发重排 */
}

/* 使用 will-change 提示浏览器 */
.animated-element {
  will-change: transform;
}
```

## 实用技巧

### 1. 文本截断

```css
/* 单行截断 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 多行截断 */
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 2. 自定义滚动条

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.3);
}
```

### 3. 平滑边框

```css
.smooth-border {
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
```

## 总结

现代 CSS 特性：

- ✅ CSS 变量 - 主题管理
- ✅ Flexbox/Grid - 强大布局
- ✅ 容器查询 - 组件响应式
- ✅ :has() 选择器 - 父选择器
- ✅ 逻辑属性 - 国际化支持
- ✅ 嵌套规则 - 更简洁的代码

这些特性让你的 CSS 更强大、更易维护！

---

**相关资源：**
- [MDN CSS 文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS)
- [Can I Use](https://caniuse.com)
- [CSS Tricks](https://css-tricks.com)
