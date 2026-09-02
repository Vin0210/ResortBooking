import { Link } from 'react-router-dom'
import { Users, ArrowRight } from 'lucide-react'
import { formatPrice } from '../../utils/format'
import './RoomCard.css'

/** Card used in room listings and the home page featured section. */
export default function RoomCard({ room }) {
  const image = room.room_images?.[0]?.image_url
  return (
    <article className="room-card">
      <Link to={`/rooms/${room.id}`} className="room-card__media" aria-label={room.name}>
        {image ? (
          <img src={image} alt={room.name} loading="lazy" width="400" height="260" />
        ) : (
          <div className="room-card__placeholder" aria-hidden="true" />
        )}
        <span className="room-card__price">
          {formatPrice(room.price)}
          <small>/night</small>
        </span>
      </Link>
      <div className="room-card__body">
        <h3 className="room-card__name">
          <Link to={`/rooms/${room.id}`}>{room.name}</Link>
        </h3>
        <p className="room-card__meta">
          <Users size={15} aria-hidden="true" />
          Up to {room.capacity} guests
        </p>
        <p className="room-card__desc">
          {room.description.length > 110
            ? `${room.description.slice(0, 110).trimEnd()}…`
            : room.description}
        </p>
        <Link to={`/rooms/${room.id}`} className="room-card__link">
          View details <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
