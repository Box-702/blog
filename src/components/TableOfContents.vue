<template>
  <nav v-if="headings.length" class="toc">
    <h4 class="toc-title">目录</h4>
    <a
      v-for="(h, i) in headings"
      :key="i"
      :href="`#${h.id}`"
      class="toc-link"
      :class="[`toc-level-${h.level}`, { 'is-active': activeId === h.id }]"
      @click.prevent="scrollTo(h.id)"
    >{{ h.text }}</a>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({ content: String })
const headings = ref([])
const activeId = ref('')

function extractHeadings() {
  if (!props.content) { headings.value = []; return }
  const matches = props.content.match(/^(#{2,3})\s+(.+)$/gm) || []
  headings.value = matches.map((line) => {
    const level = line.startsWith('###') ? 3 : 2
    const text = line.replace(/^#+\s+/, '')
    const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/(^-|-$)/g, '')
    return { level, text, id }
  })
  activeId.value = headings.value[0]?.id || ''
}

function onScroll() {
  let current = ''
  for (const h of headings.value) {
    const el = document.getElementById(h.id)
    if (el && el.getBoundingClientRect().top <= 96) current = h.id
    else break
  }
  if (current) activeId.value = current
}

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  extractHeadings()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
watch(() => props.content, () => {
  extractHeadings()
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.toc {
  padding-left: var(--space-md);
  border-left: 1px solid var(--color-border);
}
.toc-title {
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-sm);
}
.toc-link {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  padding: 4px 0;
  line-height: 1.4;
  transition: color 0.15s;
}
.toc-link:hover {
  color: var(--color-accent);
}
.toc-link.is-active {
  color: var(--color-text);
  font-weight: 500;
}
.toc-level-3 {
  padding-left: var(--space-md);
}
</style>
