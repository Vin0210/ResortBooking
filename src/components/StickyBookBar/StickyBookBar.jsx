import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, Phone } from 'lucide-react'
import business from '../../config/business'
import './StickyBookBar.css'

/** Mobile-only sticky booking CTA that slides in after scrolling past the hero. */
export default function StickyBookBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="sticky-book"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        >
          <div className="sticky-book__info">
            <strong>From ₱2,500/night</strong>
            <span>★ 4.9 · No prepayment</span>
          </div>
          <a
            className="sticky-book__call"
            href={`tel:${business.phone.replace(/\s/g, '')}`}
            aria-label="Call resort"
          >
            <Phone size={18} />
          </a>
          <Link to="/booking" className="btn btn--accent sticky-book__cta">
            <CalendarCheck size={17} /> Book Now
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
