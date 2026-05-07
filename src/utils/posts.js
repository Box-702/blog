import grayMatter from 'gray-matter'

const modules = import.meta.glob('../posts/*.md', { eager: true, query: '?raw', import: 'default' })

export function getAllPosts() {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const slug = path.replace('../posts/', '').replace('.md', '')
      const { data, content } = grayMatter(raw)
      return { slug, title: data.title || slug, date: data.date || '', tags: data.tags || [], summary: data.summary || '', content }
    })
    .filter(p => !p.title.startsWith('_'))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPost(slug) {
  return getAllPosts().find(p => p.slug === slug)
}

export function getAllTags() {
  const tagMap = {}
  getAllPosts().forEach(post => {
    post.tags.forEach(tag => { tagMap[tag] = (tagMap[tag] || 0) + 1 })
  })
  return Object.entries(tagMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
}

export function getPostsByTag(tag) {
  return getAllPosts().filter(p => p.tags.includes(tag))
}
