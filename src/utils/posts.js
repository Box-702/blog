import vue3Raw from '../posts/vue3-composition-api.md?raw'
import tutorialRaw from '../posts/blog-tutorial.md?raw'
import viteGuideRaw from '../posts/vite-guide.md?raw'
import gitWorkflowRaw from '../posts/git-workflow.md?raw'
import cssModernRaw from '../posts/css-modern.md?raw'
import dockerComposeRaw from '../posts/docker-compose-guide.md?raw'
import leetcode42Raw from '../posts/leetcode-42-trapping-rain-water.md?raw'
import pythonOrmRaw from '../posts/python-orm.md?raw'
import pydanticResponseRaw from '../posts/pydantic-response-wrapper.md?raw'
import redisCacheRaw from '../posts/redis-cache.md?raw'
import jsonRpcRaw from '../posts/json-rpc.md?raw'
import a2aProtocolRaw from '../posts/a2a-protocol.md?raw'

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
  '../posts/vue3-composition-api.md': vue3Raw,
  '../posts/blog-tutorial.md': tutorialRaw,
  '../posts/vite-guide.md': viteGuideRaw,
  '../posts/git-workflow.md': gitWorkflowRaw,
  '../posts/css-modern.md': cssModernRaw,
  '../posts/docker-compose-guide.md': dockerComposeRaw,
  '../posts/leetcode-42-trapping-rain-water.md': leetcode42Raw,
  '../posts/python-orm.md': pythonOrmRaw,
  '../posts/pydantic-response-wrapper.md': pydanticResponseRaw,
  '../posts/redis-cache.md': redisCacheRaw,
  '../posts/json-rpc.md': jsonRpcRaw,
  '../posts/a2a-protocol.md': a2aProtocolRaw
}

export function getAllPosts() {
  return Object.entries(postFiles)
    .map(([path, raw]) => {
      const slug = path.replace('../posts/', '').replace('.md', '')
      const { data, content } = parseFrontmatter(raw)
      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        category: data.category || '',
        tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
        summary: data.summary || '',
        image: data.image || '',
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

export function getAllCategories() {
  const catMap = {}
  getAllPosts().forEach(post => {
    if (!post.category) return
    catMap[post.category] = (catMap[post.category] || 0) + 1
  })
  return Object.entries(catMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
}

export function getPostsByCategory(category) {
  return getAllPosts().filter(p => p.category === category)
}