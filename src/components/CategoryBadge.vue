<template>
  <router-link :to="`/category/${category}`" class="category-badge">{{ category }}</router-link>
</template>

<script setup>
defineProps({ category: String })
</script>

<style scoped>
.category-badge {
  display: inline-block;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-accent);
  background: var(--color-tag-bg);
  padding: 2px 10px;
  border-radius: 12px;
  transition: opacity 0.2s;
}
.category-badge:hover {
  opacity: 0.8;
}
</style>
