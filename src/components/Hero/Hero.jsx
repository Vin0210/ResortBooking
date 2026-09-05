import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Waves, Umbrella, UtensilsCrossed, ChevronDown, ShieldCheck, BadgeCheck, Star } from 'lucide-react'
import './Hero.css'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const fgY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section className="hero" ref={ref}>
      {/* Ken-burns photo + gradient layers */}
      <motion.div className="hero__bg" style={{ y: bgY }} aria-hidden="true" />
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__blob hero__blob--a" aria-hidden="true" />
      <div className="hero__blob hero__blob--b" aria-hidden="true" />
      <div className="hero__overlay" aria-hidden="true" />

      <motion.div className="container hero__grid" style={{ y: fgY, opacity: fade }}>
        <motion.div
          className="hero__content"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p className="hero__eyebrow" variants={item}>
            <span className="hero__eyebrow-dot" /> Beachfront Resort · Zamboanga City
          </motion.p>

          <motion.div className="hero__rating" variants={item}>
            <span className="hero__stars" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} fill="currentColor" />
              ))}
            </span>
            4.9 guest rating &nbsp;·&nbsp; 300+ happy stays
          </motion.div>

          <motion.h1 className="hero__title" variants={item}>
            Your island escape, <span className="hero__accent">just a booking away</span>
          </motion.h1>

          <motion.p className="hero__lead" variants={item}>
            Private white-sand cove, an infinity pool overlooking the water, and
            native cottages built for slow mornings and golden sunsets.
          </motion.p>

          <motion.div className="hero__actions" variants={item}>
            <Link to="/booking" className="btn btn--accent btn--lg btn--pulse">
              Book Your Stay
            </Link>
            <Link to="/rooms" className="btn btn--ghost btn--lg">
              Explore Rooms
            </Link>
          </motion.div>

          <motion.div className="hero__trust" variants={item}>
            <div className="hero__avatars" aria-hidden="true">
              <span>MS</span><span>CF</span><span>AV</span><span>+</span>
            </div>
            <p>
              <strong>Loved by 2,000+ guests</strong>
              <span>No prepayment · Free cancellation 48h</span>
            </p>
          </motion.div>

          <motion.ul className="hero__highlights" variants={item}>
            <li><Umbrella size={18} aria-hidden="true" /> Private beach access</li>
            <li><Waves size={18} aria-hidden="true" /> Infinity pool</li>
            <li><UtensilsCrossed size={18} aria-hidden="true" /> Island dining</li>
          </motion.ul>
        </motion.div>

        {/* Floating booking card — conversion booster */}
        <motion.aside
          className="hero__card glass"
          initial={{ opacity: 0, y: 32, rotate: 1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero__card-head">
            <span className="badge-pill hero__card-badge"><BadgeCheck size={14} /> Available this weekend</span>
            <p className="hero__card-title">Beachfront Villa</p>
            <p className="hero__card-price">₱4,500 <small>/ night · sleeps 4</small></p>
          </div>
          <ul className="hero__card-list">
            <li><ShieldCheck size={15} /> Best-rate guarantee</li>
            <li><Waves size={15} /> Sea view + plunge pool</li>
          </ul>
          <Link to="/booking" className="btn btn--accent hero__card-cta">Check availability</Link>
          <p className="hero__card-note">No payment needed — confirm in 24h</p>
        </motion.aside>
      </motion.div>

      <motion.div
        className="hero__scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        aria-hidden="true"
      >
        <span className="hero__mouse"><span /></span>
        Scroll
        <ChevronDown size={18} />
      </motion.div>

      <svg className="hero__wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,50 C240,90 480,10 720,40 C960,70 1200,20 1440,55 L1440,90 L0,90 Z" fill="var(--clr-bg)" />
      </svg>
    </section>
  )
}
