<template>
  <aside class="tag-cloud">
    <h3 class="tag-cloud-title">Tags</h3>
    <div class="tag-cloud-list">
      <router-link
        v-for="tag in tags"
        :key="tag.name"
        :to="`/tag/${tag.name}`"
        class="tag-cloud-item"
      >
        {{ tag.name }}
        <span class="tag-count">{{ tag.count }}</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { getAllTags } from '@/utils/posts'
const tags = getAllTags()
</script>

<style scoped>
.tag-cloud {
  margin-top: var(--space-2xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
}
.tag-cloud-title {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: var(--space-md);
}
.tag-cloud-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}
.tag-cloud-item {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  padding: 4px 12px;
  border-radius: 16px;
  transition: background 0.2s, color 0.2s;
}
.tag-cloud-item:hover {
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
}
.tag-count {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-left: 4px;
}
</style>