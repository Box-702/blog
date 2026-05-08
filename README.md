# My Blog

> Personal blog built with Vue 3 + Vite + Markdown. [box-702.github.io/blog](https://box-702.github.io/blog/)

## Features

- Markdown-driven: write articles as `.md` files with frontmatter
- Dark mode with CSS variables
- Client-side full-text search
- Code syntax highlighting (highlight.js)
- Article table of contents
- Giscus comments
- RSS feed
- SEO meta tags
- Responsive design

## Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production build to dist/
```

## Adding a New Article

1. Create a `.md` file in `src/posts/` with frontmatter:

```markdown
---
title: Article Title
date: 2026-05-08
tags: [Tag1, Tag2]
summary: Brief summary shown on card
---

Content here...
```

2. Register in `src/utils/posts.js`:

```js
import newPost from '../posts/new-post.md?raw'
// Add to postFiles object
'../posts/new-post.md': newPost,
```

## Deployment

Auto-deployed to GitHub Pages via Actions on push to master.