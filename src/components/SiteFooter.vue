<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-left">
        <span>&copy; {{ year }} My Blog</span>
        <span class="footer-sep">|</span>
        <a href="https://github.com/Box-702/blog" target="_blank" rel="noopener">GitHub</a>
      </div>
      <div class="footer-right">
        <a href="rss.xml" target="_blank">RSS</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  border-top: 1px solid var(--color-border);
  padding: var(--space-xl) 0;
  margin-top: var(--space-2xl);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}
.footer-inner { display: flex; justify-content: space-between; align-items: center; }
.footer-left { display: flex; align-items: center; gap: var(--space-sm); }
.footer-sep { color: var(--color-border); }
.footer-left a, .footer-right a { color: var(--color-text-muted); }
.footer-left a:hover, .footer-right a:hover { color: var(--color-accent); }
</style>