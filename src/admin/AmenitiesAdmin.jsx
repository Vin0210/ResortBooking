import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { getAmenities, saveAmenity, deleteAmenity } from '../services/api'

const ICON_NAMES = [
  'Waves', 'Umbrella', 'UtensilsCrossed', 'Wifi', 'Ship', 'ShieldCheck',
  'PartyPopper', 'Star', 'Sun', 'Flame', 'Camera', 'Tent', 'Hotel', 'Palmtree',
]
const EMPTY = { name: '', description: '', icon: 'Star' }

export default function AmenitiesAdmin() {
  const [amenities, setAmenities] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function refresh() {
    setAmenities(await getAmenities())
  }

  useEffect(() => {
    getAmenities()
      .then(setAmenities)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function onSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await saveAmenity(editing)
      setEditing(null)
      await refresh()
    } catch (err) {
      setError(err.message ?? 'Could not save the amenity.')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(amenity) {
    if (!window.confirm(`Delete “${amenity.name}”?`)) return
    await deleteAmenity(amenity.id)
    await refresh()
  }

  return (
    <>
      <div className="admin-page__header">
        <h1>Amenities</h1>
        <button type="button" className="btn btn--primary" onClick={() => setEditing({ ...EMPTY })}>
          <Plus size={16} aria-hidden="true" /> Add amenity
        </button>
      </div>

      {loading ? (
        <p className="admin-empty">Loading…</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Icon</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {amenities.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-empty">
                    No amenities yet.
                  </td>
                </tr>
              )}
              {amenities.map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong>{a.name}</strong>
                  </td>
                  <td>{a.description}</td>
                  <td>{a.icon}</td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="btn btn--outline"
                        onClick={() => setEditing({ ...a })}
                      >
                        <Pencil size={14} aria-hidden="true" /> Edit
                      </button>
                      <button type="button" className="btn btn--danger" onClick={() => onDelete(a)}>
                        <Trash2 size={14} aria-hidden="true" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="admin-modal-backdrop" onClick={() => setEditing(null)}>
          <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={onSave}>
            <h2>{editing.id ? 'Edit amenity' : 'Add amenity'}</h2>
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
                  rows={2}
                  value={editing.description ?? ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </label>
              <label className="form-field form-field--full">
                <span className="form-field__label">Icon</span>
                <select
                  value={editing.icon}
                  onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                >
                  {ICON_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="admin-modal__actions">
              <button type="button" className="btn btn--outline" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving && <Loader2 className="spinner" size={16} aria-hidden="true" />}
                {editing.id ? 'Save changes' : 'Create amenity'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
