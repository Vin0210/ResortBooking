import { useEffect, useState } from 'react'
import { Trash2, Upload, Loader2, Pencil, Check } from 'lucide-react'
import {
  getGallery, addGalleryImage, updateGalleryImage, deleteGalleryImage,
} from '../services/api'
import './GalleryAdmin.css'

const CATEGORIES = ['Beach', 'Pool', 'Rooms', 'Dining', 'Activities', 'Grounds', 'Events']

export default function GalleryAdmin() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState({ caption: '', category: '' })

  async function refresh() {
    setImages(await getGallery())
  }

  useEffect(() => {
    getGallery()
      .then(setImages)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function onUpload(e) {
    e.preventDefault()
    const form = e.currentTarget
    const file = form.file.files?.[0]
    if (!file) {
      setError('Choose an image file first.')
      return
    }
    setUploading(true)
    setError('')
    try {
      await addGalleryImage(file, form.caption.value.trim(), form.category.value)
      form.reset()
      await refresh()
    } catch (err) {
      setError(err.message ?? 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Delete this photo?')) return
    await deleteGalleryImage(id)
    await refresh()
  }

  function startEdit(img) {
    setEditingId(img.id)
    setEditDraft({ caption: img.caption ?? '', category: img.category ?? '' })
  }

  async function saveEdit(id) {
    await updateGalleryImage(id, {
      caption: editDraft.caption,
      category: editDraft.category,
    })
    setEditingId(null)
    await refresh()
  }

  return (
    <>
      <div className="admin-page__header">
        <h1>Gallery</h1>
        <span className="bookings__sub">{images.length} photos</span>
      </div>

      <form className="admin-card gallery-admin__upload" onSubmit={onUpload}>
        <label className="form-field">
          <span className="form-field__label">Photo</span>
          <input type="file" name="file" accept="image/*" required />
        </label>
        <label className="form-field">
          <span className="form-field__label">Caption</span>
          <input type="text" name="caption" placeholder="e.g. Sunset from the villa" />
        </label>
        <label className="form-field">
          <span className="form-field__label">Category</span>
          <select name="category" defaultValue="">
            <option value="">Uncategorized</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn btn--primary" disabled={uploading}>
          {uploading ? (
            <>
              <Loader2 className="spinner" size={16} aria-hidden="true" /> Uploading…
            </>
          ) : (
            <>
              <Upload size={16} aria-hidden="true" /> Upload photo
            </>
          )}
        </button>
      </form>

      {error && <p className="login__error">{error}</p>}

      {loading ? (
        <p className="admin-empty">Loading…</p>
      ) : images.length === 0 ? (
        <p className="admin-empty admin-card">No photos yet — upload the first one above.</p>
      ) : (
        <div className="gallery-admin__grid">
          {images.map((img) => (
            <figure key={img.id} className="gallery-admin__item">
              <img src={img.image_url} alt={img.caption || 'Gallery photo'} loading="lazy" />
              {editingId === img.id ? (
                <div className="gallery-admin__edit">
                  <input
                    type="text"
                    value={editDraft.caption}
                    onChange={(e) => setEditDraft({ ...editDraft, caption: e.target.value })}
                    placeholder="Caption"
                  />
                  <select
                    value={editDraft.category}
                    onChange={(e) => setEditDraft({ ...editDraft, category: e.target.value })}
                  >
                    <option value="">Uncategorized</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="btn btn--primary" onClick={() => saveEdit(img.id)}>
                    <Check size={14} aria-hidden="true" /> Save
                  </button>
                </div>
              ) : (
                <figcaption>
                  <span>
                    {img.caption || <em>No caption</em>}
                    {img.category && <small> · {img.category}</small>}
                  </span>
                  <span className="admin-actions">
                    <button
                      type="button"
                      className="btn btn--outline"
                      onClick={() => startEdit(img)}
                      aria-label={`Edit caption for ${img.caption || 'photo'}`}
                    >
                      <Pencil size={13} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger"
                      onClick={() => onDelete(img.id)}
                      aria-label={`Delete ${img.caption || 'photo'}`}
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </span>
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </>
  )
}
