<template>
  <div class="post-list">
    <PostCard v-for="post in posts" :key="post.slug" :post="post" />
    <p v-if="!posts.length" class="post-empty">No articles yet.</p>
  </div>
</template>

<script setup>
import PostCard from './PostCard.vue'
defineProps({ posts: Array })
</script>

<style scoped>
.post-empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-2xl) 0;
}
</style>