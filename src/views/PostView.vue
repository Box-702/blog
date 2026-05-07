<template>
  <article v-if="post" class="post container">
    <header class="post-header">
      <router-link to="/" class="post-back">&larr; Back</router-link>
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-meta">
        <time class="post-date" :datetime="post.date">{{ formatDate(post.date) }}</time>
        <span class="post-reading-time">{{ readingTime }}</span>
      </div>
      <div v-if="post.tags.length" class="post-tags">
        <TagBadge v-for="tag in post.tags" :key="tag" :tag="tag" />
      </div>
    </header>
    <TableOfContents :content="post.content" />
    <div class="post-content" ref="postContent" v-html="renderedContent" />
    <PrevNextNav :current-slug="post.slug" />
    <CommentSection />
  </article>
  <div v-else class="container">
    <p class="post-not-found">Article not found.</p>
    <router-link to="/" class="post-back-link">&larr; Back to home</router-link>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, nextTick } from 'vue'
import { getPost } from '@/utils/posts'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.min.css'
import { useSEO } from '@/composables/useSEO'
import TagBadge from '@/components/TagBadge.vue'
import CommentSection from '@/components/CommentSection.vue'
import TableOfContents from '@/components/TableOfContents.vue'
import PrevNextNav from '@/components/PrevNextNav.vue'

const props = defineProps({ slug: String })
const post = computed(() => getPost(props.slug))

// Configure marked with highlight.js
marked.setOptions({
  breaks: true,
  gfm: true,
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  }
})

const renderedContent = computed(() => {
  if (!post.value) return ''
  return marked.parse(post.value.content)
})

const readingTime = computed(() => {
  if (!post.value) return ''
  const words = post.value.content.replace(/[#*`\[\]()>\-|=_]/g, '').split(/\s+/).length
  const mins = Math.max(1, Math.ceil(words / 250))
  return `${mins} min read`
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Add IDs to headings for TOC linking
function addHeadingIds() {
  const content = document.querySelector('.post-content')
  if (!content) return
  content.querySelectorAll('h2, h3').forEach(h => {
    h.id = h.textContent.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/(^-|-$)/g, '')
  })
}

onMounted(() => {
  if (post.value) {
    useSEO({ title: post.value.title, description: post.value.summary })
  }
  nextTick(addHeadingIds)
})

watch(renderedContent, () => nextTick(addHeadingIds))
watch(() => props.slug, () => {
  if (post.value) {
    useSEO({ title: post.value.title, description: post.value.summary })
  }
})
</script>

<style scoped>
.post {
  padding-bottom: var(--space-2xl);
}
.post-header { margin-bottom: var(--space-2xl); }
.post-back { display: inline-block; font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-lg); transition: color 0.2s; }
.post-back:hover { color: var(--color-accent); }
.post-title { font-size: var(--text-3xl); font-weight: 700; letter-spacing: -1px; line-height: 1.3; margin-bottom: var(--space-md); }
.post-meta { display: flex; align-items: center; gap: var(--space-md); font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-md); }
.post-reading-time::before { content: "\00B7"; margin-right: var(--space-md); }
.post-tags { display: flex; gap: var(--space-xs); flex-wrap: wrap; }
.post-content { font-size: var(--text-lg); line-height: 1.8; color: var(--color-text); }
.post-content :deep(h2), .post-content :deep(h3) { font-weight: 600; line-height: 1.3; margin-top: var(--space-2xl); margin-bottom: var(--space-md); }
.post-content :deep(h2) { font-size: var(--text-2xl); padding-bottom: var(--space-xs); border-bottom: 1px solid var(--color-border); }
.post-content :deep(h3) { font-size: var(--text-xl); }
.post-content :deep(p) { margin-bottom: var(--space-lg); }
.post-content :deep(ul), .post-content :deep(ol) { margin-bottom: var(--space-lg); padding-left: var(--space-xl); }
.post-content :deep(li) { margin-bottom: var(--space-xs); }
.post-content :deep(blockquote) { border-left: 3px solid var(--color-accent); padding-left: var(--space-md); margin: var(--space-lg) 0; color: var(--color-text-secondary); font-style: italic; }
.post-content :deep(pre) { background: #1e1e1e; border-radius: var(--radius); padding: var(--space-lg); overflow-x: auto; margin: var(--space-lg) 0; font-size: var(--text-sm); }
.post-content :deep(pre code) { background: none; color: #d4d4d4; font-size: 0.875em; padding: 0; }
.post-content :deep(code) { font-family: var(--font-mono); font-size: 0.875em; background: var(--color-code-bg); padding: 0.15em 0.4em; border-radius: 3px; }
.post-content :deep(pre code) { background: none; padding: 0; }
.post-content :deep(a) { text-decoration: underline; }
.post-content :deep(img) { border-radius: var(--radius); }
.post-content :deep(table) { width: 100%; border-collapse: collapse; margin: var(--space-lg) 0; }
.post-content :deep(th), .post-content :deep(td) { border: 1px solid var(--color-border); padding: var(--space-sm) var(--space-md); text-align: left; }
.post-content :deep(th) { background: var(--color-bg-secondary); font-weight: 600; }
.post-not-found { text-align: center; color: var(--color-text-muted); padding: var(--space-2xl) 0; }
.post-back-link { display: block; text-align: center; color: var(--color-accent); }
</style>