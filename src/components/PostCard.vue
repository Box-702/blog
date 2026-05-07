<template>
  <article class="post-card">
    <router-link :to="`/post/${post.slug}`" class="post-card-link">
      <h2 class="post-title">{{ post.title }}</h2>
    </router-link>
    <div class="post-meta">
      <time class="post-date" :datetime="post.date">{{ formatDate(post.date) }}</time>
      <span class="post-reading-time">{{ readingTime }}</span>
    </div>
    <p v-if="post.summary" class="post-summary">{{ post.summary }}</p>
    <div v-if="post.tags.length" class="post-tags">
      <TagBadge v-for="tag in post.tags" :key="tag" :tag="tag" />
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import TagBadge from './TagBadge.vue'

const props = defineProps({ post: Object })

const readingTime = computed(() => {
  const words = (props.post.content || '').replace(/[#*`\[\]()>\-|=_]/g, '').split(/\s+/).length
  const mins = Math.max(1, Math.ceil(words / 250))
  return `${mins} min read`
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.post-card {
  padding: var(--space-xl) 0;
  border-bottom: 1px solid var(--color-border);
  transition: padding-left 0.2s;
}
.post-card:first-child { padding-top: 0; }
.post-card:hover { padding-left: var(--space-sm); }
.post-card-link { display: block; margin-bottom: var(--space-sm); }
.post-title { font-size: var(--text-xl); font-weight: 600; color: var(--color-text); line-height: 1.4; transition: color 0.2s; }
.post-title:hover { color: var(--color-accent); }
.post-meta { display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm); }
.post-date { font-size: var(--text-sm); color: var(--color-text-muted); }
.post-reading-time { font-size: var(--text-xs); color: var(--color-text-muted); }
.post-reading-time::before { content: "\00B7"; margin-right: var(--space-sm); }
.post-summary { font-size: var(--text-base); color: var(--color-text-secondary); line-height: 1.6; margin-bottom: var(--space-md); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.post-tags { display: flex; gap: var(--space-xs); flex-wrap: wrap; }
</style>