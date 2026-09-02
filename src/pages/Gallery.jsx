import { useEffect, useState } from 'react'
import GalleryGrid from '../components/Gallery/GalleryGrid'
import { usePageMeta } from '../hooks/usePageMeta'
import { getGallery } from '../services/api'
import './Gallery.css'

export default function Gallery() {
  usePageMeta('Gallery', 'Photos of our beach, pool, rooms, and dining at the resort.')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGallery()
      .then(setImages)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <header className="page-header">
        <div className="container">
          <p className="section-eyebrow">Gallery</p>
          <h1>Moments at the cove</h1>
          <p className="page-header__lead">
            A look around the resort — click any photo to view it full size.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--clr-muted)' }}>
              Loading photos…
            </p>
          ) : (
            <GalleryGrid images={images} showFilter />
          )}
        </div>
      </section>
    </>
  )
}
