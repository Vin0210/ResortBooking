import { useEffect, useMemo, useState } from 'react'
import BookingsTable from './BookingsTable'
import { getBookings, getInquiries, updateBookingStatus, updateInquiryStatus } from '../services/api'
import { formatDateTime } from '../utils/format'
import './Bookings.css'

const BOOKING_TABS = ['all', 'pending', 'confirmed', 'cancelled']

export default function Bookings() {
  const [tab, setTab] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  async function refresh() {
    const [b, q] = await Promise.all([getBookings(), getInquiries()])
    setBookings(b)
    setInquiries(q)
  }

  useEffect(() => {
    Promise.all([getBookings(), getInquiries()])
      .then(([b, q]) => {
        setBookings(b)
        setInquiries(q)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filteredBookings = useMemo(
    () => (filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter]
  )

  async function changeStatus(id, status) {
    await updateBookingStatus(id, status)
    await refresh()
  }

  async function changeInquiryStatus(id, status) {
    await updateInquiryStatus(id, status)
    await refresh()
  }

  return (
    <>
      <div className="admin-page__header">
        <h1>Bookings &amp; Inquiries</h1>
        <div className="bookings__tabs">
          <button
            type="button"
            className={tab === 'bookings' ? 'is-active' : ''}
            onClick={() => setTab('bookings')}
          >
            Bookings ({bookings.length})
          </button>
          <button
            type="button"
            className={tab === 'inquiries' ? 'is-active' : ''}
            onClick={() => setTab('inquiries')}
          >
            Inquiries ({inquiries.length})
          </button>
        </div>
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
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
          <BookingsTable
            bookings={filteredBookings}
            changeStatus={changeStatus}
            expanded={expanded}
            setExpanded={setExpanded}
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
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-empty">
                    No inquiries yet.
                  </td>
                </tr>
              )}
              {inquiries.map((q) => (
                <tr key={q.id}>
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
                      {q.status === 'new' && (
                        <button
                          type="button"
                          className="btn btn--primary"
                          onClick={() => changeInquiryStatus(q.id, 'resolved')}
                        >
                          Mark resolved
                        </button>
                      )}
                      {q.status === 'resolved' && (
                        <button
                          type="button"
                          className="btn btn--outline"
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
    </>
  )
}
