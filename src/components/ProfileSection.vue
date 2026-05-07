<template>
  <section class="profile">
    <img
      class="profile-avatar"
      src="https://github.com/Box-702.png"
      alt="Avatar"
    />
    <div class="profile-info">
      <h2 class="profile-name">Box</h2>
      <p class="profile-bio">Frontend learner. Writing about code, design, and everyday discoveries.</p>
      <div class="profile-links">
        <a href="https://github.com/Box-702" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile {
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
  padding-bottom: var(--space-2xl);
  border-bottom: 1px solid var(--color-border);
}
.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid var(--color-border);
}
.profile-name {
  font-size: var(--text-xl);
  font-weight: 600;
  margin-bottom: var(--space-xs);
}
.profile-bio {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-sm);
}
.profile-links a {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
.profile-links a:hover {
  color: var(--color-accent);
}
</style>