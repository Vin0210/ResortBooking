import { motion } from 'framer-motion'

/**
 * Subtle fade-up on scroll into view. Used sparingly per the
 * UI/UX goals — only where it improves the experience.
 */
export default function Reveal({ children, delay = 0, className, as = 'div' }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </Comp>
  )
}
