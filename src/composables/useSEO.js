export function useSEO({ title, description } = {}) {
  const siteName = 'My Blog'

  document.title = title ? `${title} | ${siteName}` : siteName

  const setMeta = (name, content) => {
    if (!content) return
    let el = document.querySelector(`meta[name="${name}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('name', name)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  const setOG = (property, content) => {
    if (!content) return
    let el = document.querySelector(`meta[property="${property}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('property', property)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  setMeta('description', description)
  setOG('og:title', title || siteName)
  setOG('og:description', description)
  setOG('og:type', 'article')
}