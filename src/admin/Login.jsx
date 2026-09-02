import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { Loader2, Lock, Mail } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import business from '../config/business'
import './Login.css'

export default function AdminLogin() {
  const { user, login, isDemo } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message ?? 'Invalid email or password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login">
      <form className="login__card" onSubmit={onSubmit} noValidate>
        <p className="login__brand">{business.name}</p>
        <h1>Owner Login</h1>
        {isDemo && (
          <p className="login__demo-note">
            Demo mode: enter any email and a password (4+ characters) to
            explore the dashboard.
          </p>
        )}
        {error && (
          <p className="login__error" role="alert">
            {error}
          </p>
        )}
        <label className="form-field">
          <span className="form-field__label">Email</span>
          <span className="login__input-wrap">
            <Mail size={16} aria-hidden="true" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@example.com"
              autoComplete="email"
              autoFocus
            />
          </span>
        </label>
        <label className="form-field">
          <span className="form-field__label">Password</span>
          <span className="login__input-wrap">
            <Lock size={16} aria-hidden="true" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </span>
        </label>
        <button type="submit" className="btn btn--primary btn--lg" disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="spinner" size={18} aria-hidden="true" /> Signing in…
            </>
          ) : (
            'Sign In'
          )}
        </button>
        <Link to="/" className="login__back">
          ← Back to website
        </Link>
      </form>
    </div>
  )
}
