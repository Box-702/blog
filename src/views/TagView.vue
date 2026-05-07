<template>
  <div class="tag-page container">
    <header class="tag-header">
      <router-link to="/" class="tag-back">&larr; Home</router-link>
      <h1 class="tag-title">{{ tag }}</h1>
      <p class="tag-count">{{ posts.length }} article(s)</p>
    </header>
    <PostList :posts="posts" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getPostsByTag } from '@/utils/posts'
import PostList from '@/components/PostList.vue'

const props = defineProps({ tag: String })
const posts = computed(() => getPostsByTag(props.tag))
</script>

<style scoped>
.tag-page {
  padding-bottom: var(--space-2xl);
}
.tag-header {
  margin-bottom: var(--space-2xl);
}
.tag-back {
  display: inline-block;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
  transition: color 0.2s;
}
.tag-back:hover {
  color: var(--color-accent);
}
.tag-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  letter-spacing: -1px;
  margin-bottom: var(--space-xs);
}
.tag-count {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
</style>