<template>
  <div class="progress-bar" :style="{ width: percent + '%' }" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const percent = ref(0)

function onScroll() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  percent.value = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: var(--color-accent);
  z-index: 200;
  transition: width 0.1s linear;
}
</style>