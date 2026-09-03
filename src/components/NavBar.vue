<template>
  <header class="navbar">
    <div class="container nav-inner">
      <router-link to="/" class="nav-logo">My Blog</router-link>

      <button
        class="nav-toggle"
        :class="{ 'is-active': menuOpen }"
        @click="menuOpen = !menuOpen"
        :aria-expanded="menuOpen"
        aria-label="Toggle navigation"
      >
        <span></span><span></span><span></span>
      </button>

      <nav class="nav-links" :class="{ 'is-open': menuOpen }">
        <router-link to="/" class="nav-link" @click="menuOpen = false">Home</router-link>
        <router-link to="/categories" class="nav-link" @click="menuOpen = false">Categories</router-link>
        <router-link to="/tags" class="nav-link" @click="menuOpen = false">Tags</router-link>
        <router-link to="/archive" class="nav-link" @click="menuOpen = false">Archive</router-link>
        <button @click="toggle" class="theme-btn" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <span v-if="isDark" class="theme-icon">&#9790;</span>
          <span v-else class="theme-icon">&#9728;</span>
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
const { isDark, toggle } = useDarkMode()
const menuOpen = ref(false)
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

/* Mobile hamburger */
.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 34px;
  height: 34px;
  padding: 8px;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
}
.nav-toggle span {
  display: block;
  height: 2px;
  width: 100%;
  background: var(--color-text);
  border-radius: 2px;
  transition: transform 0.25s ease-out, opacity 0.2s;
}
.nav-toggle.is-active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-toggle.is-active span:nth-child(2) { opacity: 0; }
.nav-toggle.is-active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 959px) {
  .nav-toggle { display: flex; }
  .nav-links {
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    padding: var(--space-sm) var(--space-lg) var(--space-lg);
    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  }
  .nav-links.is-open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
  .nav-link {
    padding: var(--space-sm) 0;
    border-bottom: 1px solid var(--color-border);
  }
  .nav-link:last-of-type { border-bottom: none; }
  .theme-btn { margin-top: var(--space-sm); align-self: flex-start; }
}
</style>
