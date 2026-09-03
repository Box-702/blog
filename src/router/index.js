import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PostView from '@/views/PostView.vue'
import TagView from '@/views/TagView.vue'
import CategoryView from '@/views/CategoryView.vue'
import CategoriesView from '@/views/CategoriesView.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/post/:slug', name: 'post', component: PostView, props: true },
  { path: '/tag/:tag', name: 'tag', component: TagView, props: true },
  { path: '/category/:category', name: 'category', component: CategoryView, props: true },
  { path: '/categories', name: 'categories', component: CategoriesView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
]

export default createRouter({ history: createWebHashHistory(), routes })