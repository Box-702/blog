import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const postsDir = join(__dirname, '..', 'src', 'posts')
const distDir = join(__dirname, '..', 'dist')

const SITE = 'https://box-702.github.io/blog'

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!m) return { data: {}, content: raw }
  const data = {}
  m[1].split('\n').forEach((line) => {
    const i = line.indexOf(':')
    if (i === -1) return
    const key = line.slice(0, i).trim()
    let value = line.slice(i + 1).trim()
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s) => s.trim().replace(/['"]/g, ''))
    } else if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1)
    }
    data[key] = value
  })
  return { data, content: m[2] || '' }
}

function escapeXml(s = '') {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRFC822(date) {
  return new Date(date).toUTCString()
}

const files = readdirSync(postsDir).filter((f) => f.endsWith('.md'))
const posts = files
  .map((filename) => {
    const raw = readFileSync(join(postsDir, filename), 'utf8')
    const { data } = parseFrontmatter(raw)
    return {
      slug: filename.replace('.md', ''),
      title: data.title || '',
      date: data.date || '',
      category: data.category || '',
      tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
      summary: data.summary || ''
    }
  })
  .filter((p) => p.title && !p.title.startsWith('_'))
  .sort((a, b) => new Date(b.date) - new Date(a.date))

const items = posts
  .map((p) => {
    const link = `${SITE}/#/post/${p.slug}`
    const cats = (p.tags.length ? p.tags : [p.category])
      .filter(Boolean)
      .map((t) => `      <category>${escapeXml(t)}</category>`)
      .join('\n')
    return `  <item>
    <title>${escapeXml(p.title)}</title>
    <link>${link}</link>
    <guid isPermaLink="false">${SITE}/${p.slug}</guid>
    <description>${escapeXml(p.summary || p.title)}</description>
    <pubDate>${toRFC822(p.date)}</pubDate>
${cats}
  </item>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>My Blog</title>
  <link>${SITE}/</link>
  <description>Thoughts on frontend, code, and life.</description>
  <language>zh-CN</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>
`

mkdirSync(distDir, { recursive: true })
writeFileSync(join(distDir, 'rss.xml'), xml, 'utf8')
console.log(`Generated rss.xml with ${posts.length} post(s)`)
