import { useState } from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'
import ContactInfo from '../components/Contact/ContactInfo'
import { usePageMeta } from '../hooks/usePageMeta'
import { createInquiry } from '../services/api'
import { isValidEmail } from '../utils/format'
import './Contact.css'

const empty = { name: '', email: '', phone: '', message: '' }

export default function Contact() {
  usePageMeta('Contact Us', 'Get in touch — phone, email, address, map, and contact form.')
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!isValidEmail(form.email)) next.email = 'Please enter a valid email address.'
    if (!form.message.trim()) next.message = 'Please enter your message.'
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    setSending(true)
    setError('')
    try {
      await createInquiry(form)
      setSent(true)
      setForm(empty)
    } catch {
      setError('Something went wrong. Please try again or contact us directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <header className="page-header">
        <div className="container">
          <p className="section-eyebrow">Contact</p>
          <h1>We’d love to hear from you</h1>
          <p className="page-header__lead">
            Questions about rooms, events, or availability? Send us a message
            or reach us directly.
          </p>
        </div>
      </header>

      <section className="section">
        <div className="container contact__layout">
          <ContactInfo />

          <div className="contact__form-wrap">
            {sent ? (
              <div className="contact__sent" role="status">
                <CheckCircle2 size={46} aria-hidden="true" />
                <h2>Message sent!</h2>
                <p>We’ll get back to you within 24 hours.</p>
                <button type="button" className="btn btn--primary" onClick={() => setSent(false)}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className="contact__form" onSubmit={onSubmit} noValidate>
                <h2>Send us a message</h2>
                {error && <p className="contact__error">{error}</p>}
                <label className={`form-field ${errors.name ? 'has-error' : ''}`}>
                  <span className="form-field__label">Name <em aria-hidden="true">*</em></span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                  {errors.name && <span className="form-field__error">{errors.name}</span>}
                </label>
                <label className={`form-field ${errors.email ? 'has-error' : ''}`}>
                  <span className="form-field__label">Email <em aria-hidden="true">*</em></span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {errors.email && <span className="form-field__error">{errors.email}</span>}
                </label>
                <label className="form-field">
                  <span className="form-field__label">Phone (optional)</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="+63 9XX XXX XXXX"
                    autoComplete="tel"
                  />
                </label>
                <label className={`form-field ${errors.message ? 'has-error' : ''}`}>
                  <span className="form-field__label">Message <em aria-hidden="true">*</em></span>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="How can we help?"
                  />
                  {errors.message && <span className="form-field__error">{errors.message}</span>}
                </label>
                <button type="submit" className="btn btn--primary" disabled={sending}>
                  {sending ? (
                    <>
                      <Loader2 className="spinner" size={18} aria-hidden="true" /> Sending…
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
