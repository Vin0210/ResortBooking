import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { getRooms, createBooking } from '../../services/api'
import { formatPrice, nightsBetween, isValidEmail } from '../../utils/format'
import './BookingForm.css'

const initialForm = {
  customer_name: '',
  email: '',
  phone: '',
  room_id: '',
  check_in: '',
  check_out: '',
  guests: 2,
  message: '',
}

export default function BookingForm() {
  const [searchParams] = useSearchParams()
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    getRooms()
      .then((data) => {
        setRooms(data)
        const preselect = searchParams.get('room')
        if (preselect && data.some((r) => String(r.id) === preselect)) {
          setForm((f) => ({ ...f, room_id: preselect }))
        }
      })
      .catch(() => setSubmitError('Could not load rooms. Please try again later.'))
  }, [searchParams])

  const selectedRoom = rooms.find((r) => String(r.id) === String(form.room_id))
  const nights = nightsBetween(form.check_in, form.check_out)
  const estimate = selectedRoom ? nights * Number(selectedRoom.price) : 0

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const next = {}
    if (!form.customer_name.trim()) next.customer_name = 'Please enter your name.'
    if (!isValidEmail(form.email)) next.email = 'Please enter a valid email address.'
    if (!form.phone.trim()) next.phone = 'Please enter your contact number.'
    if (!form.room_id) next.room_id = 'Please select a room.'
    if (!form.check_in) next.check_in = 'Check-in date is required.'
    if (!form.check_out) next.check_out = 'Check-out date is required.'
    if (form.check_in && form.check_out && nights <= 0) {
      next.check_out = 'Check-out must be after check-in.'
    }
    if (form.check_in && form.check_in < new Date().toISOString().slice(0, 10)) {
      next.check_in = 'Check-in cannot be in the past.'
    }
    if (Number(form.guests) < 1) next.guests = 'At least one guest is required.'
    if (selectedRoom && Number(form.guests) > selectedRoom.capacity) {
      next.guests = `This room accommodates up to ${selectedRoom.capacity} guests.`
    }
    return next
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSubmitError('')
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    setSubmitting(true)
    try {
      await createBooking(form)
      setSuccess(true)
      setForm(initialForm)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setSubmitError(
        'Something went wrong while sending your request. Please try again or contact us directly.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return <BookingFormFields
    form={form} errors={errors} rooms={rooms} selectedRoom={selectedRoom}
    nights={nights} estimate={estimate} submitting={submitting} success={success}
    submitError={submitError} update={update} onSubmit={onSubmit} setSuccess={setSuccess}
  />
}

function BookingFormFields({
  form, errors, rooms, selectedRoom, nights, estimate,
  submitting, success, submitError, update, onSubmit, setSuccess,
}) {
  if (success) {
    return (
      <div className="booking-form__success" role="status">
        <CheckCircle2 size={52} aria-hidden="true" />
        <h2>Booking request received!</h2>
        <p>
          Thank you! Our team will review your request and contact you within
          24 hours to confirm availability and finalize your reservation.
        </p>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setSuccess(null)}
        >
          Make another booking
        </button>
      </div>
    )
  }

  return (
    <form className="booking-form" onSubmit={onSubmit} noValidate>
      {submitError && (
        <p className="booking-form__error-banner" role="alert">
          <AlertCircle size={18} aria-hidden="true" /> {submitError}
        </p>
      )}

      <div className="form-row form-row--2">
        <FormField label="Full name" error={errors.customer_name} required>
          <input
            type="text"
            value={form.customer_name}
            onChange={(e) => update('customer_name', e.target.value)}
            placeholder="Juan Dela Cruz"
            autoComplete="name"
          />
        </FormField>
        <FormField label="Email address" error={errors.email} required>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </FormField>
      </div>

      <div className="form-row form-row--2">
        <FormField label="Contact number" error={errors.phone} required>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+63 9XX XXX XXXX"
            autoComplete="tel"
          />
        </FormField>
        <FormField label="Room / cottage" error={errors.room_id} required>
          <select
            value={form.room_id}
            onChange={(e) => update('room_id', e.target.value)}
          >
            <option value="">Select a room…</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} — {formatPrice(room.price)}/night
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="form-row form-row--3">
        <FormField label="Check-in" error={errors.check_in} required>
          <input
            type="date"
            value={form.check_in}
            onChange={(e) => update('check_in', e.target.value)}
          />
        </FormField>
        <FormField label="Check-out" error={errors.check_out} required>
          <input
            type="date"
            value={form.check_out}
            min={form.check_in || undefined}
            onChange={(e) => update('check_out', e.target.value)}
          />
        </FormField>
        <FormField label="Guests" error={errors.guests} required>
          <input
            type="number"
            min="1"
            max={selectedRoom?.capacity ?? 20}
            value={form.guests}
            onChange={(e) => update('guests', e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Message (optional)" error={errors.message}>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Special requests, celebrations, dietary needs…"
        />
      </FormField>

      {estimate > 0 && (
        <p className="booking-form__estimate">
          Estimated total: <strong>{formatPrice(estimate)}</strong> for {nights}{' '}
          night{nights > 1 ? 's' : ''}
          <span> — final quote will be confirmed by our team.</span>
        </p>
      )}

      <button type="submit" className="btn btn--accent btn--lg" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="spinner" size={18} aria-hidden="true" /> Sending…
          </>
        ) : (
          'Submit Booking Request'
        )}
      </button>
      <p className="booking-form__note">
        No payment needed now — we’ll confirm availability and contact you to
        finalize your reservation.
      </p>
    </form>
  )
}

function FormField({ label, error, required, children }) {
  return (
    <label className={`form-field ${error ? 'has-error' : ''}`}>
      <span className="form-field__label">
        {label}
        {required && <em aria-hidden="true"> *</em>}
      </span>
      {children}
      {error && (
        <span className="form-field__error" role="alert">
          {error}
        </span>
      )}
    </label>
  )
}

