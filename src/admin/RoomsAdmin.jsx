import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Upload, Loader2 } from 'lucide-react'
import { getRooms, saveRoom, deleteRoom, addRoomImage } from '../services/api'
import { formatPrice } from '../utils/format'

const STATUSES = ['available', 'unavailable', 'maintenance']
const EMPTY = { name: '', description: '', capacity: 2, price: 0, status: 'available', featured: false }

export default function RoomsAdmin() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function refresh() {
    setRooms(await getRooms())
  }

  useEffect(() => {
    getRooms()
      .then(setRooms)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function onSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await saveRoom(editing)
      setEditing(null)
      await refresh()
    } catch (err) {
      setError(err.message ?? 'Could not save the room.')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(room) {
    if (!window.confirm(`Delete “${room.name}”? This cannot be undone.`)) return
    await deleteRoom(room.id)
    await refresh()
  }

  async function onUploadImage(room, file) {
    if (!file) return
    await addRoomImage(room.id, file)
    await refresh()
  }

  return (
    <>
      <div className="admin-page__header">
        <h1>Rooms</h1>
        <button type="button" className="btn btn--primary" onClick={() => setEditing({ ...EMPTY })}>
          <Plus size={16} aria-hidden="true" /> Add room
        </button>
      </div>

      {loading ? (
        <p className="admin-empty">Loading…</p>
      ) : (
        <RoomsTable rooms={rooms} onDelete={onDelete} onUploadImage={onUploadImage} setEditing={setEditing} />
      )}

      {editing && (
        <RoomModal
          editing={editing}
          setEditing={setEditing}
          saving={saving}
          error={error}
          onSave={onSave}
        />
      )}
    </>
  )
}

function RoomsTable({ rooms, onDelete, onUploadImage, setEditing }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Room</th>
            <th>Capacity</th>
            <th>Price / night</th>
            <th>Status</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 && (
            <tr>
              <td colSpan={6} className="admin-empty">
                No rooms yet — add your first one.
              </td>
            </tr>
          )}
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>
                <strong>{room.name}</strong>
                <span className="bookings__sub">
                  {room.description?.slice(0, 70)}
                  {room.description?.length > 70 ? '…' : ''}
                </span>
              </td>
              <td>{room.capacity} guests</td>
              <td>{formatPrice(room.price)}</td>
              <td>
                <span className={`status-pill status-${room.status}`}>{room.status}</span>
              </td>
              <td>{room.featured ? 'Yes' : 'No'}</td>
              <td>
                <div className="admin-actions">
                  <button type="button" className="btn btn--outline" onClick={() => setEditing({ ...room })}>
                    <Pencil size={14} aria-hidden="true" /> Edit
                  </button>
                  <label className="btn btn--outline">
                    <Upload size={14} aria-hidden="true" /> Photo
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => onUploadImage(room, e.target.files?.[0])}
                    />
                  </label>
                  <button type="button" className="btn btn--danger" onClick={() => onDelete(room)}>
                    <Trash2 size={14} aria-hidden="true" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function RoomModal({ editing, setEditing, saving, error, onSave }) {
  return (
    <div className="admin-modal-backdrop" onClick={() => setEditing(null)}>
      <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={onSave}>
        <h2>{editing.id ? 'Edit room' : 'Add room'}</h2>
        {error && <p className="login__error">{error}</p>}
        <div className="admin-form-grid">
          <label className="form-field form-field--full">
            <span className="form-field__label">Name</span>
            <input
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              required
            />
          </label>
          <label className="form-field form-field--full">
            <span className="form-field__label">Description</span>
            <textarea
              rows={4}
              value={editing.description ?? ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </label>
          <label className="form-field">
            <span className="form-field__label">Capacity (guests)</span>
            <input
              type="number"
              min="1"
              value={editing.capacity}
              onChange={(e) => setEditing({ ...editing, capacity: e.target.value })}
              required
            />
          </label>
          <label className="form-field">
            <span className="form-field__label">Price per night (₱)</span>
            <input
              type="number"
              min="0"
              value={editing.price}
              onChange={(e) => setEditing({ ...editing, price: e.target.value })}
              required
            />
          </label>
          <label className="form-field">
            <span className="form-field__label">Status</span>
            <select
              value={editing.status}
              onChange={(e) => setEditing({ ...editing, status: e.target.value })}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span className="form-field__label">Featured on homepage</span>
            <select
              value={editing.featured ? 'yes' : 'no'}
              onChange={(e) => setEditing({ ...editing, featured: e.target.value === 'yes' })}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
        </div>
        <div className="admin-modal__actions">
          <button type="button" className="btn btn--outline" onClick={() => setEditing(null)}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving && <Loader2 className="spinner" size={16} aria-hidden="true" />}
            {editing.id ? 'Save changes' : 'Create room'}
          </button>
        </div>
      </form>
    </div>
  )
}

