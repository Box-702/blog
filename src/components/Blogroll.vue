<template>
  <aside class="blogroll">
    <h3 class="blogroll-title">Friends</h3>
    <ul class="blogroll-list">
      <li v-for="link in links" :key="link.name" class="blogroll-item">
        <a :href="link.url" target="_blank" rel="noopener">{{ link.name }}</a>
        <span class="blogroll-desc">{{ link.desc }}</span>
      </li>
    </ul>
  </aside>
</template>

<script setup>
// Edit this list to add/remove friend links
const links = [
  { name: 'GitHub', url: 'https://github.com/Box-702', desc: 'My GitHub' }
]
</script>

<style scoped>
.blogroll {
  margin-top: var(--space-2xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
}
.blogroll-title {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: var(--space-md);
}
.blogroll-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
.blogroll-item {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
}
.blogroll-item a {
  font-size: var(--text-sm);
  font-weight: 500;
  flex-shrink: 0;
}
.blogroll-desc {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
</style>
