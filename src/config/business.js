/**
 * ============================================================
 * BUSINESS CONFIGURATION
 * ============================================================
 * This is the single source of truth for client-specific
 * content. To adapt this template for a new business, change
 * the values here (plus the CSS theme in src/index.css and
 * the images in /public/images) — no code changes needed.
 */

export const business = {
  name: "Elvin's Beach Resort",
  shortName: "Elvin's",
  tagline: 'Your island escape awaits',
  description:
    "Elvin's Beach Resort is a beachfront getaway featuring native cottages, an infinity pool, and direct access to a private white-sand cove. Perfect for families, couples, and events.",

  // Contact
  phone: '+63 917 123 4567',
  email: 'hello@elvinsbeachresort.ph',
  address: 'Brgy. Culianan, Zamboanga City, Philippines',
  mapEmbed:
    'https://maps.google.com/maps?q=Culianan,+Zamboanga+City,+Philippines&t=&z=15&ie=UTF8&iwloc=&output=embed',
  mapLink: 'https://maps.google.com/?q=Culianan,+Zamboanga+City,+Philippines',

  // Social media
  social: {
    facebook: 'https://facebook.com/elvinsbeachresort',
    instagram: 'https://instagram.com/elvinsbeachresort',
    tiktok: 'https://tiktok.com/@elvinsbeachresort',
  },

  hours: [
    { label: 'Front desk', value: 'Open 24/7' },
    { label: 'Check-in', value: '2:00 PM' },
    { label: 'Check-out', value: '12:00 NN' },
  ],

  // SEO / domain (used for sitemap + structured data)
  url: 'https://resort-booking-lxkq9ji6d-elvin15.vercel.app',
  logo: '/favicon.svg',

  // Guest testimonials shown on the home page
  testimonials: [
    {
      name: 'Maria & Jose Santos',
      location: 'Makati City',
      rating: 5,
      text: 'The beachfront villa was even better than the photos. Waking up to the waves, private plunge pool, and the staff treated us like family. We are already booking again for December.',
    },
    {
      name: 'The Cruz Family',
      location: 'Quezon City',
      rating: 5,
      text: 'We took the whole family and the kids did not want to leave. Safe swimming, clean cottages, and the restaurant food was genuinely excellent. Worth every peso.',
    },
    {
      name: 'Andrea Villanueva',
      location: 'Tagaytay',
      rating: 5,
      text: 'We held our wedding at the event pavilion and it was magical. The team handled everything — setup, catering, timing. Our guests still talk about the sunset ceremony.',
    },
  ],
}

export default business
