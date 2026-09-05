import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import ScrollToTop from './components/ScrollToTop'
import ScrollTopButton from './components/ScrollTopButton'
import StickyBookBar from './components/StickyBookBar/StickyBookBar'

import Home from './pages/Home'
import About from './pages/About'
import Rooms from './pages/Rooms'
import RoomDetails from './pages/RoomDetails'
import Gallery from './pages/Gallery'
import Booking from './pages/Booking'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

import AdminLogin from './admin/Login'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import BookingsAdmin from './admin/Bookings'
import RoomsAdmin from './admin/RoomsAdmin'
import GalleryAdmin from './admin/GalleryAdmin'
import AmenitiesAdmin from './admin/AmenitiesAdmin'
import SettingsAdmin from './admin/SettingsAdmin'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <div className="app-shell">
          <Routes>
            {/* Public website */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/rooms" element={<PublicLayout><Rooms /></PublicLayout>} />
            <Route path="/rooms/:id" element={<PublicLayout><RoomDetails /></PublicLayout>} />
            <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
            <Route path="/booking" element={<PublicLayout><Booking /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

            {/* Admin (own layout, no public navbar/footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<BookingsAdmin />} />
              <Route path="rooms" element={<RoomsAdmin />} />
              <Route path="gallery" element={<GalleryAdmin />} />
              <Route path="amenities" element={<AmenitiesAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
            </Route>

            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="app-main">{children}</main>
      <Footer />
      <StickyBookBar />
      <ScrollTopButton />
    </>
  )
}
