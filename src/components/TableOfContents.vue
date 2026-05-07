<template>
  <nav v-if="headings.length" class="toc">
    <h4 class="toc-title">Contents</h4>
    <ul class="toc-list">
      <li
        v-for="(h, i) in headings"
        :key="i"
        :class="['toc-item', `toc-level-${h.level}`]"
      >
        <a :href="`#${h.id}`" @click.prevent="scrollTo(h.id)">{{ h.text }}</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({ content: String })
const headings = ref([])

function extractHeadings() {
  if (!props.content) { headings.value = []; return }
  const matches = props.content.match(/^(#{2,3})\s+(.+)$/gm) || []
  headings.value = matches.map(line => {
    const level = line.startsWith('###') ? 3 : 2
    const text = line.replace(/^#+\s+/, '')
    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/(^-|-$)/g, '')
    return { level, text, id }
  })
}

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(extractHeadings)
watch(() => props.content, extractHeadings)
</script>

<style scoped>
.toc {
  background: var(--color-bg-secondary);
  border-radius: var(--radius);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
}
.toc-title {
  font-size: var(--text-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-sm);
}
.toc-list {
  list-style: none;
}
.toc-item {
  margin-bottom: 4px;
}
.toc-level-2 {
  padding-left: 0;
}
.toc-level-3 {
  padding-left: var(--space-lg);
}
.toc-item a {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
.toc-item a:hover {
  color: var(--color-accent);
}
</style>