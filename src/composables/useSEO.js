const SITE_NAME = 'My Blog'
const SITE_URL = 'https://box-702.github.io/blog'
const AUTHOR = 'box-702'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function removeMeta(attr, key) {
  document.head.querySelectorAll(`meta[${attr}="${key}"]`).forEach((el) => el.remove())
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(data) {
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove())
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

export function useSEO({
  title,
  description,
  url,
  image,
  type = 'website',
  publishedTime,
  tags = [],
  author = AUTHOR
} = {}) {
  document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME

  const abs = (p) => (p && /^https?:\/\//.test(p) ? p : `${SITE_URL}${p || ''}`)
  const pageUrl = abs(url) || SITE_URL
  const ogImage = image ? abs(image) : ''

  // Core + Open Graph
  upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:title', title || SITE_NAME)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:type', type)
  upsertMeta('property', 'og:url', pageUrl)
  if (ogImage) upsertMeta('property', 'og:image', ogImage)

  // Twitter card
  upsertMeta('name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary')
  upsertMeta('name', 'twitter:title', title || SITE_NAME)
  upsertMeta('name', 'twitter:description', description)
  if (ogImage) upsertMeta('name', 'twitter:image', ogImage)

  // Canonical
  upsertLink('canonical', pageUrl)

  if (type === 'article') {
    upsertMeta('property', 'article:published_time', publishedTime)
    upsertMeta('property', 'article:modified_time', publishedTime)
    removeMeta('property', 'article:tag')
    tags.forEach((t) => upsertMeta('property', 'article:tag', t))

    const ld = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      datePublished: publishedTime,
      dateModified: publishedTime,
      mainEntityOfPage: pageUrl,
      author: { '@type': 'Person', name: author },
      publisher: { '@type': 'Organization', name: SITE_NAME },
      keywords: Array.isArray(tags) ? tags.join(', ') : ''
    }
    if (ogImage) ld.image = ogImage
    upsertJsonLd(ld)
  } else {
    removeMeta('property', 'article:published_time')
    removeMeta('property', 'article:modified_time')
    removeMeta('property', 'article:tag')
    upsertJsonLd({ '@context': 'https://schema.org', '@type': 'WebSite', url: pageUrl, name: SITE_NAME })
  }
}
