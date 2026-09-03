/**
 * Local persisted store used in DEMO MODE (no Supabase configured).
 * Seeds itself from demoData on first run, then persists all
 * admin/public changes to localStorage so the demo feels real.
 */
import {
  demoRooms,
  demoAmenities,
  demoGallery,
  demoBookings,
  demoInquiries,
  demoSettings,
} from '../data/demoData'

const KEY = 'azure_cove_demo_store_v4'

function seed() {
  return {
    rooms: demoRooms,
    amenities: demoAmenities,
    gallery: demoGallery,
    bookings: demoBookings,
    inquiries: demoInquiries,
    settings: demoSettings,
    nextId: 1000,
  }
}

let cache = null

function load() {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(KEY)
    cache = raw ? JSON.parse(raw) : seed()
  } catch {
    cache = seed()
  }
  return cache
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(cache))
  } catch {
    /* storage unavailable — keep in-memory only */
  }
}

export function resetDemoStore() {
  cache = seed()
  save()
}

export const demoStore = {
  get rooms() {
    return [...load().rooms]
  },
  get amenities() {
    return [...load().amenities]
  },
  get gallery() {
    return [...load().gallery]
  },
  get bookings() {
    return [...load().bookings]
  },
  get inquiries() {
    return [...load().inquiries]
  },
  get settings() {
    return { ...load().settings }
  },

  insertBooking(data) {
    const db = load()
    const booking = {
      id: ++db.nextId,
      status: 'pending',
      created_at: new Date().toISOString(),
      ...data,
    }
    db.bookings.unshift(booking)
    save()
    return booking
  },

  insertInquiry(data) {
    const db = load()
    const inquiry = {
      id: ++db.nextId,
      status: 'new',
      created_at: new Date().toISOString(),
      ...data,
    }
    db.inquiries.unshift(inquiry)
    save()
    return inquiry
  },

  updateBookingStatus(id, status) {
    const db = load()
    const b = db.bookings.find((x) => x.id === id)
    if (b) b.status = status
    save()
    return b
  },

  deleteBooking(id) {
    const db = load()
    db.bookings = db.bookings.filter((x) => x.id !== id)
    save()
  },

  upsertRoom(room) {
    const db = load()
    if (room.id) {
      const i = db.rooms.findIndex((r) => r.id === room.id)
      if (i >= 0) db.rooms[i] = { ...db.rooms[i], ...room }
      return db.rooms[i]
    }
    const created = { ...room, id: ++db.nextId, created_at: new Date().toISOString() }
    db.rooms.push(created)
    save()
    return created
  },

  deleteRoom(id) {
    const db = load()
    db.rooms = db.rooms.filter((r) => r.id !== id)
    save()
  },

  upsertAmenity(amenity) {
    const db = load()
    if (amenity.id) {
      const i = db.amenities.findIndex((a) => a.id === amenity.id)
      if (i >= 0) db.amenities[i] = { ...db.amenities[i], ...amenity }
      return db.amenities[i]
    }
    const created = { ...amenity, id: ++db.nextId }
    db.amenities.push(created)
    save()
    return created
  },

  deleteAmenity(id) {
    const db = load()
    db.amenities = db.amenities.filter((a) => a.id !== id)
    save()
  },

  insertGalleryImage(image) {
    const db = load()
    const created = { ...image, id: ++db.nextId }
    db.gallery.unshift(created)
    save()
    return created
  },

  updateGalleryImage(id, patch) {
    const db = load()
    const g = db.gallery.find((x) => x.id === id)
    if (g) Object.assign(g, patch)
    save()
    return g
  },

  deleteGalleryImage(id) {
    const db = load()
    db.gallery = db.gallery.filter((g) => g.id !== id)
    save()
  },

  saveSettings(settings) {
    const db = load()
    db.settings = { ...db.settings, ...settings }
    save()
    return db.settings
  },
}
