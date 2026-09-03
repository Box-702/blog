import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/post/:slug', name: 'post', component: () => import('@/views/PostView.vue'), props: true },
  { path: '/tag/:tag', name: 'tag', component: () => import('@/views/TagView.vue'), props: true },
  { path: '/category/:category', name: 'category', component: () => import('@/views/CategoryView.vue'), props: true },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFound.vue') }
]

export default createRouter({ history: createWebHashHistory(), routes })