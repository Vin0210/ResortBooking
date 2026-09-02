// One-off generator for demo placeholder images (SVG).
import { mkdirSync, writeFileSync } from 'node:fs'

mkdirSync('public/images', { recursive: true })

const palettes = {
  room: [
    ['#0e7490', '#155e75', 'ROOM 01 · Seaview'],
    ['#0d9488', '#115e59', 'ROOM 02 · Cottage'],
    ['#0284c7', '#0c4a6e', 'ROOM 03 · Villa'],
    ['#059669', '#064e3b', 'ROOM 04 · Garden'],
  ],
  gallery: [
    ['#f59e0b', '#b45309', 'GALLERY 01 · Beach'],
    ['#0ea5e9', '#0369a1', 'GALLERY 02 · Pool'],
    ['#fb7185', '#be123c', 'GALLERY 03 · Dining'],
    ['#8b5cf6', '#5b21b6', 'GALLERY 04 · Rooms'],
    ['#14b8a6', '#0f766e', 'GALLERY 05 · Activities'],
    ['#84cc16', '#3f6212', 'GALLERY 06 · Grounds'],
    ['#f97316', '#c2410c', 'GALLERY 07 · Dining'],
    ['#38bdf8', '#075985', 'GALLERY 08 · Beach'],
  ],
}

function svg([from, to, label], w = 800, h = 520) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label} placeholder image">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w * 0.82}" cy="${h * 0.22}" r="${h * 0.16}" fill="#ffffff" opacity="0.25"/>
  <path d="M0 ${h * 0.72} Q ${w * 0.25} ${h * 0.62} ${w * 0.5} ${h * 0.72} T ${w} ${h * 0.72} V ${h} H 0 Z" fill="#ffffff" opacity="0.18"/>
  <path d="M0 ${h * 0.82} Q ${w * 0.25} ${h * 0.74} ${w * 0.5} ${h * 0.82} T ${w} ${h * 0.82} V ${h} H 0 Z" fill="#ffffff" opacity="0.22"/>
  <text x="50%" y="52%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(h * 0.07)}" font-weight="700" fill="#ffffff" opacity="0.9" letter-spacing="2">${label}</text>
  <text x="50%" y="${52 + Math.round(h * 0.07)}%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(h * 0.032)}" fill="#ffffff" opacity="0.65">Azure Cove Beach Resort — demo photo</text>
</svg>
`
}

for (const [i, p] of palettes.room.entries()) {
  writeFileSync(`public/images/room-${i + 1}.svg`, svg(p))
}
for (const [i, p] of palettes.gallery.entries()) {
  writeFileSync(`public/images/gallery-${i + 1}.svg`, svg(p, 900, 600))
}

// Subtle wave texture used behind the hero overlay
writeFileSync(
  'public/images/hero-texture.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <g fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.35">
    ${Array.from({ length: 14 }, (_, i) => `<path d="M0 ${40 + i * 40} Q 75 ${20 + i * 40} 150 ${40 + i * 40} T 300 ${40 + i * 40} T 450 ${40 + i * 40} T 600 ${40 + i * 40}"/>`).join('\n    ')}
  </g>
</svg>
`
)

console.log('placeholder images generated')
