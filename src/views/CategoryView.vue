<template>
  <div class="category-page container">
    <div class="layout layout-2col">
      <main class="layout-main">
        <header class="category-header">
          <router-link to="/" class="category-back">&larr; 首页</router-link>
          <h1 class="category-title">{{ category }}</h1>
          <p class="category-count">{{ posts.length }} 篇文章</p>
        </header>
        <PostList :posts="posts" />
      </main>
      <aside class="layout-side is-sticky">
        <CategoryCloud />
        <TagCloud />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getPostsByCategory } from '@/utils/posts'
import PostList from '@/components/PostList.vue'
import CategoryCloud from '@/components/CategoryCloud.vue'
import TagCloud from '@/components/TagCloud.vue'

const props = defineProps({ category: String })
const posts = computed(() => getPostsByCategory(props.category))
</script>

<style scoped>
.category-page { padding-bottom: var(--space-2xl); }
.category-header { margin-bottom: var(--space-2xl); }
.category-back { display: inline-block; font-size: var(--text-sm); color: var(--color-text-muted); margin-bottom: var(--space-lg); transition: color 0.2s; }
.category-back:hover { color: var(--color-accent); }
.category-title { font-size: var(--text-3xl); font-weight: 700; letter-spacing: -1px; margin-bottom: var(--space-xs); }
.category-count { font-size: var(--text-sm); color: var(--color-text-muted); }
</style>
