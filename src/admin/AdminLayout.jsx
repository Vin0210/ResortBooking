import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Ticket, Hotel, Images, Star, Settings, LogOut, ExternalLink,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import './Admin.css'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: Ticket },
  { to: '/admin/rooms', label: 'Rooms', icon: Hotel },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/amenities', label: 'Amenities', icon: Star },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const { user, loading, signOut, isDemo } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return <div className="admin-loading">Checking session…</div>
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <p className="admin-sidebar__brand">Admin Panel</p>
        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-sidebar__link ${isActive ? 'is-active' : ''}`
              }
            >
              <Icon size={18} aria-hidden="true" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <NavLink to="/" className="admin-sidebar__link">
            <ExternalLink size={18} aria-hidden="true" /> View website
          </NavLink>
          <button type="button" className="admin-sidebar__link" onClick={handleSignOut}>
            <LogOut size={18} aria-hidden="true" /> Sign out
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <span className="admin-topbar__user">
            Signed in as <strong>{user.email}</strong>
          </span>
          {isDemo && <span className="admin-demo-badge">Demo mode</span>}
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
