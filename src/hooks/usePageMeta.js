import { useEffect } from 'react'
import business from '../config/business'

/**
 * Sets per-page SEO metadata (title, description, Open Graph,
 * canonical). Call once per page component.
 */
export function usePageMeta(title, description) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${business.name}` : business.name

    document.title = fullTitle
    setMeta('description', description ?? business.description)
    setMeta('og:title', fullTitle, true)
    setMeta('og:description', description ?? business.description, true)
    setMeta('og:site_name', business.name, true)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = business.url + window.location.pathname
  }, [title, description])
}

function setMeta(name, content, isProperty = false) {
  const attr = isProperty ? 'property' : 'name'
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
