import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Waves, Umbrella, UtensilsCrossed, ChevronDown } from 'lucide-react'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__overlay" aria-hidden="true" />
      <div className="container hero__content">
        <motion.p
          className="hero__eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Beachfront Resort · Zamboanga City
        </motion.p>
        <motion.div
          className="hero__rating"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <span className="hero__rating-star" aria-hidden="true">★</span>
          4.9 guest rating &nbsp;·&nbsp; 300+ happy stays
        </motion.div>
        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Your island escape, <span className="hero__accent">just a booking away</span>
        </motion.h1>
        <motion.p
          className="hero__lead"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          Private white-sand cove, an infinity pool overlooking the water, and
          native cottages built for slow mornings and golden sunsets.
        </motion.p>
        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
        >
          <Link to="/booking" className="btn btn--accent btn--lg">
            Book Your Stay
          </Link>
          <Link to="/rooms" className="btn btn--ghost btn--lg">
            Explore Rooms
          </Link>
        </motion.div>

        <motion.ul
          className="hero__highlights"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <li>
            <Umbrella size={18} aria-hidden="true" /> Private beach access
          </li>
          <li>
            <Waves size={18} aria-hidden="true" /> Infinity pool
          </li>
          <li>
            <UtensilsCrossed size={18} aria-hidden="true" /> Island dining
          </li>
        </motion.ul>
      </div>
      <motion.div
        className="hero__scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        aria-hidden="true"
      >
        <ChevronDown size={22} />
        Scroll
      </motion.div>
      <svg
        className="hero__wave"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,50 C240,90 480,10 720,40 C960,70 1200,20 1440,55 L1440,90 L0,90 Z"
          fill="var(--clr-bg)"
        />
      </svg>
    </section>
  )
}
