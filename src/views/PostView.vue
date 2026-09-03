<template>
  <div v-if="post" class="container">
    <div class="layout layout-2col">
      <main class="layout-main">
        <nav class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="bc-sep">/</span>
          <router-link v-if="post.category" :to="`/category/${post.category}`">{{ post.category }}</router-link>
          <template v-if="post.category"><span class="bc-sep">/</span></template>
          <span class="bc-current">{{ post.title }}</span>
        </nav>

        <article class="post">
          <details class="toc-mobile">
            <summary>目录</summary>
            <TableOfContents :content="post.content" />
          </details>

          <header class="post-header">
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-meta">
              <time class="post-date" :datetime="post.date">{{ formatDate(post.date) }}</time>
              <span class="post-reading-time">{{ readingTime }}</span>
            </div>
            <div v-if="post.category || post.tags.length" class="post-tags">
              <CategoryBadge v-if="post.category" :category="post.category" />
              <TagBadge v-for="tag in post.tags" :key="tag" :tag="tag" />
            </div>
          </header>

          <div class="post-content" ref="postContent" v-html="renderedContent" />
          <PrevNextNav :current-slug="post.slug" />
          <RelatedPosts :current="post" />
        </article>
        <CommentSection />
      </main>

      <aside class="layout-side is-sticky toc-sidebar">
        <TableOfContents :content="post.content" />
      </aside>
    </div>
  </div>
  <div v-else class="container">
    <p class="post-not-found">文章不存在。</p>
    <router-link to="/" class="post-back-link">&larr; 返回首页</router-link>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, nextTick } from 'vue'
import { getPost } from '@/utils/posts'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import markdown from 'highlight.js/lib/languages/markdown'
import xml from 'highlight.js/lib/languages/xml'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import 'highlight.js/styles/github-dark.min.css'
import { useSEO } from '@/composables/useSEO'
import TagBadge from '@/components/TagBadge.vue'
import CategoryBadge from '@/components/CategoryBadge.vue'
import CommentSection from '@/components/CommentSection.vue'
import TableOfContents from '@/components/TableOfContents.vue'
import PrevNextNav from '@/components/PrevNextNav.vue'
import RelatedPosts from '@/components/RelatedPosts.vue'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('dockerfile', dockerfile)

const props = defineProps({ slug: String })
const post = computed(() => getPost(props.slug))

// Map a few non-core fence languages to a registered highlighter; the rest
// fall back to auto-detection.
const LANG_ALIASES = { vue: 'xml', bash: 'bash' }

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const l = (lang && LANG_ALIASES[lang]) || lang
    if (l && hljs.getLanguage(l)) {
      return hljs.highlight(code, { language: l }).value
    }
    return hljs.highlightAuto(code).value
  }
}))

marked.setOptions({ breaks: true, gfm: true })

const renderedContent = computed(() => {
  if (!post.value) return ''
  return marked.parse(post.value.content)
})

const readingTime = computed(() => {
  if (!post.value) return ''
  const words = post.value.content.replace(/[#*`\[\]()>\-|=_]/g, '').split(/\s+/).length
  const mins = Math.max(1, Math.ceil(words / 250))
  return `${mins} 分钟阅读`
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Add IDs to headings for TOC, lazy-load images, add copy buttons
function enhanceContent() {
  const content = document.querySelector('.post-content')
  if (!content) return

  // Heading IDs
  content.querySelectorAll('h2, h3').forEach(h => {
    h.id = h.textContent.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/(^-|-$)/g, '')
  })

  // Lazy load images
  content.querySelectorAll('img').forEach(img => {
    img.loading = 'lazy'
  })

  // Add copy buttons to code blocks
  content.querySelectorAll('pre').forEach(pre => {
    if (pre.querySelector('.copy-btn')) return
    const btn = document.createElement('button')
    btn.className = 'copy-btn'
    btn.textContent = 'Copy'
    btn.onclick = () => {
      const code = pre.querySelector('code')
      if (code) {
        navigator.clipboard.writeText(code.textContent || '')
        btn.textContent = 'Copied'
        setTimeout(() => { btn.textContent = 'Copy' }, 2000)
      }
    }
    pre.style.position = 'relative'
    pre.appendChild(btn)
  })
}

onMounted(() => {
  if (post.value) {
    useSEO({
      title: post.value.title,
      description: post.value.summary,
      type: 'article',
      url: `/post/${post.value.slug}`,
      publishedTime: post.value.date,
      tags: post.value.tags,
      image: post.value.image
    })
  }
  nextTick(enhanceContent)
})

watch(renderedContent, () => nextTick(enhanceContent))
watch(() => props.slug, () => {
  if (post.value) {
    useSEO({
      title: post.value.title,
      description: post.value.summary,
      type: 'article',
      url: `/post/${post.value.slug}`,
      publishedTime: post.value.date,
      tags: post.value.tags,
      image: post.value.image
    })
  }
})
</script>

<style scoped>
.post { padding-bottom: var(--space-2xl); }
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: var(--space-xl) 0 var(--space-xl);
}
.breadcrumb a { color: var(--color-text-muted); }
.breadcrumb a:hover { color: var(--color-accent); }
.bc-sep { color: var(--color-border); }
.bc-current {
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.toc-mobile {
  background: var(--color-bg-secondary);
  border-radius: var(--radius);
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-xl);
}
.toc-mobile summary {
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  color: var(--color-text-secondary);
}
.toc-sidebar { display: none; }
@media (min-width: 960px) {
  .toc-sidebar { display: block; }
  .toc-mobile { display: none; }
}
.post-header { margin-bottom: var(--space-2xl); }
.post-back { display: inline-block; font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-lg); transition: color 0.2s; }
.post-back:hover { color: var(--color-accent); }
.post-title { font-size: var(--text-3xl); font-weight: 700; letter-spacing: -1px; line-height: 1.3; margin-bottom: var(--space-md); }
.post-meta { display: flex; align-items: center; gap: var(--space-md); font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-md); }
.post-reading-time::before { content: "\00B7"; margin-right: var(--space-md); }
.post-tags { display: flex; gap: var(--space-sm); flex-wrap: wrap; margin-top: var(--space-sm); }
.post-content { font-size: var(--text-lg); line-height: 1.8; color: var(--color-text); max-width: var(--max-width); }
.post-content :deep(h2), .post-content :deep(h3) { font-weight: 600; line-height: 1.3; margin-top: var(--space-2xl); margin-bottom: var(--space-md); }
.post-content :deep(h2) { font-size: var(--text-2xl); padding-bottom: var(--space-xs); border-bottom: 1px solid var(--color-border); }
.post-content :deep(h3) { font-size: var(--text-xl); }
.post-content :deep(p) { margin-bottom: var(--space-lg); }
.post-content :deep(ul), .post-content :deep(ol) { margin-bottom: var(--space-lg); padding-left: var(--space-xl); }
.post-content :deep(li) { margin-bottom: var(--space-xs); }
.post-content :deep(blockquote) { border-left: 3px solid var(--color-accent); padding-left: var(--space-md); margin: var(--space-lg) 0; color: var(--color-text-secondary); font-style: italic; }
.post-content :deep(pre) { background: #1e1e1e; border-radius: var(--radius); padding: var(--space-lg); overflow-x: auto; margin: var(--space-lg) 0; font-size: var(--text-sm); position: relative; }
.post-content :deep(pre code) { background: none; color: #d4d4d4; font-size: 0.875em; padding: 0; }
.post-content :deep(code) { font-family: var(--font-mono); font-size: 0.875em; background: var(--color-code-bg); padding: 0.15em 0.4em; border-radius: 3px; }
.post-content :deep(pre code) { background: none; padding: 0; }
.post-content :deep(a) { text-decoration: underline; }
.post-content :deep(img) { border-radius: var(--radius); max-width: 100%; height: auto; }
.post-content :deep(table) { width: 100%; border-collapse: collapse; margin: var(--space-lg) 0; }
.post-content :deep(th), .post-content :deep(td) { border: 1px solid var(--color-border); padding: var(--space-sm) var(--space-md); text-align: left; }
.post-content :deep(th) { background: var(--color-bg-secondary); font-weight: 600; }

/* Copy button */
.post-content :deep(.copy-btn) {
  position: absolute; top: 8px; right: 8px;
  padding: 4px 10px; font-size: 11px; font-family: var(--font-sans);
  background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.15); border-radius: 4px;
  cursor: pointer; transition: all 0.2s;
}
.post-content :deep(.copy-btn:hover) {
  background: rgba(255,255,255,0.2); color: #fff;
}

.post-not-found { text-align: center; color: var(--color-text-muted); padding: var(--space-2xl) 0; }
.post-back-link { display: block; text-align: center; color: var(--color-accent); }
</style>