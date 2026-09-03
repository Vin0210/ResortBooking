// ============================================================
// Supabase Edge Function: booking-notification
// ------------------------------------------------------------
// Sends an email to the business owner whenever a customer
// submits a booking or inquiry, and an optional confirmation
// email to the customer.
//
// Deploy (requires Supabase CLI):
//   supabase functions deploy booking-notification --no-verify-jwt
//   supabase secrets set RESEND_API_KEY=re_xxxxxxxx
//   supabase secrets set OWNER_EMAIL=owner@example.com
//
// Then in Supabase Dashboard -> Database -> Webhooks, create a
// webhook on table `bookings` (event: INSERT) pointing at:
//   https://<project-ref>.supabase.co/functions/v1/booking-notification
// Repeat for table `inquiries`.
//
// Sender domain: verify your domain at resend.com/domains, or use
// onboarding@resend.dev for testing.
// ============================================================

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: Record<string, unknown>
  old_record: Record<string, unknown> | null
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL')!
const FROM = Deno.env.get('EMAIL_FROM') ?? 'Azure Cove <onboarding@resend.dev>'
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://azurecove.ph'

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let payload: WebhookPayload
  try {
    payload = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { type, table, record } = payload

  try {
    if (table === 'bookings') {
      if (type === 'INSERT') {
        await sendBookingEmails(record)
      } else if (type === 'UPDATE') {
        await sendStatusChangeEmail(record, payload.old_record)
      } else {
        return new Response('Ignored — DELETE event', { status: 200 })
      }
    } else if (table === 'inquiries') {
      if (type !== 'INSERT') {
        return new Response('Ignored — not an INSERT', { status: 200 })
      }
      await sendInquiryEmail(record)
    } else {
      return new Response(`Ignored table: ${table}`, { status: 200 })
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Notification failed:', err)
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  })
  if (!res.ok) {
    throw new Error(`Resend error ${res.status}: ${await res.text()}`)
  }
}

const wrap = (inner: string) => `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#132e3b">
    <h2 style="color:#0e7490">Azure Cove Beach Resort</h2>
    ${inner}
    <p style="color:#5b6b74;font-size:12px;margin-top:24px">
      Sent automatically from ${SITE_URL}
    </p>
  </div>`

async function sendBookingEmails(b: Record<string, unknown>) {
  const name = String(b.customer_name ?? 'Guest')
  const email = String(b.email ?? '')
  const phone = String(b.phone ?? '')
  const room = String(b.room_name ?? 'General booking')
  const checkIn = String(b.check_in ?? '')
  const checkOut = String(b.check_out ?? '')
  const guests = String(b.guests ?? '')
  const message = String(b.message ?? '')

  // Owner notification — has everything needed to contact the customer
  await sendEmail(
    OWNER_EMAIL,
    `New booking request — ${name} (${room})`,
    wrap(`
      <p><strong>New booking request received.</strong></p>
      <table style="width:100%;line-height:1.8">
        <tr><td><strong>Customer</strong></td><td>${name}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${phone}</td></tr>
        <tr><td><strong>Email</strong></td><td>${email}</td></tr>
        <tr><td><strong>Room</strong></td><td>${room}</td></tr>
        <tr><td><strong>Dates</strong></td><td>${checkIn} → ${checkOut}</td></tr>
        <tr><td><strong>Guests</strong></td><td>${guests}</td></tr>
        <tr><td><strong>Message</strong></td><td>${message || '—'}</td></tr>
      </table>
      <p>Review it in the admin dashboard: ${SITE_URL}/admin/bookings</p>
    `),
  )

  // Customer confirmation
  if (email) {
    await sendEmail(
      email,
      'We received your booking request — Azure Cove',
      wrap(`
        <p>Hi ${name},</p>
        <p>Thank you for choosing Azure Cove Beach Resort! We received your
        request and our team will contact you at <strong>${phone}</strong>
        within 24 hours to confirm availability.</p>
        <table style="width:100%;line-height:1.8">
          <tr><td><strong>Room</strong></td><td>${room}</td></tr>
          <tr><td><strong>Dates</strong></td><td>${checkIn} → ${checkOut}</td></tr>
          <tr><td><strong>Guests</strong></td><td>${guests}</td></tr>
        </table>
        <p style="color:#5b6b74">No payment is needed at this stage.</p>
      `),
    )
  }
}

async function sendStatusChangeEmail(
  b: Record<string, unknown>,
  oldRecord: Record<string, unknown> | null,
) {
  const prevStatus = String(oldRecord?.status ?? '')
  const status = String(b.status ?? '')
  if (!oldRecord || prevStatus === status) return // nothing actually changed

  const name = String(b.customer_name ?? 'Guest')
  const email = String(b.email ?? '')
  const room = String(b.room_name ?? 'General booking')
  const checkIn = String(b.check_in ?? '')
  const checkOut = String(b.check_out ?? '')

  if (!email) return

  if (status === 'confirmed') {
    await sendEmail(
      email,
      `Your booking is confirmed — Azure Cove`,
      wrap(`
        <p>Hi ${name},</p>
        <p>Great news! Your booking request has been <strong
          style="color:#16a34a">confirmed</strong>. We look forward to
        welcoming you to Azure Cove Beach Resort!</p>
        <table style="width:100%;line-height:1.8">
          <tr><td><strong>Room</strong></td><td>${room}</td></tr>
          <tr><td><strong>Dates</strong></td><td>${checkIn} → ${checkOut}</td></tr>
        </table>
        <p>Check-in is from 2:00 PM and check-out is at 12:00 NN. If you have
        any questions before your stay, just reply to this email or call us.</p>
      `),
    )
  } else if (status === 'cancelled' || status === 'rejected') {
    await sendEmail(
      email,
      `Update on your booking request — Azure Cove`,
      wrap(`
        <p>Hi ${name},</p>
        <p>We're sorry — your booking request for <strong>${room}</strong>
        (${checkIn} → ${checkOut}) could not be accommodated and has been
        <strong>${status}</strong>.</p>
        <p>If you'd like, we're happy to help you find other available dates —
        just reply to this email or contact us.</p>
      `),
    )
  }
  // Other status transitions (e.g. back to pending) don't email the customer.
}

async function sendInquiryEmail(q: Record<string, unknown>) {
  await sendEmail(
    OWNER_EMAIL,
    `New inquiry — ${q.name ?? 'Website visitor'}`,
    wrap(`
      <p><strong>New inquiry received.</strong></p>
      <table style="width:100%;line-height:1.8">
        <tr><td><strong>Name</strong></td><td>${q.name ?? ''}</td></tr>
        <tr><td><strong>Email</strong></td><td>${q.email ?? ''}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${q.phone ?? '—'}</td></tr>
        <tr><td><strong>Message</strong></td><td>${q.message ?? ''}</td></tr>
      </table>
      <p>Review it in the admin dashboard: ${SITE_URL}/admin/bookings</p>
    `),
  )
}
