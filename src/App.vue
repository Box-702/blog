<template>
  <NavBar />
  <main class="main">
    <router-view />
  </main>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<style scoped>
.main {
  min-height: calc(100vh - 60px);
  padding-top: var(--space-xl);
}
</style>
