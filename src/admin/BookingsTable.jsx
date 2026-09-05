import { useState } from 'react'
import { Loader2, CheckCircle2, XCircle, Ban } from 'lucide-react'
import { formatDate, formatDateTime } from '../utils/format'

const ACTIONS = {
  confirmed: {
    icon: CheckCircle2,
    btnClass: 'btn--primary',
    title: 'Confirm this booking?',
    message:
      'The guest will receive a confirmation email with their stay details. This tells them the room is reserved for their dates.',
    verb: 'Confirm',
  },
  rejected: {
    icon: XCircle,
    btnClass: 'btn--danger',
    title: 'Reject this booking?',
    message:
      'The guest will receive an email letting them know the request could not be accommodated, with an invitation to try other dates.',
    verb: 'Reject',
  },
  cancelled: {
    icon: Ban,
    btnClass: 'btn--outline',
    title: 'Cancel this booking?',
    message:
      'The guest will receive an email informing them the booking was cancelled. Double-check the details before proceeding.',
    verb: 'Cancel',
  },
}

/**
 * Table of booking requests with confirm / reject / cancel actions.
 * Every status change goes through an "Are you sure?" dialog.
 */
export default function BookingsTable({ bookings, changeStatus, expanded, setExpanded, busyId, onReply }) {
  const [pending, setPending] = useState(null) // { booking, status }
  const [working, setWorking] = useState(false)

  async function executeConfirmedChange() {
    setWorking(true)
    try {
      await changeStatus(pending.booking.id, pending.status)
      setPending(null)
    } finally {
      setWorking(false)
    }
  }

  if (bookings.length === 0) {
    return <p className="admin-empty admin-card">No bookings in this view.</p>
  }

  return (
    <>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Room</th>
              <th>Dates</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className={b.status === 'pending' ? 'row--unread' : ''}>
                <td>
                  <strong>{b.customer_name}</strong>
                  <span className="bookings__sub">{b.email}</span>
                  <span className="bookings__sub">{b.phone}</span>
                  {b.message && (
                    <button
                      type="button"
                      className="bookings__msg-toggle"
                      onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                    >
                      {expanded === b.id ? 'Hide message' : 'View message'}
                    </button>
                  )}
                  {expanded === b.id && (
                    <span className="bookings__msg">“{b.message}”</span>
                  )}
                </td>
                <td>{b.room_name}</td>
                <td>
                  {formatDate(b.check_in)}
                  <br />→ {formatDate(b.check_out)}
                </td>
                <td>{b.guests}</td>
                <td>
                  <span className={`status-pill status-${b.status}`}>{b.status}</span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => onReply?.(b)}
                    >
                      Reply
                    </button>
                    {b.status !== 'confirmed' && (
                      <button
                        type="button"
                        className="btn btn--outline"
                        disabled={busyId === b.id}
                        onClick={() => setPending({ booking: b, status: 'confirmed' })}
                      >
                        Confirm
                      </button>
                    )}
                    {b.status === 'pending' && (
                      <button
                        type="button"
                        className="btn btn--danger"
                        disabled={busyId === b.id}
                        onClick={() => setPending({ booking: b, status: 'rejected' })}
                      >
                        Reject
                      </button>
                    )}
                    {b.status !== 'cancelled' && b.status !== 'confirmed' && (
                      <button
                        type="button"
                        className="btn btn--outline"
                        disabled={busyId === b.id}
                        onClick={() => setPending({ booking: b, status: 'cancelled' })}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  <span className="bookings__sub">
                    Requested {formatDateTime(b.created_at)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pending && (
        <ConfirmStatusDialog
          booking={pending.booking}
          status={pending.status}
          working={working}
          onConfirm={executeConfirmedChange}
          onCancel={() => setPending(null)}
        />
      )}
    </>
  )
}

function ConfirmStatusDialog({ booking, status, working, onConfirm, onCancel }) {
  const config = ACTIONS[status]
  const Icon = config.icon
  const statusLabel = status === 'confirmed' ? 'confirmed' : status

  return (
    <div className="admin-modal-backdrop" onClick={working ? undefined : onCancel}>
      <div
        className="admin-modal confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-label={config.title}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className={`confirm-modal__icon ${status === 'confirmed' ? 'is-positive' : 'is-negative'}`}
        >
          <Icon size={26} aria-hidden="true" />
        </span>
        <h2>{config.title}</h2>
        <p className="confirm-modal__message">{config.message}</p>
        <div className="confirm-modal__summary">
          <div className="confirm-modal__row">
            <strong>{booking.customer_name}</strong>
            <span>{booking.email}</span>
          </div>
          <div className="confirm-modal__row">
            <span style={{ fontWeight: 700 }}>{booking.room_name}</span>
            <span>
              {formatDate(booking.check_in)} → {formatDate(booking.check_out)} ·{' '}
              {booking.guests} guest{booking.guests > 1 ? 's' : ''}
            </span>
          </div>
          <span className={`status-pill status-${status}`}>{statusLabel}</span>
        </div>
        <div className="admin-modal__actions">
          <button
            type="button"
            className="btn btn--outline"
            onClick={onCancel}
            disabled={working}
          >
            No, go back
          </button>
          <button
            type="button"
            className={`btn ${config.btnClass}`}
            onClick={onConfirm}
            disabled={working}
          >
            {working && <Loader2 className="spinner" size={16} aria-hidden="true" />}
            Yes, {config.verb.toLowerCase()}
          </button>
        </div>
      </div>
    </div>
  )
}
