<template>
  <div class="tags-page container">
    <header class="page-header">
      <router-link to="/" class="page-back">&larr; Home</router-link>
      <h1 class="page-title">Tags</h1>
      <p class="page-subtitle">{{ tags.length }} tags</p>
    </header>

    <div v-if="tags.length" class="tag-grid">
      <router-link
        v-for="tag in tags"
        :key="tag.name"
        :to="`/tag/${tag.name}`"
        class="tag-grid-item"
      >
        <span class="tag-grid-name">{{ tag.name }}</span>
        <span class="tag-grid-count">{{ tag.count }}</span>
      </router-link>
    </div>
    <p v-else class="page-empty">No tags yet.</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { getAllTags } from '@/utils/posts'
import { useSEO } from '@/composables/useSEO'

const tags = getAllTags()

onMounted(() => {
  useSEO({ title: 'Tags', description: 'Browse blog articles by tag.', type: 'website', url: '/tags' })
})
</script>

<style scoped>
.tags-page { padding-bottom: var(--space-2xl); }
.page-header { margin-bottom: var(--space-2xl); }
.page-back { display: inline-block; font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-lg); transition: color 0.2s; }
.page-back:hover { color: var(--color-accent); }
.page-title { font-size: var(--text-3xl); font-weight: 700; letter-spacing: -1px; margin-bottom: var(--space-xs); }
.page-subtitle { font-size: var(--text-sm); color: var(--color-text-muted); }
.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}
.tag-grid-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
  padding: 6px 14px;
  border-radius: 18px;
  font-size: var(--text-sm);
  font-weight: 500;
  transition: opacity 0.2s;
}
.tag-grid-item:hover { opacity: 0.8; }
.tag-grid-count { font-size: var(--text-xs); color: var(--color-text-muted); }
.page-empty { text-align: center; color: var(--color-text-muted); padding: var(--space-2xl) 0; }
</style>
