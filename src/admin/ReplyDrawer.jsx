import { useEffect, useMemo, useState } from 'react'
import {
  X, Send, Loader2, Copy, Check, Mail, MessageCircle, Phone,
  Sparkles, History, CheckCircle2,
} from 'lucide-react'
import { getReplies, sendReply } from '../services/api'
import { formatDateTime } from '../utils/format'
import './ReplyDrawer.css'

function buildTemplates(ctx) {
  const name = ctx.guestName || 'Guest'
  const room = ctx.roomName ? ` (${ctx.roomName})` : ''
  const dates = ctx.dates ? ` for ${ctx.dates}` : ''
  return [
    {
      label: 'Confirm + warm welcome',
      subject: `Your booking is confirmed — see you soon!`,
      body: `Hi ${name},\n\nGreat news — your booking${room}${dates} is confirmed! We can't wait to welcome you.\n\nCheck-in is from 2:00 PM and check-out at 12:00 NN. Just reply here if you need early check-in, airport transfer, or anything else.\n\nWarm regards,\nElvin's Beach Resort`,
    },
    {
      label: 'Request details',
      subject: `Quick question about your request`,
      body: `Hi ${name},\n\nThanks for reaching out! To confirm availability${dates}, could you please share:\n\n1. Number of guests (adults/kids)\n2. Preferred room type\n3. Contact number we can reach you on\n\nWe'll hold your dates for 24 hours while we sort this out.\n\nThank you,\nElvin's Beach Resort`,
    },
    {
      label: 'Decline politely',
      subject: `Update on your booking request`,
      body: `Hi ${name},\n\nThank you for choosing us. Unfortunately we're fully booked${dates}, so we can't accommodate this request.\n\nWe'd love to host you on nearby dates — just let us know what works and we'll prioritize your rebooking.\n\nWith apologies,\nElvin's Beach Resort`,
    },
    {
      label: 'Answer inquiry',
      subject: `Re: your message — thanks for reaching out!`,
      body: `Hi ${name},\n\nThanks for your message! Here's what I can share:\n\n[Write your answer here — rates, availability, event packages…]\n\nIf you'd like, I can reserve dates for you with no prepayment. Just tell me when you're thinking of coming.\n\nBest,\nElvin's Beach Resort`,
    },
  ]
}

export default function ReplyDrawer({ target, onClose, onSent, notify }) {
  const isBooking = target?.kind === 'booking'
  const item = target?.item
  const guestName = isBooking ? item?.customer_name : item?.name
  const guestEmail = item?.email ?? ''
  const guestPhone = item?.phone ?? ''

  const ctx = useMemo(() => ({
    guestName,
    roomName: isBooking ? item?.room_name : undefined,
    dates: isBooking && item?.check_in ? `${item.check_in} → ${item.check_out}` : undefined,
  }), [guestName, isBooking, item])

  const templates = useMemo(() => buildTemplates(ctx), [ctx])
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)
  // Remounted per target via `key` from the parent, so lazy init is fresh each time.
  const [subject, setSubject] = useState(() => templates[0].subject)
  const [message, setMessage] = useState(() => templates[0].body)
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState(false)

  // `loading` starts true (see useState above) since the drawer remounts per target.
  // The effect below only syncs the async reply fetch — no synchronous setState.
  useEffect(() => {
    let cancelled = false
    getReplies(isBooking ? { bookingId: item.id } : { inquiryId: item.id })
      .then((r) => { if (!cancelled) setReplies(r) })
      .catch(() => { if (!cancelled) setReplies([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [isBooking, item.id])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!target) return null

  const mailto = `mailto:${encodeURIComponent(guestEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
  const waNumber = (guestPhone || '').replace(/[^+\d]/g, '')
  const whatsapp = `https://wa.me/${waNumber.replace(/^\+/, '')}?text=${encodeURIComponent(message)}`
  const sms = `sms:${encodeURIComponent(guestPhone || '')}?&body=${encodeURIComponent(message)}`

  async function copyText() {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${message}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      notify?.('Copy failed — select the text manually.', 'error')
    }
  }

  async function handleSend() {
    if (!message.trim()) {
      notify?.('Write a message before sending.', 'error')
      return
    }
    setSending(true)
    try {
      const reply = await sendReply({
        bookingId: isBooking ? item.id : null,
        inquiryId: isBooking ? null : item.id,
        subject: subject.trim(),
        message: message.trim(),
      })
      setReplies((r) => [...r, reply])
      notify?.(`Reply saved & guest emailed — ${guestEmail || 'no email on file, use WhatsApp below'}.`, 'success')
      onSent?.()
    } catch (err) {
      notify?.(err.message ?? 'Could not send reply.', 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="reply-backdrop" onClick={onClose}>
      <aside
        className="reply-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Reply to ${guestName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="reply-drawer__head">
          <div>
            <p className="reply-drawer__eyebrow">{isBooking ? 'Booking reply' : 'Inquiry reply'}</p>
            <h2>{guestName}</h2>
            <p className="reply-drawer__sub">
              {guestEmail} {guestPhone ? `· ${guestPhone}` : ''}
            </p>
            {isBooking && (
              <p className="reply-drawer__sub">
                {item.room_name} · {item.check_in} → {item.check_out} · {item.guests} guest{item.guests > 1 ? 's' : ''}
              </p>
            )}
            {!isBooking && item?.message && (
              <blockquote className="reply-drawer__quote">“{item.message}”</blockquote>
            )}
          </div>
          <button type="button" className="reply-drawer__close" onClick={onClose} aria-label="Close reply panel">
            <X size={20} />
          </button>
        </header>

        <div className="reply-drawer__body">
          <section className="reply-thread">
            <p className="reply-thread__title"><History size={14} /> Conversation ({replies.length})</p>
            {loading && <p className="reply-thread__empty">Loading replies…</p>}
            {!loading && replies.length === 0 && (
              <p className="reply-thread__empty">No replies yet — be the first. Quick responses win bookings.</p>
            )}
            {replies.map((r) => (
              <article key={r.id} className="reply-thread__item">
                <p className="reply-thread__meta">
                  <span><CheckCircle2 size={13} /> You · {formatDateTime(r.created_at)}</span>
                </p>
                {r.subject && <p className="reply-thread__subject">{r.subject}</p>}
                <p className="reply-thread__msg">{r.message}</p>
              </article>
            ))}
          </section>

          <section className="reply-composer">
            <p className="reply-thread__title"><Sparkles size={14} /> Templates</p>
            <div className="reply-templates">
              {templates.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  className="reply-template-btn"
                  onClick={() => { setSubject(t.subject); setMessage(t.body) }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <label className="form-field">
              <span className="form-field__label">Subject</span>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
            </label>
            <label className="form-field">
              <span className="form-field__label">Message <em>*</em></span>
              <textarea rows={9} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Write your reply to ${guestName}…`} />
            </label>

            <div className="reply-actions">
              <button type="button" className="btn btn--primary" onClick={handleSend} disabled={sending}>
                {sending ? <><Loader2 className="spinner" size={16} /> Sending…</> : <><Send size={15} /> Send reply</>}
              </button>
              <button type="button" className="btn btn--outline" onClick={copyText}>
                {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy</>}
              </button>
            </div>
            <p className="reply-hint">
              Send saves the reply to the thread, emails the guest automatically (when configured),
              and marks this {isBooking ? 'booking confirmed' : 'inquiry resolved'}.
            </p>

            <div className="reply-channels">
              <span>Or reach them now:</span>
              <div className="reply-channels__btns">
                <a className="reply-channel" href={mailto}><Mail size={14} /> Email app</a>
                {waNumber && <a className="reply-channel" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={14} /> WhatsApp</a>}
                {guestPhone && <a className="reply-channel" href={sms}><MessageCircle size={14} /> SMS</a>}
                {guestPhone && <a className="reply-channel" href={`tel:${waNumber}`}><Phone size={14} /> Call</a>}
              </div>
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
