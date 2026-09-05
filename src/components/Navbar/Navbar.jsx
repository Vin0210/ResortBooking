import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Phone, CalendarCheck } from 'lucide-react'
import business from '../../config/business'
import PromoBar from '../PromoBar/PromoBar'
import './Navbar.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 8
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open ])

  const closeMenu = () => setOpen(false)

  return (
    <>
      <PromoBar />
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          <Link to="/" className="navbar__brand" aria-label={`${business.name} home`} onClick={closeMenu}>
            <span className="navbar__brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M2 15c2.2 0 2.2 1.6 4.4 1.6S8.6 15 10.8 15s2.2 1.6 4.4 1.6S17.4 15 19.6 15v2.4c-2.2 0-2.2 1.6-4.4 1.6s-2.2-1.6-4.4-1.6-2.2 1.6-4.4 1.6S4.2 17.4 2 17.4V15Zm0-5c2.2 0 2.2 1.6 4.4 1.6S8.6 10 10.8 10s2.2 1.6 4.4 1.6S17.4 10 19.6 10v2.4c-2.2 0-2.2 1.6-4.4 1.6s-2.2-1.6-4.4-1.6-2.2 1.6-4.4 1.6S4.2 12.4 2 12.4V10Zm10.4-6.6 6.3 3.4c.6.3.4 1.2-.3 1.2h-12c-.7 0-.9-.9-.3-1.2l6.3-3.4Z" />
              </svg>
            </span>
            <span className="navbar__brand-name">{business.name}</span>
          </Link>

          <nav className="navbar__nav navbar__nav--desktop" aria-label="Main navigation">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'is-active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/booking" className="btn btn--primary navbar__cta">
              <CalendarCheck size={16} /> Book Now
            </Link>
          </nav>

          <a href={`tel:${business.phone.replace(/\s/g, '')}`} className="navbar__phone">
            <Phone size={16} aria-hidden="true" />
            <span>{business.phone}</span>
          </a>

          <button
            type="button"
            className={`navbar__toggle ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className="navbar__burger" aria-hidden="true"><i /><i /><i /></span>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="navbar__backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMenu}
              />
              <motion.nav
                className="navbar__nav navbar__nav--mobile"
                aria-label="Mobile navigation"
                initial={{ opacity: 0, y: -14, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {links.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `navbar__link ${isActive ? 'is-active' : ''}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
                <Link to="/booking" onClick={closeMenu} className="btn btn--accent navbar__cta">
                  <CalendarCheck size={17} /> Book Your Stay
                </Link>
                <a className="navbar__mobile-phone" href={`tel:${business.phone.replace(/\s/g, '')}`}>
                  <Phone size={15} /> {business.phone}
                </a>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
