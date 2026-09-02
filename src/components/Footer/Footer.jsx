import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import business from '../../config/business'
import { FacebookIcon, InstagramIcon, TikTokIcon } from '../SocialIcons'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__col footer__about">
          <p className="footer__brand">{business.name}</p>
          <p className="footer__desc">{business.description}</p>
          <div className="footer__social">
            <a href={business.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <FacebookIcon size={18} />
            </a>
            <a href={business.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon size={18} />
            </a>
            <a href={business.social.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
              <TikTokIcon size={18} />
            </a>
          </div>
        </div>

        <nav className="footer__col" aria-label="Footer quick links">
          <p className="footer__heading">Explore</p>
          <Link to="/rooms">Rooms &amp; Cottages</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/about">About Us</Link>
          <Link to="/booking">Book a Stay</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="footer__col">
          <p className="footer__heading">Contact</p>
          <a href={`tel:${business.phone.replace(/\s/g, '')}`}>
            <Phone size={15} aria-hidden="true" /> {business.phone}
          </a>
          <a href={`mailto:${business.email}`}>
            <Mail size={15} aria-hidden="true" /> {business.email}
          </a>
          <a href={business.mapLink} target="_blank" rel="noreferrer">
            <MapPin size={15} aria-hidden="true" /> {business.address}
          </a>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>
            © {new Date().getFullYear()} {business.name}. All rights reserved.
          </span>
          <Link to="/admin/login">Owner login</Link>
        </div>
      </div>
    </footer>
  )
}
