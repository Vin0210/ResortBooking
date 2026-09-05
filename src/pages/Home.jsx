import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Hotel, Waves, Star, Clock, BadgeCheck, CalendarCheck, ShieldCheck, Phone, ChevronRight, Sparkles } from 'lucide-react'
import Hero from '../components/Hero/Hero'
import RoomCard from '../components/RoomCard/RoomCard'
import AmenitiesGrid from '../components/Amenities/AmenitiesGrid'
import GalleryGrid from '../components/Gallery/GalleryGrid'
import Testimonials from '../components/Testimonials/Testimonials'
import SectionHeading from '../components/common/SectionHeading'
import Reveal from '../components/common/Reveal'
import CountUp from '../components/common/CountUp'
import { usePageMeta } from '../hooks/usePageMeta'
import { getRooms, getAmenities, getGallery } from '../services/api'
import business from '../config/business'
import './Home.css'

const perks = [
  { icon: BadgeCheck, title: 'Best-rate guarantee', text: 'Book direct and we match any lower price.' },
  { icon: ShieldCheck, title: 'Free cancellation', text: 'Full refund up to 48 hours before check-in.' },
  { icon: CalendarCheck, title: 'No prepayment', text: 'Reserve now, pay at the resort. Confirm in 24h.' },
]

const marqueeItems = ['Private white-sand cove', 'Infinity pool', 'Native cottages', 'Island dining', 'Sunset pavilion', 'Family friendly', '24/7 front desk']

export default function Home() {
  usePageMeta(null, 'Beachfront resort in Zamboanga City with a private cove, infinity pool, and native cottages. Book your island escape today.')
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

      {/* Trust marquee */}
      <div className="home__marquee" aria-hidden="true">
        <div className="marquee">
          <div className="marquee__track">
            {[...marqueeItems, ...marqueeItems].map((t, i) => (
              <span key={i} className="home__marquee-item"><Sparkles size={14} /> {t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Booking perks — removes friction */}
      <section className="section home__perks-section">
        <div className="container home__perks">
          {perks.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="home__perk">
                <span className="home__perk-icon"><p.icon size={20} /></span>
                <div>
                  <strong>{p.title}</strong>
                  <span>{p.text}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section home__intro-section">
        <div className="container home__intro">
          <Reveal className="home__intro-text">
            <p className="section-eyebrow">Welcome to paradise</p>
            <h2 className="section-title">A quiet cove, made for slowing down</h2>
            <p className="section-lead">
              Tucked along the coastline of Zamboanga City, our resort pairs
              Filipino-native architecture with modern comfort. Spend your days
              between the infinity pool, the private beach, and the island
              restaurant — then fall asleep to the sound of the waves.
            </p>
            <div className="home__intro-cta">
              <Link to="/about" className="btn btn--primary">
                Our Story <ChevronRight size={16} />
              </Link>
              <a href={`tel:${business.phone.replace(/\s/g, '')}`} className="btn btn--outline">
                <Phone size={16} /> {business.phone}
              </a>
            </div>
          </Reveal>
          <Reveal className="home__stats" delay={0.15}>
            <div className="home__stat">
              <span className="home__stat-icon" aria-hidden="true"><Hotel size={20} /></span>
              <strong><CountUp to={12} /></strong>
              <span>Rooms &amp; cottages</span>
            </div>
            <div className="home__stat">
              <span className="home__stat-icon" aria-hidden="true"><Waves size={20} /></span>
              <strong><CountUp to={300} suffix="m" /></strong>
              <span>Private beachfront</span>
            </div>
            <div className="home__stat">
              <span className="home__stat-icon" aria-hidden="true"><Star size={20} /></span>
              <strong><CountUp to={4.9} decimals={1} /></strong>
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

      <section className="section section--tint home__rooms-section">
        <div className="container">
          <SectionHeading
            eyebrow="Stay with us"
            title="Featured rooms & cottages"
            lead="Every room opens to the sea breeze — choose your view."
          />
          <div className="home__rooms">
            {rooms.map((room, i) => (
              <Reveal key={room.id} delay={i * 0.08}>
                <RoomCard room={room} />
              </Reveal>
            ))}
          </div>
          <div className="section__cta">
            <Link to="/rooms" className="btn btn--outline btn--lg">
              View all rooms <ChevronRight size={16} />
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

      <section className="section home__reviews">
        <div className="container">
          <SectionHeading
            eyebrow="Guest stories"
            title="Loved by families, couples & celebrations"
            lead="★ 4.9 average from 300+ verified stays"
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
              See full gallery <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="home__banner">
        <div className="home__banner-blob home__banner-blob--a" aria-hidden="true" />
        <div className="home__banner-blob home__banner-blob--b" aria-hidden="true" />
        <div className="container home__banner-inner">
          <Reveal>
            <p className="badge-pill home__banner-badge"><CalendarCheck size={14} /> Weekend slots fill fast</p>
            <h2>Ready for your <span className="text-gradient">island escape?</span></h2>
            <p>Send a booking request — no payment needed. We’ll confirm within 24 hours.</p>
            <div className="home__banner-actions">
              <Link to="/booking" className="btn btn--accent btn--lg btn--pulse">
                Book Your Stay
              </Link>
              <a href={`tel:${business.phone.replace(/\s/g, '')}`} className="btn btn--ghost btn--lg">
                <Phone size={17} /> Call us
              </a>
            </div>
            <p className="home__banner-note">Free cancellation 48h · Best-rate guarantee</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
