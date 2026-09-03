/**
 * ============================================================
 * DATA ACCESS LAYER
 * ============================================================
 * Every function talks to Supabase when credentials are
 * configured, and falls back to the local demo store otherwise.
 * UI components only ever call these functions.
 */
import { supabase, isSupabaseConfigured, STORAGE_BUCKETS } from './supabase'
import { demoStore } from './demoStore'

const isDemo = !isSupabaseConfigured

/* ---------------- Public: rooms ---------------- */

export async function getRooms() {
  if (isDemo) return demoStore.rooms
  const { data, error } = await supabase
    .from('rooms')
    .select('*, room_images(*)')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getRoom(id) {
  if (isDemo) return demoStore.rooms.find((r) => r.id === Number(id)) ?? null
  const { data, error } = await supabase
    .from('rooms')
    .select('*, room_images(*)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}

/* ---------------- Public: amenities / gallery ---------------- */

export async function getAmenities() {
  if (isDemo) return demoStore.amenities
  const { data, error } = await supabase
    .from('amenities')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getGallery() {
  if (isDemo) return demoStore.gallery
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

/* ---------------- Public: submissions ---------------- */

export async function createBooking(payload) {
  if (isDemo) {
    await delay(600) // simulate network for realistic demo UX
    const room = demoStore.rooms.find((r) => r.id === Number(payload.room_id))
    return demoStore.insertBooking({
      ...payload,
      room_id: room ? room.id : null,
      room_name: room ? room.name : 'General booking',
    })
  }
  const { error } = await supabase
    .from('bookings')
    .insert([{ ...payload, status: 'pending' }])
  if (error) throw error
}

export async function createInquiry(payload) {
  if (isDemo) {
    await delay(600)
    return demoStore.insertInquiry(payload)
  }
  const { error } = await supabase
    .from('inquiries')
    .insert([{ ...payload, status: 'new' }])
  if (error) throw error
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/* ---------------- Admin: bookings / inquiries ---------------- */

export async function getBookings() {
  if (isDemo) return demoStore.bookings
  const { data, error } = await supabase
    .from('bookings')
    .select('*, rooms(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((b) => ({
    ...b,
    room_name: b.rooms?.name ?? 'General booking',
  }))
}

export async function updateBookingStatus(id, status) {
  if (isDemo) return demoStore.updateBookingStatus(id, status)
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteBooking(id) {
  if (isDemo) return demoStore.deleteBooking(id)
  const { error } = await supabase.from('bookings').delete().eq('id', id)
  if (error) throw error
}

export async function getInquiries() {
  if (isDemo) return demoStore.inquiries
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function updateInquiryStatus(id, status) {
  if (isDemo) return demoStore.updateBookingStatus(id, status)
  const { data, error } = await supabase
    .from('inquiries')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/* ---------------- Admin: rooms ---------------- */

export async function saveRoom(room) {
  const fields = { ...room }
  delete fields.id
  delete fields.room_images
  if (isDemo) {
    return demoStore.upsertRoom(room.id ? { ...fields, id: room.id } : fields)
  }
  if (room.id) {
    const { data, error } = await supabase
      .from('rooms')
      .update(fields)
      .eq('id', room.id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  const { data, error } = await supabase
    .from('rooms')
    .insert([fields])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteRoom(id) {
  if (isDemo) return demoStore.deleteRoom(id)
  const { error } = await supabase.from('rooms').delete().eq('id', id)
  if (error) throw error
}

export async function addRoomImage(roomId, file) {
  const url = await uploadImage(STORAGE_BUCKETS.rooms, file, `room-${roomId}`)
  if (isDemo) return url
  const { data, error } = await supabase
    .from('room_images')
    .insert([{ room_id: roomId, image_url: url, sort_order: 0 }])
    .select()
    .single()
  if (error) throw error
  return data
}

/* ---------------- Admin: amenities ---------------- */

export async function saveAmenity(amenity) {
  const { id, ...fields } = amenity
  if (isDemo) return demoStore.upsertAmenity({ ...fields, ...(id ? { id } : {}) })
  if (id) {
    const { data, error } = await supabase
      .from('amenities')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  const { data, error } = await supabase
    .from('amenities')
    .insert([fields])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteAmenity(id) {
  if (isDemo) return demoStore.deleteAmenity(id)
  const { error } = await supabase.from('amenities').delete().eq('id', id)
  if (error) throw error
}

/* ---------------- Admin: gallery ---------------- */

export async function addGalleryImage(file, caption, category) {
  const url = await uploadImage(STORAGE_BUCKETS.gallery, file, 'photos')
  if (isDemo) {
    return demoStore.insertGalleryImage({ image_url: url, caption, category })
  }
  const { data, error } = await supabase
    .from('gallery')
    .insert([{ image_url: url, caption, category }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateGalleryImage(id, patch) {
  if (isDemo) return demoStore.updateGalleryImage(id, patch)
  const { data, error } = await supabase
    .from('gallery')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteGalleryImage(id) {
  if (isDemo) return demoStore.deleteGalleryImage(id)
  const { error } = await supabase.from('gallery').delete().eq('id', id)
  if (error) throw error
}

/* ---------------- Admin: settings ---------------- */

export async function getSettings() {
  if (isDemo) return demoStore.settings
  const { data, error } = await supabase
    .from('business_settings')
    .select('*')
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function saveSettings(settings) {
  if (isDemo) return demoStore.saveSettings(settings)
  const { id, ...fields } = settings
  if (id) {
    const { data, error } = await supabase
      .from('business_settings')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  const { data, error } = await supabase
    .from('business_settings')
    .insert([fields])
    .select()
    .single()
  if (error) throw error
  return data
}

/* ---------------- Storage helper ---------------- */

export async function uploadImage(bucket, file, folder = 'uploads') {
  if (isDemo) {
    // In demo mode there is no storage — read the file as a local URL.
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${folder}/${Date.now()}-${safeName}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export { isDemo }

