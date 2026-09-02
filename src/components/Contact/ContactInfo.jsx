import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import business from '../../config/business'
import { FacebookIcon, InstagramIcon, TikTokIcon } from '../SocialIcons'
import './ContactInfo.css'

/** Contact details block + optional Google Maps embed. */
export default function ContactInfo({ showMap = true }) {
  return (
    <div className="contact-info">
      <ul className="contact-info__list">
        <li>
          <span className="contact-info__icon" aria-hidden="true">
            <Phone size={18} />
          </span>
          <div>
            <strong>Phone</strong>
            <a href={`tel:${business.phone.replace(/\s/g, '')}`}>{business.phone}</a>
          </div>
        </li>
        <li>
          <span className="contact-info__icon" aria-hidden="true">
            <Mail size={18} />
          </span>
          <div>
            <strong>Email</strong>
            <a href={`mailto:${business.email}`}>{business.email}</a>
          </div>
        </li>
        <li>
          <span className="contact-info__icon" aria-hidden="true">
            <MapPin size={18} />
          </span>
          <div>
            <strong>Address</strong>
            <a href={business.mapLink} target="_blank" rel="noreferrer">
              {business.address}
            </a>
          </div>
        </li>
        <li>
          <span className="contact-info__icon" aria-hidden="true">
            <Clock size={18} />
          </span>
          <div>
            <strong>Hours</strong>
            {business.hours.map((h) => (
              <span key={h.label}>
                {h.label}: {h.value}
              </span>
            ))}
          </div>
        </li>
      </ul>

      <div className="contact-info__social">
        <a href={business.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
          <FacebookIcon size={17} />
        </a>
        <a href={business.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
          <InstagramIcon size={17} />
        </a>
        <a href={business.social.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
          <TikTokIcon size={17} />
        </a>
      </div>

      {showMap && (
        <div className="contact-info__map">
          <iframe
            title={`${business.name} location map`}
            src={business.mapEmbed}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  )
}
