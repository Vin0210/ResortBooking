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
  name: 'Azure Cove Beach Resort',
  shortName: 'Azure Cove',
  tagline: 'Your island escape awaits',
  description:
    'Azure Cove Beach Resort is a beachfront getaway featuring native cottages, a infinity pool, and direct access to a private white-sand cove. Perfect for families, couples, and events.',

  // Contact
  phone: '+63 917 123 4567',
  email: 'hello@azurecove.ph',
  address: '123 Shoreline Road, Brgy. San Isidro, Batangas, Philippines',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61837.63258603475!2d120.9382566!3d13.9357547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd6b0b6bb3b0b3%3A0x8bb3b0b6bb3b0b3!2sBatangas!5e0!3m2!1sen!2sph!4v1700000000000',
  mapLink: 'https://maps.google.com/?q=Batangas+Philippines',

  // Social media
  social: {
    facebook: 'https://facebook.com/azurecove',
    instagram: 'https://instagram.com/azurecove',
    tiktok: 'https://tiktok.com/@azurecove',
  },

  hours: [
    { label: 'Front desk', value: 'Open 24/7' },
    { label: 'Check-in', value: '2:00 PM' },
    { label: 'Check-out', value: '12:00 NN' },
  ],

  // SEO / domain (used for sitemap + structured data)
  url: 'https://azurecove.ph',
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
