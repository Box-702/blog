<template>
  <div class="home container">
    <header class="home-header">
      <h1 class="home-title">Blog</h1>
      <p class="home-desc">Thoughts on frontend, code, and life.</p>
    </header>
    <SearchBar />
    <PostList :posts="posts" />
  </div>
</template>

<script setup>
import { getAllPosts } from '@/utils/posts'
import PostList from '@/components/PostList.vue'
import SearchBar from '@/components/SearchBar.vue'

const posts = getAllPosts()
</script>

<style scoped>
.home {
  padding-bottom: var(--space-2xl);
}
.home-header {
  margin-bottom: var(--space-2xl);
}
.home-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  letter-spacing: -1px;
  margin-bottom: var(--space-xs);
}
.home-desc {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
}
</style>