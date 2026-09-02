import { useEffect, useState } from 'react'
import RoomCard from '../components/RoomCard/RoomCard'
import SectionHeading from '../components/common/SectionHeading'
import { usePageMeta } from '../hooks/usePageMeta'
import { getRooms } from '../services/api'
import './Rooms.css'

export default function Rooms() {
  usePageMeta('Rooms & Cottages', 'Browse our seaview rooms, family cottages, and beachfront villas with rates and capacity.')
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRooms()
      .then(setRooms)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <header className="page-header">
        <div className="container">
          <p className="section-eyebrow">Rooms &amp; cottages</p>
          <h1>Find your perfect stay</h1>
          <p className="page-header__lead">
            From cozy garden rooms to a villa right on the sand — all rates are
            per night, inclusive of breakfast for two.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {loading ? (
            <p className="rooms__loading">Loading rooms…</p>
          ) : rooms.length === 0 ? (
            <SectionHeading title="No rooms available yet" lead="Please check back soon or contact us directly." />
          ) : (
            <div className="rooms__grid">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
