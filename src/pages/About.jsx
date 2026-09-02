import { Link } from 'react-router-dom'
import SectionHeading from '../components/common/SectionHeading'
import Reveal from '../components/common/Reveal'
import { usePageMeta } from '../hooks/usePageMeta'
import business from '../config/business'
import './About.css'

export default function About() {
  usePageMeta('About Us', `The story behind ${business.name} — a family-run beachfront resort in Batangas.`)

  return (
    <>
      <PageHeader eyebrow="About us" title="A family retreat, open to everyone" />

      <section className="section">
        <div className="container about__grid">
          <Reveal>
            <p className="section-eyebrow">Our story</p>
            <h2 className="section-title">Built on a love for the sea</h2>
            <div className="about__prose">
              <p>
                {business.name} began as a family beach house — a place where
                weekends stretched long and every meal was shared outdoors. In
                2018, we opened its doors to guests, keeping the same warmth
                while adding the comforts of a modern resort.
              </p>
              <p>
                Today, our cottages and villas welcome families, couples, and
                event guests from all over the country. Everything you see —
                from the native materials to the restaurant menu — is rooted in
                the local community that we are proud to call home.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="about__mission">
              <h3>Our mission</h3>
              <p>
                To give every guest a genuine island experience — warm Filipino
                hospitality, honest pricing, and a stretch of coastline you’ll
                want to return to year after year.
              </p>
              <h3>Why guests stay with us</h3>
              <ul>
                <li>Private cove with calm, swimmable waters</li>
                <li>Locally sourced seafood and Filipino classics</li>
                <li>Attentive staff available around the clock</li>
                <li>Event-friendly venues for weddings and reunions</li>
              </ul>
              <Link to="/booking" className="btn btn--primary">
                Plan your visit
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHeading eyebrow="Good to know" title="Business information" />
          <div className="about__info">
            <div>
              <strong>Location</strong>
              <p>{business.address}</p>
            </div>
            <div>
              <strong>Contact</strong>
              <p>
                {business.phone}
                <br />
                {business.email}
              </p>
            </div>
            <div>
              <strong>Front desk</strong>
              <p>Open 24 hours, every day</p>
            </div>
            <div>
              <strong>Check-in / Check-out</strong>
              <p>2:00 PM / 12:00 NN</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function PageHeader({ eyebrow, title, lead }) {
  return (
    <header className="page-header">
      <div className="container">
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="page-header__lead">{lead}</p>}
      </div>
    </header>
  )
}
