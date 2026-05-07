<template>
  <NavBar />
  <main class="main">
    <router-view />
  </main>
  <SiteFooter />
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
</script>

<style scoped>
.main {
  min-height: calc(100vh - 56px - 80px);
  padding-top: var(--space-xl);
}
</style>