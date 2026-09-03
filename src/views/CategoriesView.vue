<template>
  <div class="categories-page container">
    <header class="categories-header">
      <router-link to="/" class="categories-back">&larr; Home</router-link>
      <h1 class="categories-title">Categories</h1>
      <p class="categories-subtitle">{{ categories.length }} categories</p>
    </header>

    <section v-for="cat in categories" :key="cat.name" class="category-group">
      <router-link :to="`/category/${cat.name}`" class="category-heading">
        <h2 class="category-name">{{ cat.name }}</h2>
        <span class="category-count">{{ cat.count }} article(s)</span>
      </router-link>
      <PostList :posts="getPostsByCategory(cat.name)" />
    </section>

    <p v-if="!categories.length" class="categories-empty">No categories yet.</p>
  </div>
</template>

<script setup>
import { getAllCategories, getPostsByCategory } from '@/utils/posts'
import PostList from '@/components/PostList.vue'

const categories = getAllCategories()
</script>

<style scoped>
.categories-page {
  padding-bottom: var(--space-2xl);
}
.categories-header {
  margin-bottom: var(--space-2xl);
}
.categories-back {
  display: inline-block;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
  transition: color 0.2s;
}
.categories-back:hover {
  color: var(--color-accent);
}
.categories-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  letter-spacing: -1px;
  margin-bottom: var(--space-xs);
}
.categories-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
.category-group {
  margin-bottom: var(--space-2xl);
}
.category-heading {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}
.category-name {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text);
  transition: color 0.2s;
}
.category-heading:hover .category-name {
  color: var(--color-accent);
}
.category-count {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
.categories-empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-2xl) 0;
}
</style>
