<template>
  <router-link :to="`/tag/${tag}`" class="tag-badge">{{ tag }}</router-link>
</template>

<script setup>
defineProps({ tag: String })
</script>

<style scoped>
.tag-badge {
  display: inline-block;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-tag-text);
  background: var(--color-tag-bg);
  padding: 2px 10px;
  border-radius: 12px;
  transition: opacity 0.2s;
}
.tag-badge:hover {
  opacity: 0.8;
}
</style>