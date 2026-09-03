<template>
  <section v-if="related.length" class="related">
    <h2 class="related-title">相关文章</h2>
    <ul class="related-list">
      <li v-for="p in related" :key="p.slug" class="related-item">
        <router-link :to="`/post/${p.slug}`" class="related-link">
          <span class="related-name">{{ p.title }}</span>
          <span class="related-meta">{{ formatDate(p.date) }}</span>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { getAllPosts } from '@/utils/posts'

const props = defineProps({ current: Object })

const related = computed(() => {
  const all = getAllPosts().filter((p) => p.slug !== props.current?.slug)
  const shared = all.filter(
    (p) =>
      p.category === props.current?.category ||
      (props.current?.tags || []).some((t) => p.tags.includes(t))
  )
  return (shared.length ? shared : all).slice(0, 3)
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.related {
  margin-top: var(--space-2xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
}
.related-title {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--space-lg);
}
.related-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.related-link {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-md);
}
.related-name {
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--color-text);
  transition: color 0.2s;
}
.related-link:hover .related-name {
  color: var(--color-accent);
}
.related-meta {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  flex-shrink: 0;
}
</style>
