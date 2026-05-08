<template>
  <ReadingProgress />
  <NavBar />
  <main class="main">
    <router-view />
  </main>
  <SiteFooter />
  <BackToTop />
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import BackToTop from '@/components/BackToTop.vue'
import ReadingProgress from '@/components/ReadingProgress.vue'
</script>

<style scoped>
.main {
  min-height: calc(100vh - 56px - 80px);
  padding-top: var(--space-xl);
}
</style>