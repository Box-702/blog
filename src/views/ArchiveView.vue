<template>
  <div class="archive-page container">
    <header class="page-header">
      <router-link to="/" class="page-back">&larr; Home</router-link>
      <h1 class="page-title">Archive</h1>
      <p class="page-subtitle">{{ posts.length }} posts</p>
    </header>

    <section v-for="group in grouped" :key="group.year" class="archive-group">
      <h2 class="archive-year">{{ group.year }}</h2>
      <PostList :posts="group.posts" />
    </section>
    <p v-if="!posts.length" class="page-empty">No posts yet.</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { getAllPosts } from '@/utils/posts'
import { useSEO } from '@/composables/useSEO'
import PostList from '@/components/PostList.vue'

const posts = getAllPosts()

const grouped = computed(() => {
  const map = {}
  posts.forEach((p) => {
    const year = (p.date || '').slice(0, 4) || 'Unknown'
    ;(map[year] ||= []).push(p)
  })
  return Object.entries(map)
    .map(([year, yearPosts]) => ({ year, posts: yearPosts }))
    .sort((a, b) => b.year.localeCompare(a.year))
})

onMounted(() => {
  useSEO({ title: 'Archive', description: 'All blog posts grouped by year.', type: 'website', url: '/archive' })
})
</script>

<style scoped>
.archive-page { padding-bottom: var(--space-2xl); }
.page-header { margin-bottom: var(--space-2xl); }
.page-back { display: inline-block; font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-lg); transition: color 0.2s; }
.page-back:hover { color: var(--color-accent); }
.page-title { font-size: var(--text-3xl); font-weight: 700; letter-spacing: -1px; margin-bottom: var(--space-xs); }
.page-subtitle { font-size: var(--text-sm); color: var(--color-text-muted); }
.archive-group { margin-bottom: var(--space-2xl); }
.archive-year {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border);
}
.page-empty { text-align: center; color: var(--color-text-muted); padding: var(--space-2xl) 0; }
</style>
