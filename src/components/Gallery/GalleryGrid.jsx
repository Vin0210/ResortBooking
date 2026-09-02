import { useEffect, useMemo, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import './GalleryGrid.css'

/**
 * Responsive photo grid with category filter and lightbox.
 * `images` = [{ id, image_url, caption, category }]
 */
export default function GalleryGrid({ images, categories = null, showFilter = false }) {
  const allCategories = useMemo(
    () => categories ?? [...new Set(images.map((i) => i.category).filter(Boolean))],
    [images, categories]
  )
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const filtered =
    showFilter && activeCategory !== 'All'
      ? images.filter((i) => i.category === activeCategory)
      : images

  useEffect(() => {
    if (lightboxIndex === null) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight')
        setLightboxIndex((i) => (i + 1) % filtered.length)
      if (e.key === 'ArrowLeft')
        setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, filtered.length])

  return (
    <div>
      {showFilter && allCategories.length > 1 && (
        <div className="gallery__filter" role="tablist" aria-label="Gallery categories">
          {['All', ...allCategories].map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              className={`gallery__filter-btn ${activeCategory === cat ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="gallery__empty">No photos in this category yet.</p>
      ) : (
        <div className="gallery__grid">
          {filtered.map((image, idx) => (
            <button
              key={image.id}
              type="button"
              className="gallery__item"
              onClick={() => setLightboxIndex(idx)}
              aria-label={`View photo: ${image.caption || 'gallery image'}`}
            >
              <img
                src={image.image_url}
                alt={image.caption || 'Resort photo'}
                loading="lazy"
                width="360"
                height="260"
              />
              {image.caption && <span className="gallery__caption">{image.caption}</span>}
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label="Close preview"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={26} />
          </button>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length)
            }}
          >
            <ChevronLeft size={30} />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[lightboxIndex].image_url}
              alt={filtered[lightboxIndex].caption || 'Resort photo'}
            />
            {filtered[lightboxIndex].caption && (
              <figcaption>{filtered[lightboxIndex].caption}</figcaption>
            )}
          </figure>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((i) => (i + 1) % filtered.length)
            }}
          >
            <ChevronRight size={30} />
          </button>
        </div>
      )}
    </div>
  )
}
