import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PostView from '@/views/PostView.vue'
import TagView from '@/views/TagView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/post/:slug', name: 'post', component: PostView, props: true },
  { path: '/tag/:tag', name: 'tag', component: TagView, props: true }
]

export default createRouter({ history: createWebHistory(), routes })
