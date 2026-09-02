import BookingForm from '../components/BookingForm/BookingForm'
import ContactInfo from '../components/Contact/ContactInfo'
import { usePageMeta } from '../hooks/usePageMeta'
import './Booking.css'

export default function Booking() {
  usePageMeta('Book a Stay', 'Send a booking request — no payment needed. We confirm within 24 hours.')

  return (
    <>
      <header className="page-header">
        <div className="container">
          <p className="section-eyebrow">Booking</p>
          <h1>Book your stay</h1>
          <p className="page-header__lead">
            Tell us when you’re coming and we’ll take care of the rest.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container booking__layout">
          <BookingForm />
          <aside>
            <h2 className="booking__aside-title">Need help?</h2>
            <ContactInfo showMap={false} />
          </aside>
        </div>
      </section>
    </>
  )
}
