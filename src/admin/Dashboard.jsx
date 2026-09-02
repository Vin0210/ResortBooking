import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ticket, Clock, CheckCircle2, MessageSquare } from 'lucide-react'
import { getBookings, getInquiries } from '../services/api'
import { formatDate, formatDateTime } from '../utils/format'
import './Dashboard.css'

export default function Dashboard() {
  const [bookings, setBookings] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getBookings(), getInquiries()])
      .then(([b, i]) => {
        setBookings(b)
        setInquiries(i)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const pending = bookings.filter((b) => b.status === 'pending')
  const confirmed = bookings.filter((b) => b.status === 'confirmed')
  const newInquiries = inquiries.filter((i) => i.status === 'new')

  return (
    <>
      <div className="admin-page__header">
        <h1>Dashboard</h1>
      </div>

      <div className="admin-stats">
        <StatCard icon={<Ticket size={22} />} value={bookings.length} label="Total bookings" />
        <StatCard icon={<Clock size={22} />} value={pending.length} label="Pending bookings" />
        <StatCard icon={<CheckCircle2 size={22} />} value={confirmed.length} label="Confirmed bookings" />
        <StatCard icon={<MessageSquare size={22} />} value={newInquiries.length} label="New inquiries" />
      </div>

      <div className="dashboard__grid">
        <section className="admin-card">
          <div className="dashboard__card-head">
            <h2>Recent bookings</h2>
            <Link to="/admin/bookings">View all →</Link>
          </div>
          {loading ? (
            <p className="admin-empty">Loading…</p>
          ) : bookings.length === 0 ? (
            <p className="admin-empty">No bookings yet.</p>
          ) : (
            <ul className="dashboard__list">
              {bookings.slice(0, 5).map((b) => (
                <li key={b.id}>
                  <div>
                    <strong>{b.customer_name}</strong>
                    <span>
                      {b.room_name} · {formatDate(b.check_in)} → {formatDate(b.check_out)} ·{' '}
                      {b.guests} guest{b.guests > 1 ? 's' : ''}
                    </span>
                  </div>
                  <span className={`status-pill status-${b.status}`}>{b.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card">
          <div className="dashboard__card-head">
            <h2>Recent inquiries</h2>
            <Link to="/admin/bookings">View all →</Link>
          </div>
          {loading ? (
            <p className="admin-empty">Loading…</p>
          ) : inquiries.length === 0 ? (
            <p className="admin-empty">No inquiries yet.</p>
          ) : (
            <ul className="dashboard__list">
              {inquiries.slice(0, 5).map((q) => (
                <li key={q.id}>
                  <div>
                    <strong>{q.name}</strong>
                    <span>
                      {q.message.length > 80
                        ? `${q.message.slice(0, 80)}…`
                        : q.message}
                    </span>
                    <em>{formatDateTime(q.created_at)}</em>
                  </div>
                  <span className={`status-pill status-${q.status}`}>{q.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}

function StatCard({ icon, value, label }) {
  return (
    <div className="admin-stat">
      <span className="admin-stat__icon">{icon}</span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}
