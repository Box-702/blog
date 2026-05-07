<template>
  <section class="comments-section">
    <h2 class="comments-heading">Comments</h2>
    <div ref="giscusRef" class="comments-container" />
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const giscusRef = ref(null)

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'YOUR_USERNAME/YOUR_REPO')
  script.setAttribute('data-repo-id', 'YOUR_REPO_ID')
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', 'preferred_color_scheme')
  script.setAttribute('data-lang', 'zh-CN')
  script.crossOrigin = 'anonymous'
  script.async = true
  giscusRef.value?.appendChild(script)
})
</script>

<style scoped>
.comments-section {
  margin-top: var(--space-2xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
}
.comments-heading {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--space-lg);
}
</style>