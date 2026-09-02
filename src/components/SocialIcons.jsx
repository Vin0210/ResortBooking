/**
 * Brand/social icons not shipped with lucide-react.
 * Rendered as inline SVG so no extra dependency is needed.
 */
export function FacebookIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8.2h2.76l.41-3.2H13.5V7.55c0-.93.26-1.56 1.6-1.56h1.7V3.13A22.5 22.5 0 0 0 14.3 3c-2.45 0-4.13 1.5-4.13 4.24v2.36H7.4v3.2h2.77V21h3.33Z" />
    </svg>
  )
}

export function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function TikTokIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 3c.36 2.05 1.7 3.42 3.9 3.6v2.9c-1.42.06-2.72-.36-3.9-1.13v6.06c0 4.02-2.87 6.06-5.9 5.5-2.6-.48-4.5-2.87-4.2-5.5.3-2.53 2.5-4.5 5.1-4.5.3 0 .6.03.9.09v3.02a2.6 2.6 0 0 0-3.02 2.4 2.6 2.6 0 0 0 2.62 2.76c1.5 0 2.6-1.06 2.6-2.86V3h1.9Z" />
    </svg>
  )
}
