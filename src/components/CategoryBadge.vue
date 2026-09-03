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
  font-weight: 600;
  color: #fff;
  background: var(--color-accent);
  padding: 3px 12px;
  border-radius: 12px;
  transition: opacity 0.2s;
}
.category-badge:hover {
  opacity: 0.82;
}
</style>
