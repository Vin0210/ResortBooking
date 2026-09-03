import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import './ScrollTopButton.css'

/** Floating button that appears after scrolling and jumps back to the top. */
export default function ScrollTopButton() {
  const [visible, setVisible] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 600
  )

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      className={`scroll-top ${visible ? 'is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  )
}
