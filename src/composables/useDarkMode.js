import { ref, watchEffect } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  const saved = localStorage.getItem('blog-theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
  }
  watchEffect(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('blog-theme', isDark.value ? 'dark' : 'light')
  })
  function toggle() { isDark.value = !isDark.value }
  return { isDark, toggle }
}
