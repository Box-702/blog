<template>
  <div class="home container">
    <section class="hero">
      <h1 class="hero-title">写代码、工具，以及做东西的手艺。</h1>
      <p class="hero-sub">
        关于前端、算法与开发工具的笔记：Vue、CSS、Git、Docker 和 LeetCode。
        一边学一边写，脚印都是新的。
      </p>
      <div class="hero-stats">
        <span class="stat">{{ posts.length }} 篇文章</span>
        <span class="stat">{{ categories.length }} 个分类</span>
        <span class="stat">{{ tags.length }} 个标签</span>
      </div>
    </section>

    <div class="layout layout-2col">
      <main class="layout-main">
        <SearchBar />
        <PostList :posts="posts" />
      </main>
      <aside class="layout-side is-sticky">
        <ProfileSection />
        <CategoryCloud />
        <TagCloud />
        <Blogroll />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { getAllPosts, getAllCategories, getAllTags } from '@/utils/posts'
import { useSEO } from '@/composables/useSEO'
import PostList from '@/components/PostList.vue'
import SearchBar from '@/components/SearchBar.vue'
import TagCloud from '@/components/TagCloud.vue'
import CategoryCloud from '@/components/CategoryCloud.vue'
import ProfileSection from '@/components/ProfileSection.vue'
import Blogroll from '@/components/Blogroll.vue'

const posts = getAllPosts()
const categories = getAllCategories()
const tags = getAllTags()

onMounted(() => {
  useSEO({ title: '', description: '一个关于前端、算法与开发工具的个人博客。', type: 'website', url: '/' })
})
</script>

<style scoped>
.home {
  padding-bottom: var(--space-2xl);
}
.hero {
  margin: var(--space-2xl) 0 var(--space-2xl);
  max-width: 720px;
}
.hero-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1.15;
  margin-bottom: var(--space-md);
}
.hero-sub {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: var(--space-lg);
}
.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}
.stat {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
</style>
