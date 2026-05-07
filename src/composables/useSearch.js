import { ref, computed } from 'vue'
import { getAllPosts } from '@/utils/posts'

export function useSearch() {
  const query = ref('')
  const allPosts = getAllPosts()
  const results = computed(() => {
    if (!query.value.trim()) return []
    const q = query.value.toLowerCase()
    return allPosts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.summary.toLowerCase().includes(q)
    )
  })
  return { query, results }
}
