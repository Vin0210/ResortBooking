import { formatDate, formatDateTime } from '../utils/format'

/**
 * Table of booking requests with confirm / reject / cancel actions.
 * Receives bookings + changeStatus from the parent page.
 */
export default function BookingsTable({ bookings, changeStatus, expanded, setExpanded }) {
  if (bookings.length === 0) {
    return <p className="admin-empty admin-card">No bookings in this view.</p>
  }

  return (
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
            <tr key={b.id}>
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
                  {b.status !== 'confirmed' && (
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => changeStatus(b.id, 'confirmed')}
                    >
                      Confirm
                    </button>
                  )}
                  {b.status === 'pending' && (
                    <button
                      type="button"
                      className="btn btn--danger"
                      onClick={() => changeStatus(b.id, 'rejected')}
                    >
                      Reject
                    </button>
                  )}
                  {b.status !== 'cancelled' && (
                    <button
                      type="button"
                      className="btn btn--outline"
                      onClick={() => changeStatus(b.id, 'cancelled')}
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
  )
}
