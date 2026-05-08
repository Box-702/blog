<template>
  <div class="home container">
    <ProfileSection />
    <SearchBar />
    <PostList :posts="posts" />
    <TagCloud />
    <Blogroll />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { getAllPosts } from '@/utils/posts'
import { useSEO } from '@/composables/useSEO'
import PostList from '@/components/PostList.vue'
import SearchBar from '@/components/SearchBar.vue'
import TagCloud from '@/components/TagCloud.vue'
import ProfileSection from '@/components/ProfileSection.vue'
import Blogroll from '@/components/Blogroll.vue'

const posts = getAllPosts()

onMounted(() => {
  useSEO({ title: '', description: 'Thoughts on frontend, code, and life.' })
})
</script>

<style scoped>
.home { padding-bottom: var(--space-2xl); }
</style>