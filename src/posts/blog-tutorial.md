---
title: 个人博客搭建教程 — Vue 3 + Vite + GitHub Pages 零成本部署
date: 2026-05-08
tags: [教程, 前端, Vue]
summary: 从零搭建一个 Markdown 驱动的个人博客，支持暗色模式、全文搜索、代码高亮、评论系统，免费部署到 GitHub Pages。包含完整的使用方法和自定义指南。
---

# 个人博客搭建教程

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 (Composition API) | 前端框架 |
| Vite 5 | 构建工具 |
| Vue Router 4 | 页面路由 |
| Markdown + marked | 文章格式与渲染 |
| highlight.js | 代码语法高亮 |
| GitHub Pages | 免费托管与自动部署 |

无需后端、无需数据库、无需服务器。文章写在 Markdown 文件里，推送即更新。

## 项目结构

```
blog/
├── src/
│   ├── views/
│   │   ├── HomeView.vue      # 首页
│   │   ├── PostView.vue      # 文章详情页
│   │   └── TagView.vue       # 标签筛选页
│   ├── components/
│   │   ├── NavBar.vue        # 顶部导航 + 暗色切换
│   │   ├── PostCard.vue      # 文章卡片
│   │   ├── PostList.vue      # 文章列表容器
│   │   ├── SearchBar.vue     # 搜索栏
│   │   ├── TagBadge.vue      # 标签徽章
│   │   ├── TagCloud.vue      # 标签云
│   │   ├── TableOfContents.vue # 文章目录
│   │   ├── PrevNextNav.vue   # 上一篇/下一篇
│   │   ├── CommentSection.vue # Giscus 评论
│   │   ├── ProfileSection.vue # 个人简介
│   │   └── SiteFooter.vue    # 页脚
│   ├── composables/
│   │   ├── useDarkMode.js    # 暗色模式逻辑
│   │   ├── useSearch.js      # 搜索逻辑
│   │   └── useSEO.js         # SEO meta 标签
│   ├── styles/
│   │   ├── variables.css     # CSS 变量（亮色/暗色双主题）
│   │   └── global.css        # 全局样式
│   ├── utils/posts.js        # 文章数据层
│   ├── posts/                # 文章 Markdown 文件
│   └── router/index.js       # 路由配置
└── vite.config.js
```

## 如何新建文章

### 第一步：写 Markdown 文件

在 `src/posts/` 目录下新建一个 `.md` 文件，比如 `my-article.md`。

文件开头必须包含 frontmatter（用 `---` 包裹的元信息）：

```markdown
---
title: 文章标题
date: 2026-05-08
tags: [标签1, 标签2]
summary: 文章摘要，显示在首页卡片和 SEO 描述中
---

正文内容从这里开始...

## 二级标题

正文段落...

### 三级标题

代码块示例：

```js
console.log('hello world')
```

> 引用文字

- 列表项1
- 列表项2
```

### 第二步：注册文章

打开 `src/utils/posts.js`，在文件顶部添加两行：

```js
// 在 import 区域添加
import myArticleRaw from '../posts/my-article.md?raw'

// 在 postFiles 对象中添加
const postFiles = {
  '../posts/hello-world.md': helloWorldRaw,
  '../posts/vue3-composition-api.md': vue3Raw,
  '../posts/my-article.md': myArticleRaw,  // 新增这一行
}
```

就这么两步，刷新页面就能看到新文章了。

## 自定义博客

### 修改个人信息

编辑 `src/components/ProfileSection.vue`，改名称、简介、链接。

### 修改头像

在同一个文件里替换 `<img src="...">` 的地址。

### 调整配色

编辑 `src/styles/variables.css`，修改亮色和暗色主题的颜色变量。

### 更换代码高亮主题

在 `src/views/PostView.vue` 中修改 import：

```js
// GitHub Dark 主题
import 'highlight.js/styles/github-dark.min.css'

// 可选的其他主题：
// import 'highlight.js/styles/github.min.css'
// import 'highlight.js/styles/monokai.min.css'
// import 'highlight.js/styles/atom-one-dark.min.css'
```

完整列表见 [highlight.js demo 页面](https://highlightjs.org/demo)。

## 启用评论

本博客使用 Giscus 评论系统，所有评论存储在 GitHub Discussions 中。

1. 访问 [giscus.app](https://giscus.app)
2. 在配置区填入 `Box-702/blog`
3. 按提示开启 Discussions 功能
4. 复制生成的 `data-repo-id` 和 `data-category-id`
5. 填入 `src/components/CommentSection.vue` 的对应位置

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（热更新）
npm run dev
# 访问 http://localhost:5173

# 构建生产版本
npm run build
# 输出到 dist/
```

## 部署

本博客使用 GitHub Pages + Actions 自动部署。每次 `git push` 到 master 分支，GitHub 自动构建并发布。

如需部署到自己账号：
1. Fork 此仓库
2. 修改 `vite.config.js` 中 `base: '/你的仓库名/'`
3. 在仓库 Settings > Pages 中，Source 选 GitHub Actions

## 小结

这个博客的核心理念是 **简单可控**。没有框架黑盒，每个文件都是标准 Vue 组件或纯 Markdown。掌握它，你就理解了现代静态博客的工作原理。

如果这篇文章对你有帮助，欢迎在下方留言。