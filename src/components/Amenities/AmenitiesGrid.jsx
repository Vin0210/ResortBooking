import {
  Waves, Umbrella, UtensilsCrossed, Wifi, Ship, ShieldCheck,
  PartyPopper, Star, Sun, Flame, Camera, Tent, Hotel, Palmtree,
} from 'lucide-react'
import './AmenitiesGrid.css'

/** Maps an icon name from the database to a lucide icon component. */
const ICONS = {
  Waves, Umbrella, UtensilsCrossed, Wifi, Ship, ShieldCheck,
  PartyPopper, Star, Sun, Flame, Camera, Tent, Hotel, Palmtree,
}

export default function AmenitiesGrid({ amenities }) {
  if (!amenities?.length) return null
  return (
    <div className="amenities-grid">
      {amenities.map((amenity) => {
        const Icon = ICONS[amenity.icon] ?? Star
        return (
          <div className="amenity-card" key={amenity.id}>
            <span className="amenity-card__icon" aria-hidden="true">
              <Icon size={22} />
            </span>
            <h3>{amenity.name}</h3>
            {amenity.description && <p>{amenity.description}</p>}
          </div>
        )
      })}
    </div>
  )
}
