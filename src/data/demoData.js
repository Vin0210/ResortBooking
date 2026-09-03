/**
 * Demo data used when Supabase is not configured.
 * Mirrors the exact shape of the database tables
 * defined in supabase/schema.sql.
 */

const img = (name) => `/images/${name}`

export const demoRooms = [
  {
    id: 1,
    name: 'Deluxe Seaview Room',
    description:
      'Wake up to a panoramic view of the cove. This air-conditioned room features a plush king bed, a private balcony, and a rain shower. Ideal for couples on a romantic getaway.',
    capacity: 2,
    price: 4500,
    status: 'available',
    featured: true,
    created_at: '2026-01-10T08:00:00Z',
    room_images: [
      { id: 11, room_id: 1, image_url: img('dlux.jpg'), sort_order: 0 },
      { id: 12, room_id: 1, image_url: img('room-1.jpg'), sort_order: 1 },
    ],
  },
  {
    id: 2,
    name: 'Family Cottage',
    description:
      'A spacious native cottage with two queen beds, a sala area, and a wide veranda facing the garden. Comfortably fits the whole family, with easy access to the pool and beach.',
    capacity: 6,
    price: 6800,
    status: 'available',
    featured: true,
    created_at: '2026-01-11T08:00:00Z',
    room_images: [
      { id: 21, room_id: 2, image_url: img('room-2.jpg'), sort_order: 0 },
    ],
  },
  {
    id: 3,
    name: 'Beachfront Villa',
    description:
      'Our signature villa sits right on the sand. Enjoy a private plunge pool, outdoor lounge, king bed, and uninterrupted sunset views over the water.',
    capacity: 4,
    price: 12000,
    status: 'available',
    featured: true,
    created_at: '2026-01-12T08:00:00Z',
    room_images: [
      { id: 31, room_id: 3, image_url: img('room-3.jpg'), sort_order: 0 },
    ],
  },
  {
    id: 4,
    name: 'Garden Twin Room',
    description:
      'A cozy, budget-friendly room with two single beds surrounded by tropical greenery. Perfect for friends travelling together or solo guests who want peace and quiet.',
    capacity: 2,
    price: 2800,
    status: 'available',
    featured: false,
    created_at: '2026-01-13T08:00:00Z',
    room_images: [
      { id: 41, room_id: 4, image_url: img('room-4.jpg'), sort_order: 0 },
    ],
  },
]

export const demoAmenities = [
  { id: 1, name: 'Infinity Pool', description: 'Ocean-facing pool open 7 AM – 10 PM', icon: 'Waves' },
  { id: 2, name: 'Private Beach', description: 'Exclusive white-sand cove access', icon: 'Umbrella' },
  { id: 3, name: 'Island Restaurant', description: 'Fresh seafood and Filipino classics daily', icon: 'UtensilsCrossed' },
  { id: 4, name: 'Free Wi-Fi', description: 'High-speed internet in all rooms', icon: 'Wifi' },
  { id: 5, name: 'Airport Transfer', description: 'Convenient pick-up and drop-off service', icon: 'CarTaxiFront' },
  { id: 6, name: 'Event Pavilion', description: 'Venue for weddings and corporate events', icon: 'PartyPopper' },
  { id: 7, name: 'Snorkeling & Kayaks', description: 'Complimentary water sports equipment', icon: 'Ship' },
  { id: 8, name: '24/7 Security', description: 'Safe parking and on-site security', icon: 'ShieldCheck' },
]

export const demoGallery = [
  { id: 1, image_url: img('gallery-1.jpg'), caption: 'White-sand beach at the cove', category: 'Beach' },
  { id: 2, image_url: img('gallery-2.jpg'), caption: 'Infinity pool at dusk', category: 'Pool' },
  { id: 3, image_url: img('gallery-3.jpg'), caption: 'Island restaurant dining', category: 'Dining' },
  { id: 4, image_url: img('gallery-4.jpg'), caption: 'Resort grounds and poolside', category: 'Grounds' },
  { id: 5, image_url: img('gallery-5.jpg'), caption: 'Evening at the shore', category: 'Beach' },
  { id: 6, image_url: img('gallery-6.jpg'), caption: 'Water activities', category: 'Activities' },
  { id: 7, image_url: img('gallery-7.jpg'), caption: 'Poolside lounge', category: 'Pool' },
  { id: 8, image_url: img('hero-beach.jpg'), caption: 'Golden hour at the cove', category: 'Beach' },
]

export const demoBookings = [
  {
    id: 101,
    customer_name: 'Maria Santos',
    email: 'maria.santos@example.com',
    phone: '+63 918 222 3344',
    room_id: 1,
    room_name: 'Deluxe Seaview Room',
    check_in: '2026-03-14',
    check_out: '2026-03-16',
    guests: 2,
    status: 'pending',
    message: 'Is early check-in possible? Arriving on the 7 AM bus.',
    created_at: '2026-02-20T09:12:00Z',
  },
  {
    id: 102,
    customer_name: 'James & Anna Reyes',
    email: 'jreyes@example.com',
    phone: '+63 917 555 8899',
    room_id: 3,
    room_name: 'Beachfront Villa',
    check_in: '2026-04-03',
    check_out: '2026-04-06',
    guests: 2,
    status: 'confirmed',
    message: 'Celebrating our anniversary — any dinner recommendations?',
    created_at: '2026-02-18T15:40:00Z',
  },
  {
    id: 103,
    customer_name: 'The Cruz Family',
    email: 'cruzfamily@example.com',
    phone: '+63 916 777 1212',
    room_id: 2,
    room_name: 'Family Cottage',
    check_in: '2026-03-21',
    check_out: '2026-03-23',
    guests: 5,
    status: 'pending',
    message: '',
    created_at: '2026-02-22T11:05:00Z',
  },
  {
    id: 104,
    customer_name: 'Peter Lim',
    email: 'peter.lim@example.com',
    phone: '+63 908 123 9876',
    room_id: 4,
    room_name: 'Garden Twin Room',
    check_in: '2026-02-28',
    check_out: '2026-03-01',
    guests: 2,
    status: 'cancelled',
    message: 'Plans changed, sorry!',
    created_at: '2026-02-10T18:22:00Z',
  },
]

export const demoInquiries = [
  {
    id: 201,
    name: 'Andrea Villanueva',
    email: 'andrea.v@example.com',
    phone: '+63 919 444 5566',
    message: 'Hi! Do you host small weddings? Around 60 guests for December.',
    status: 'new',
    created_at: '2026-02-23T08:30:00Z',
  },
  {
    id: 202,
    name: 'Mark Dizon',
    email: 'mdizon@example.com',
    phone: '+63 915 888 2211',
    message: 'What are your rates for a corporate team building for 40 pax?',
    status: 'new',
    created_at: '2026-02-21T14:10:00Z',
  },
  {
    id: 203,
    name: 'Grace Tan',
    email: 'grace.tan@example.com',
    phone: '+63 926 333 7788',
    message: 'Are pets allowed in the cottages?',
    status: 'resolved',
    created_at: '2026-02-15T10:45:00Z',
  },
]

export const demoSettings = {
  business_name: "Elvin's Beach Resort",
  phone: '+63 917 123 4567',
  email: 'hello@elvinsbeachresort.ph',
  address: 'Brgy. Culianan, Zamboanga City, Philippines',
  facebook: 'https://facebook.com/elvinsbeachresort',
  instagram: 'https://instagram.com/elvinsbeachresort',
  map_url: 'https://maps.google.com/?q=Culianan,+Zamboanga+City,+Philippines',
  description:
    "Elvin's Beach Resort is a beachfront getaway featuring native cottages, an infinity pool, and direct access to a private white-sand cove.",
}

