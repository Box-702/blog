<template>
  <div class="search-bar">
    <div class="search-input-wrap">
      <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        v-model="query"
        type="text"
        placeholder="Search articles..."
        class="search-input"
        @keydown.escape="query = ''"
      />
      <button v-if="query" class="search-clear" @click="query = ''" title="Clear">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <ul v-if="results.length" class="search-results">
      <li v-for="post in results" :key="post.slug" class="search-result-item">
        <router-link :to="`/post/${post.slug}`" @click="query = ''">
          <span class="result-title">{{ post.title }}</span>
          <span class="result-tags">
            <TagBadge v-for="tag in post.tags" :key="tag" :tag="tag" />
          </span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useSearch } from '@/composables/useSearch'
import TagBadge from './TagBadge.vue'
const { query, results } = useSearch()
</script>

<style scoped>
.search-bar {
  position: relative;
  margin-bottom: var(--space-xl);
}
.search-input-wrap {
  display: flex;
  align-items: center;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0 var(--space-md);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-input-wrap:focus-within {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
.search-icon {
  color: var(--color-text-muted);
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  border: none;
  background: none;
  padding: 10px var(--space-sm);
  font-size: var(--text-base);
  font-family: inherit;
  color: var(--color-text);
  outline: none;
}
.search-input::placeholder {
  color: var(--color-text-muted);
}
.search-clear {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}
.search-clear:hover {
  color: var(--color-text);
}
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  margin-top: 4px;
  list-style: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  z-index: 50;
  max-height: 320px;
  overflow-y: auto;
}
.search-result-item {
  border-bottom: 1px solid var(--color-border);
}
.search-result-item:last-child {
  border-bottom: none;
}
.search-result-item a {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text);
  transition: background 0.15s;
}
.search-result-item a:hover {
  background: var(--color-bg-secondary);
}
.result-title {
  font-size: var(--text-sm);
  font-weight: 500;
}
.result-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
</style>