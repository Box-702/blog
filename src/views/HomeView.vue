<template>
  <div class="home container">
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
import { getAllPosts } from '@/utils/posts'
import { useSEO } from '@/composables/useSEO'
import PostList from '@/components/PostList.vue'
import SearchBar from '@/components/SearchBar.vue'
import TagCloud from '@/components/TagCloud.vue'
import CategoryCloud from '@/components/CategoryCloud.vue'
import ProfileSection from '@/components/ProfileSection.vue'
import Blogroll from '@/components/Blogroll.vue'

const posts = getAllPosts()

onMounted(() => {
  useSEO({ title: '', description: 'Thoughts on frontend, code, and life.', type: 'website', url: '/' })
})
</script>

<style scoped>
.home {
  padding-bottom: var(--space-2xl);
}
</style>
