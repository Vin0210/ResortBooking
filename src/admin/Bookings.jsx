import { useEffect, useMemo, useState } from 'react'
import { Search, Ticket, MessageCircle, Clock, CheckCircle2, XCircle } from 'lucide-react'
import BookingsTable from './BookingsTable'
import ReplyDrawer from './ReplyDrawer'
import { getBookings, getInquiries, updateBookingStatus, updateInquiryStatus } from '../services/api'
import { formatDateTime } from '../utils/format'
import './Bookings.css'

const BOOKING_TABS = ['all', 'pending', 'confirmed', 'cancelled']

export default function Bookings() {
  const [tab, setTab] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [replyTarget, setReplyTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const [busyId, setBusyId] = useState(null)

  function notify(msg, kind = 'success') {
    setToast({ msg, kind })
    setTimeout(() => setToast(null), 4200)
  }

  async function refresh() {
    try {
      const [b, q] = await Promise.all([getBookings(), getInquiries()])
      setBookings(b)
      setInquiries(q)
    } catch {
      notify('Could not refresh — check your connection.', 'error')
    }
  }

  useEffect(() => {
    let cancelled = false
    Promise.all([getBookings(), getInquiries()])
      .then(([b, q]) => {
        if (cancelled) return
        setBookings(b)
        setInquiries(q)
      })
      .catch(() => {
        if (!cancelled) notify('Failed to load bookings & inquiries.', 'error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const matches = (hay, needle) =>
    !needle || hay.toLowerCase().includes(needle.toLowerCase())

  const filteredBookings = useMemo(() => {
    const q = query.trim()
    return bookings.filter((b) => {
      if (filter !== 'all' && b.status !== filter) return false
      if (!q) return true
      return matches(
        `${b.customer_name} ${b.email} ${b.phone} ${b.room_name} ${b.message ?? ''}`,
        q
      )
    })
  }, [bookings, filter, query])

  const filteredInquiries = useMemo(() => {
    const q = query.trim()
    return inquiries.filter((item) => {
      if (!q) return true
      return matches(`${item.name} ${item.email} ${item.phone} ${item.message}`, q)
    })
  }, [inquiries, query])

  const pendingCount = bookings.filter((b) => b.status === 'pending').length
  const newCount = inquiries.filter((q) => q.status === 'new').length

  async function changeStatus(id, status) {
    setBusyId(id)
    try {
      await updateBookingStatus(id, status)
      await refresh()
      notify(`Booking ${status}. Guest will be emailed automatically.`)
    } catch {
      notify('Status update failed. Try again.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  async function changeInquiryStatus(id, status) {
    setBusyId(id)
    try {
      await updateInquiryStatus(id, status)
      await refresh()
      notify(status === 'resolved' ? 'Inquiry marked resolved.' : 'Inquiry reopened.')
    } catch {
      notify('Could not update inquiry — try again.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <div className="admin-page__header">
        <div>
          <h1>Bookings &amp; Inquiries</h1>
          <p className="bookings__subtitle">
            Reply directly, confirm stays, and resolve questions — all in one place.
          </p>
        </div>
        <div className="bookings__tabs">
          <button
            type="button"
            className={tab === 'bookings' ? 'is-active' : ''}
            onClick={() => setTab('bookings')}
          >
            <Ticket size={15} /> Bookings ({bookings.length})
            {pendingCount > 0 && <span className="bookings__count">{pendingCount}</span>}
          </button>
          <button
            type="button"
            className={tab === 'inquiries' ? 'is-active' : ''}
            onClick={() => setTab('inquiries')}
          >
            <MessageCircle size={15} /> Inquiries ({inquiries.length})
            {newCount > 0 && <span className="bookings__count"> {newCount}</span>}
          </button>
        </div>
      </div>

      {/* At-a-glance stats */}
      <div className="bookings__stats">
        <div className="bookings__stat is-warning">
          <Clock size={18} />
          <div><strong>{pendingCount}</strong><span>Pending bookings</span></div>
        </div>
        <div className="bookings__stat is-info">
          <MessageCircle size={18} />
          <div><strong>{newCount}</strong><span>New inquiries</span></div>
        </div>
        <div className="bookings__stat is-success">
          <CheckCircle2 size={18} />
          <div><strong>{bookings.filter((b) => b.status === 'confirmed').length}</strong><span>Confirmed</span></div>
        </div>
      </div>

      {/* Search */}
      <div className="bookings__toolbar">
        <label className="bookings__search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            placeholder={tab === 'bookings' ? 'Search name, email, room…' : 'Search name, email, message…'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
              <XCircle size={16} />
            </button>
          )}
        </label>
      </div>

      {loading && <p className="admin-empty">Loading…</p>}

      {!loading && tab === 'bookings' && (
        <>
          <div className="bookings__filter">
            {BOOKING_TABS.map((f) => (
              <button
                key={f}
                type="button"
                className={filter === f ? 'is-active' : ''}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? `All (${bookings.length})` : `${f} (${bookings.filter((b) => b.status === f).length})`}
              </button>
            ))}
          </div>
          <BookingsTable
            bookings={filteredBookings}
            changeStatus={changeStatus}
            expanded={expanded}
            setExpanded={setExpanded}
            busyId={busyId}
            onReply={(booking) => setReplyTarget({ kind: 'booking', item: booking })}
          />
        </>
      )}

      {!loading && tab === 'inquiries' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-empty">
                    {query ? `No inquiries match “${query}”.` : 'No inquiries yet.'}
                  </td>
                </tr>
              )}
              {filteredInquiries.map((q) => (
                <tr key={q.id} className={q.status === 'new' ? 'row--unread' : ''}>
                  <td>
                    <strong>{q.name}</strong>
                    <span className="bookings__sub">{q.email}</span>
                    <span className="bookings__sub">{q.phone}</span>
                  </td>
                  <td className="bookings__message-cell">{q.message}</td>
                  <td>
                    <span className={`status-pill status-${q.status}`}>{q.status}</span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => setReplyTarget({ kind: 'inquiry', item: q })}
                      >
                        Reply
                      </button>
                      {q.status === 'new' && (
                        <button
                          type="button"
                          className="btn btn--outline"
                          disabled={busyId === q.id}
                          onClick={() => changeInquiryStatus(q.id, 'resolved')}
                        >
                          Mark resolved
                        </button>
                      )}
                      {q.status === 'resolved' && (
                        <button
                          type="button"
                          className="btn btn--outline"
                          disabled={busyId === q.id}
                          onClick={() => changeInquiryStatus(q.id, 'new')}
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                    <span className="bookings__sub">{formatDateTime(q.created_at)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {replyTarget && (
        <ReplyDrawer
          key={`${replyTarget.kind}-${replyTarget.item.id}`}
          target={replyTarget}
          onClose={() => setReplyTarget(null)}
          onSent={refresh}
          notify={notify}
        />
      )}

      {toast && (
        <div className={`admin-toast admin-toast--${toast.kind}`} role="status">
          {toast.msg}
        </div>
      )}
    </>
  )
}
