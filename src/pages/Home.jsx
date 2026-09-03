import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Hotel, Waves, Star, Clock } from 'lucide-react'
import Hero from '../components/Hero/Hero'
import RoomCard from '../components/RoomCard/RoomCard'
import AmenitiesGrid from '../components/Amenities/AmenitiesGrid'
import GalleryGrid from '../components/Gallery/GalleryGrid'
import Testimonials from '../components/Testimonials/Testimonials'
import SectionHeading from '../components/common/SectionHeading'
import Reveal from '../components/common/Reveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { getRooms, getAmenities, getGallery } from '../services/api'
import './Home.css'

export default function Home() {
  usePageMeta(null, 'Beachfront resort in Batangas with a private cove, infinity pool, and native cottages. Book your island escape today.')
  const [rooms, setRooms] = useState([])
  const [amenities, setAmenities] = useState([])
  const [gallery, setGallery] = useState([])

  useEffect(() => {
    Promise.all([getRooms(), getAmenities(), getGallery()])
      .then(([r, a, g]) => {
        setRooms(r.filter((room) => room.featured).slice(0, 3))
        setAmenities(a.slice(0, 8))
        setGallery(g.slice(0, 8))
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <Hero />

      <section className="section">
        <div className="container home__intro">
          <Reveal className="home__intro-text">
            <p className="section-eyebrow">Welcome to paradise</p>
            <h2 className="section-title">A quiet cove, made for slowing down</h2>
            <p className="section-lead">
              Tucked along the coastline of Batangas, our resort pairs
              Filipino-native architecture with modern comfort. Spend your days
              between the infinity pool, the private beach, and the island
              restaurant — then fall asleep to the sound of the waves.
            </p>
            <Link to="/about" className="btn btn--primary">
              Our Story
            </Link>
          </Reveal>
          <Reveal className="home__stats" delay={0.15}>
            <div className="home__stat">
              <span className="home__stat-icon" aria-hidden="true"><Hotel size={20} /></span>
              <strong>12</strong>
              <span>Rooms &amp; cottages</span>
            </div>
            <div className="home__stat">
              <span className="home__stat-icon" aria-hidden="true"><Waves size={20} /></span>
              <strong>300m</strong>
              <span>Private beachfront</span>
            </div>
            <div className="home__stat">
              <span className="home__stat-icon" aria-hidden="true"><Star size={20} /></span>
              <strong>4.9</strong>
              <span>Guest rating</span>
            </div>
            <div className="home__stat">
              <span className="home__stat-icon" aria-hidden="true"><Clock size={20} /></span>
              <strong>24/7</strong>
              <span>Front desk</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHeading
            eyebrow="Stay with us"
            title="Featured rooms & cottages"
            lead="Every room opens to the sea breeze — choose your view."
          />
          <div className="home__rooms">
            {rooms.map((room) => (
              <Reveal key={room.id} delay={0.05}>
                <RoomCard room={room} />
              </Reveal>
            ))}
          </div>
          <div className="section__cta">
            <Link to="/rooms" className="btn btn--outline">
              View all rooms
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Resort amenities"
            title="Everything you need for a perfect stay"
          />
          <AmenitiesGrid amenities={amenities} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Guest stories"
            title="Loved by families, couples & celebrations"
          />
          <Testimonials />
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHeading
            eyebrow="Gallery"
            title="Moments at the cove"
          />
          <GalleryGrid images={gallery} featuredFirst />
          <div className="section__cta">
            <Link to="/gallery" className="btn btn--outline">
              See full gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="home__banner">
        <div className="container">
          <Reveal>
            <h2>Ready for your island escape?</h2>
            <p>Send a booking request — no payment needed. We’ll confirm within 24 hours.</p>
            <Link to="/booking" className="btn btn--accent btn--lg">
              Book Your Stay
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
