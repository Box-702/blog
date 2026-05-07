<template>
  <nav v-if="prev || next" class="prev-next">
    <router-link v-if="prev" :to="`/post/${prev.slug}`" class="pn-link pn-prev">
      <span class="pn-label">Previous</span>
      <span class="pn-title">{{ prev.title }}</span>
    </router-link>
    <span v-else class="pn-empty"></span>
    <router-link v-if="next" :to="`/post/${next.slug}`" class="pn-link pn-next">
      <span class="pn-label">Next</span>
      <span class="pn-title">{{ next.title }}</span>
    </router-link>
    <span v-else class="pn-empty"></span>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { getAllPosts } from '@/utils/posts'

const props = defineProps({ currentSlug: String })

const allPosts = getAllPosts()
const currentIdx = allPosts.findIndex(p => p.slug === props.currentSlug)
const prev = computed(() => currentIdx < allPosts.length - 1 ? allPosts[currentIdx + 1] : null)
const next = computed(() => currentIdx > 0 ? allPosts[currentIdx - 1] : null)
</script>

<style scoped>
.prev-next {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-top: var(--space-2xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
}
.pn-link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  transition: border-color 0.2s, background 0.2s;
}
.pn-link:hover {
  border-color: var(--color-accent);
  background: var(--color-bg-secondary);
}
.pn-prev {
  align-items: flex-start;
}
.pn-next {
  align-items: flex-end;
  text-align: right;
}
.pn-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.pn-title {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
}
.pn-empty {
  display: none;
}
</style>