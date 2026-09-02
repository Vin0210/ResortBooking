import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Users, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'
import { getRoom } from '../services/api'
import { formatPrice } from '../utils/format'
import './RoomDetails.css'

export default function RoomDetails() {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  usePageMeta(room?.name, room?.description)

  useEffect(() => {
    let cancelled = false
    getRoom(id)
      .then((data) => {
        if (cancelled) return
        setRoom(data)
        setActiveImage(0)
      })
      .catch(() => {
        if (!cancelled) setRoom(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return <p className="container room-details__loading">Loading room…</p>
  }

  if (!room) {
    return (
      <div className="container room-details__missing">
        <h1>Room not found</h1>
        <p>The room you’re looking for may have been removed or renamed.</p>
        <Link to="/rooms" className="btn btn--primary">
          <ArrowLeft size={16} aria-hidden="true" /> Back to all rooms
        </Link>
      </div>
    )
  }

  const images = room.room_images?.length
    ? room.room_images
    : [{ image_url: null }]

  return (
    <div className="room-details">
      <div className="container">
        <Link to="/rooms" className="room-details__back">
          <ArrowLeft size={15} aria-hidden="true" /> All rooms &amp; cottages
        </Link>

        <div className="room-details__layout">
          <div>
            <div className="room-details__gallery">
              {images[activeImage]?.image_url ? (
                <img
                  src={images[activeImage].image_url}
                  alt={room.name}
                  width="800"
                  height="520"
                />
              ) : (
                <div className="room-details__placeholder" aria-hidden="true" />
              )}
            </div>
            {images.length > 1 && (
              <div className="room-details__thumbs">
                {images.map((img, i) => (
                  <button
                    key={img.id ?? i}
                    type="button"
                    className={i === activeImage ? 'is-active' : ''}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img.image_url} alt="" width="90" height="64" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="room-details__info">
            <h1>{room.name}</h1>
            <p className="room-details__price">
              {formatPrice(room.price)} <span>/ night</span>
            </p>
            <p className="room-details__meta">
              <Users size={16} aria-hidden="true" /> Accommodates up to{' '}
              <strong>{room.capacity} guests</strong>
              {room.status === 'available' && (
                <span className="room-details__status">
                  <CheckCircle2 size={15} aria-hidden="true" /> Available
                </span>
              )}
            </p>
            <p className="room-details__desc">{room.description}</p>

            <div className="room-details__actions">
              <Link to={`/booking?room=${room.id}`} className="btn btn--accent btn--lg">
                Book this room
              </Link>
              <Link to="/contact" className="btn btn--outline">
                Ask a question
              </Link>
            </div>

            <ul className="room-details__perks">
              <li>Breakfast for two included</li>
              <li>Free Wi-Fi and parking</li>
              <li>Access to pool and private beach</li>
              <li>Flexible cancellation up to 3 days before check-in</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
