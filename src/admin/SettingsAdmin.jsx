import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { getSettings, saveSettings } from '../services/api'
import './SettingsAdmin.css'

export default function SettingsAdmin() {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getSettings()
      .then((data) => setForm(data ?? {}))
      .catch(() => setError('Could not load settings.'))
      .finally(() => setLoading(false))
  }, [])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setSaved(false)
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const savedData = await saveSettings(form)
      setForm(savedData ?? form)
      setSaved(true)
    } catch {
      setError('Could not save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="admin-empty">Loading…</p>

  return (
    <>
      <div className="admin-page__header">
        <h1>Business Settings</h1>
        {saved && <span className="settings__saved">Saved ✓</span>}
      </div>

      <form className="admin-card settings__form" onSubmit={onSubmit}>
        {error && <p className="login__error">{error}</p>}

        <h2>Business identity</h2>
        <div className="admin-form-grid">
          <label className="form-field">
            <span className="form-field__label">Business name</span>
            <input
              value={form.business_name ?? ''}
              onChange={(e) => update('business_name', e.target.value)}
              required
            />
          </label>
          <label className="form-field form-field--full">
            <span className="form-field__label">Description</span>
            <textarea
              rows={3}
              value={form.description ?? ''}
              onChange={(e) => update('description', e.target.value)}
            />
          </label>
        </div>

        <h2>Contact information</h2>
        <div className="admin-form-grid">
          <label className="form-field">
            <span className="form-field__label">Phone</span>
            <input
              value={form.phone ?? ''}
              onChange={(e) => update('phone', e.target.value)}
            />
          </label>
          <label className="form-field">
            <span className="form-field__label">Email</span>
            <input
              type="email"
              value={form.email ?? ''}
              onChange={(e) => update('email', e.target.value)}
            />
          </label>
          <label className="form-field form-field--full">
            <span className="form-field__label">Address</span>
            <textarea
              rows={2}
              value={form.address ?? ''}
              onChange={(e) => update('address', e.target.value)}
            />
          </label>
        </div>

        <h2>Social media &amp; map</h2>
        <div className="admin-form-grid">
          <label className="form-field">
            <span className="form-field__label">Facebook URL</span>
            <input
              value={form.facebook ?? ''}
              onChange={(e) => update('facebook', e.target.value)}
            />
          </label>
          <label className="form-field">
            <span className="form-field__label">Instagram URL</span>
            <input
              value={form.instagram ?? ''}
              onChange={(e) => update('instagram', e.target.value)}
            />
          </label>
          <label className="form-field form-field--full">
            <span className="form-field__label">Google Maps URL</span>
            <input
              value={form.map_url ?? ''}
              onChange={(e) => update('map_url', e.target.value)}
            />
          </label>
        </div>

        <div className="admin-modal__actions">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="spinner" size={16} aria-hidden="true" /> Saving…
              </>
            ) : (
              <>
                <Save size={16} aria-hidden="true" /> Save settings
              </>
            )}
          </button>
        </div>
      </form>
    </>
  )
}
