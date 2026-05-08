<template>
  <div class="not-found container">
    <h1>404</h1>
    <p>Page not found.</p>
    <router-link to="/" class="nf-link">&larr; Back to home</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: var(--space-2xl) 0;
}
.not-found h1 {
  font-size: 4rem;
  font-weight: 700;
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
}
.not-found p {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xl);
}
.nf-link {
  color: var(--color-accent);
  font-size: var(--text-base);
}
</style>