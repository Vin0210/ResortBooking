import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import './PromoBar.css'

export default function PromoBar() {
  return (
    <div className="promo-bar">
      <Link to="/booking" className="promo-bar__inner">
        <span className="promo-bar__pulse" aria-hidden="true"><Sparkles size={14} /></span>
        <span className="promo-bar__text">
          <strong>Sunset Season Deal — 15% off weekday stays</strong>
          <span className="promo-bar__code">Use code SUNSET15</span>
        </span>
        <span className="promo-bar__cta">Claim <ArrowRight size={14} /></span>
      </Link>
    </div>
  )
}
