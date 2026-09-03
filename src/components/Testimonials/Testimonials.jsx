import { Star } from 'lucide-react'
import business from '../../config/business'
import './Testimonials.css'

function initials(name) {
  return name
    .split(' ')
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export default function Testimonials() {
  const items = business.testimonials ?? []
  if (items.length === 0) return null

  return (
    <div className="testimonials">
      {items.map((t) => (
        <figure className="testimonial-card" key={t.name}>
          <div className="testimonial-card__stars" aria-label={`${t.rating} out of 5 stars`}>
            {Array.from({ length: t.rating }, (_, i) => (
              <Star key={i} size={15} fill="currentColor" aria-hidden="true" />
            ))}
          </div>
          <blockquote>&ldquo;{t.text}&rdquo;</blockquote>
          <figcaption>
            <span className="testimonial-card__avatar" aria-hidden="true">
              {initials(t.name)}
            </span>
            <span>
              <strong>{t.name}</strong>
              <small>{t.location}</small>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
