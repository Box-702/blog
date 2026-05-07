import helloWorldRaw from '../posts/hello-world.md?raw'
import vue3Raw from '../posts/vue3-composition-api.md?raw'

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const yamlBlock = match[1]
  const content = match[2] || ''
  const data = {}
  yamlBlock.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) return
    const key = line.slice(0, colonIdx).trim()
    let value = line.slice(colonIdx + 1).trim()
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''))
    } else if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1)
    }
    data[key] = value
  })
  return { data, content }
}

const postFiles = {
  '../posts/hello-world.md': helloWorldRaw,
  '../posts/vue3-composition-api.md': vue3Raw
}

// To add a new post, add both:
// 1. import newPostRaw from '../posts/new-post.md?raw'
// 2. '../posts/new-post.md': newPostRaw  in the postFiles object

export function getAllPosts() {
  return Object.entries(postFiles)
    .map(([path, raw]) => {
      const slug = path.replace('../posts/', '').replace('.md', '')
      const { data, content } = parseFrontmatter(raw)
      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
        summary: data.summary || '',
        content
      }
    })
    .filter(p => p.title && !p.title.startsWith('_'))
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