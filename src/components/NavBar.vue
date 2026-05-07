<template>
  <header class="navbar">
    <div class="container nav-inner">
      <router-link to="/" class="nav-logo">My Blog</router-link>
      <nav class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>
        <button @click="toggle" class="theme-btn" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <span v-if="isDark" class="theme-icon">&#9790;</span>
          <span v-else class="theme-icon">&#9728;</span>
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useDarkMode } from '@/composables/useDarkMode'
const { isDark, toggle } = useDarkMode()
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 56px;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(8px);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
.nav-logo {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.5px;
}
.nav-logo:hover {
  color: var(--color-accent);
}
.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}
.nav-link {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  transition: color 0.2s;
}
.nav-link:hover,
.nav-link.router-link-exact-active {
  color: var(--color-text);
}
.theme-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text);
  font-size: 16px;
  transition: background 0.2s, border-color 0.2s;
}
.theme-btn:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-text-muted);
}
</style>