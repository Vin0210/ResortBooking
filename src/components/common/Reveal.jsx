import { motion, useReducedMotion } from 'framer-motion'

/**
 * Subtle fade-up on scroll into view. Used sparingly per the
 * UI/UX goals — only where it improves the experience.
 */
export default function Reveal({ children, delay = 0, className, as = 'div', y = 28, scale = 1 }) {
  const Comp = motion[as] ?? motion.div
  const reduce = useReducedMotion()
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y, scale: scale === 1 ? 1 : 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  )
}
