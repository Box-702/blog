<template>
  <aside class="category-cloud">
    <h3 class="category-cloud-title">分类</h3>
    <div class="category-cloud-list">
      <router-link
        v-for="cat in categories"
        :key="cat.name"
        :to="`/category/${cat.name}`"
        class="category-cloud-item"
      >
        {{ cat.name }}
        <span class="category-count">{{ cat.count }}</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { getAllCategories } from '@/utils/posts'
const categories = getAllCategories()
</script>

<style scoped>
.category-cloud {
  margin-top: var(--space-2xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
}
.category-cloud-title {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: var(--space-md);
}
.category-cloud-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}
.category-cloud-item {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  padding: 4px 12px;
  border-radius: 16px;
  transition: background 0.2s, color 0.2s;
}
.category-cloud-item:hover {
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
}
.category-count {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-left: 4px;
}
</style>
