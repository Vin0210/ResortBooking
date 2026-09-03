// ============================================================
// Supabase Edge Function: booking-notification
// ------------------------------------------------------------
// Branded HTML emails sent on booking/inquiry events:
//   - INSERT bookings  -> owner alert + customer confirmation
//   - UPDATE bookings  -> customer email on confirmed/cancelled
//   - INSERT inquiries -> owner alert
//
// Deploy: supabase functions deploy booking-notification --no-verify-jwt
// Secrets: RESEND_API_KEY, OWNER_EMAIL, EMAIL_FROM (opt), SITE_URL (opt)
// Trigger: Database Webhooks on `bookings` (Insert+Update), `inquiries`
// (Insert) pointing at this function's URL.
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
const BUSINESS_NAME = 'Azure Cove Beach Resort'

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
      }
    } else if (table === 'inquiries') {
      if (type === 'INSERT') {
        await sendInquiryEmail(record)
      }
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

/* --------------- Gmail-safe email building blocks --------------- */

function shell(title: string, inner: string, preheader = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#eef3f5;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eef3f5;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#0e7490;background-image:linear-gradient(135deg,#0e7490 0%,#0b3d54 100%);padding:28px 32px;text-align:center;">
              <div style="font-size:26px;line-height:1;">&#127958;&#65039;</div>
              <div style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:1px;margin-top:8px;">${BUSINESS_NAME}</div>
              <div style="color:#ffc4a3;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">${title}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${inner}
            </td>
          </tr>
          <tr>
            <td style="background-color:#132e3b;padding:20px 32px;text-align:center;">
              <div style="color:#ffffff;font-size:13px;font-weight:bold;margin-bottom:6px;">${BUSINESS_NAME}</div>
              <div style="color:rgba(255,255,255,0.75);font-size:12px;line-height:1.8;">
                123 Shoreline Road, Brgy. San Isidro, Batangas, Philippines<br/>
                +63 917 123 4567 &nbsp;&middot;&nbsp; hello@azurecove.ph<br/>
                Check-in 2:00 PM &nbsp;&middot;&nbsp; Check-out 12:00 NN
              </div>
              <div style="color:rgba(255,255,255,0.45);font-size:11px;margin-top:12px;">
                Sent automatically from ${SITE_URL}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function detailTable(rows: [string, string][]) {
  const cells = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 14px;color:#5b6b74;font-size:13px;width:110px;vertical-align:top;">${label}</td>
          <td style="padding:10px 14px;color:#132e3b;font-size:14px;font-weight:bold;vertical-align:top;">${value}</td>
        </tr>`
    )
    .join('')
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6fafb;border:1px solid #dce8ec;border-radius:12px;">
      ${cells}
    </table>`
}

function buttonLink(url: string, label: string, color = '#0e7490') {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px auto 0;">
      <tr>
        <td style="background-color:${color};border-radius:999px;">
          <a href="${url}" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;">${label}</a>
        </td>
      </tr>
    </table>`
}

function statusBadge(status: string) {
  const styles: Record<string, [string, string]> = {
    confirmed: ['#e6f7ec', '#16a34a'],
    cancelled: ['#fdecea', '#dc2626'],
    rejected: ['#fdecea', '#dc2626'],
    pending: ['#fff4e5', '#d97706'],
  }
  const [bg, fg] = styles[status] ?? ['#eef3f5', '#5b6b74']
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;">
      <tr>
        <td style="background-color:${bg};border-radius:999px;padding:6px 18px;">
          <span style="color:${fg};font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">${status}</span>
        </td>
      </tr>
    </table>`
}

/* --------------------------- Email bodies --------------------------- */

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
    `📋 New booking request — ${name} (${room})`,
    shell(
      'New Booking Request',
      `
      <p style="margin:0 0 18px;color:#132e3b;font-size:15px;">
        A new booking request just came in. Contact the guest within 24 hours
        to confirm availability.
      </p>
      ${detailTable([
        ['Guest', name],
        ['Phone', phone],
        ['Email', email],
        ['Room', room],
        ['Dates', `${checkIn} &rarr; ${checkOut}`],
        ['Guests', guests],
        ['Message', message || '—'],
      ])}
      ${buttonLink(`${SITE_URL}/admin/bookings`, 'Open Admin Dashboard')}
      `
    ),
  )

  // Customer confirmation
  if (email) {
    await sendEmail(
      email,
      `🏖️ We received your booking request — ${BUSINESS_NAME}`,
      shell(
        'Booking Request Received',
        `
        <p style="margin:0 0 6px;color:#132e3b;font-size:15px;">Hi <strong>${name}</strong>,</p>
        <p style="margin:0 0 18px;color:#5b6b74;font-size:14px;line-height:1.6;">
          Thank you for choosing ${BUSINESS_NAME}! We received your request and
          our team will contact you at <strong style="color:#132e3b;">${phone}</strong>
          within 24 hours to confirm availability.
        </p>
        ${detailTable([
          ['Room', room],
          ['Check-in', checkIn],
          ['Check-out', checkOut],
          ['Guests', guests],
        ])}
        <p style="margin:18px 0 0;color:#5b6b74;font-size:13px;text-align:center;">
          No payment is needed at this stage.
        </p>
        `,
        `We received your booking for ${room}, ${checkIn} to ${checkOut}. We'll contact you within 24 hours.`,
      ),
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
      `✅ Your booking is confirmed — ${BUSINESS_NAME}`,
      shell(
        'Your Stay is Confirmed',
        `
        ${statusBadge('confirmed')}
        <p style="margin:0 0 6px;color:#132e3b;font-size:15px;">Hi <strong>${name}</strong>,</p>
        <p style="margin:0 0 18px;color:#5b6b74;font-size:14px;line-height:1.6;">
          Great news! Your booking request has been
          <strong style="color:#16a34a;">confirmed</strong>. We look forward to
          welcoming you to ${BUSINESS_NAME}!
        </p>
        ${detailTable([
          ['Room', room],
          ['Check-in', checkIn],
          ['Check-out', checkOut],
        ])}
        <p style="margin:18px 0 0;color:#5b6b74;font-size:13px;line-height:1.6;text-align:center;">
          Check-in is from 2:00 PM and check-out is at 12:00 NN.<br/>
          Questions before your stay? Just reply to this email or call us.
        </p>
        `,
        `Good news — your stay at ${BUSINESS_NAME} on ${checkIn} is confirmed!`,
      ),
    )
  } else if (status === 'cancelled' || status === 'rejected') {
    await sendEmail(
      email,
      `Update on your booking request — ${BUSINESS_NAME}`,
      shell(
        'Booking Update',
        `
        ${statusBadge(status)}
        <p style="margin:0 0 6px;color:#132e3b;font-size:15px;">Hi <strong>${name}</strong>,</p>
        <p style="margin:0 0 18px;color:#5b6b74;font-size:14px;line-height:1.6;">
          We're sorry — your booking request for <strong style="color:#132e3b;">${room}</strong>
          (${checkIn} &rarr; ${checkOut}) could not be accommodated and has been
          <strong style="color:#dc2626;">${status}</strong>.
        </p>
        <p style="margin:0;color:#5b6b74;font-size:14px;line-height:1.6;">
          We'd be happy to help you find other available dates — just reply to
          this email or contact us.
        </p>
        `,
        `Update on your booking request for ${room}.`,
      ),
    )
  }
  // Other status transitions (e.g. back to pending) don't email the customer.
}

async function sendInquiryEmail(q: Record<string, unknown>) {
  await sendEmail(
    OWNER_EMAIL,
    `💬 New inquiry — ${q.name ?? 'Website visitor'}`,
    shell(
      'New Inquiry',
      `
      <p style="margin:0 0 18px;color:#132e3b;font-size:15px;">
        A visitor sent a message through your website. Reply to them soon —
        quick responses win bookings.
      </p>
      ${detailTable([
        ['Name', String(q.name ?? '')],
        ['Email', String(q.email ?? '')],
        ['Phone', String(q.phone ?? '—')],
        ['Message', String(q.message ?? '')],
      ])}
      ${buttonLink(`${SITE_URL}/admin/bookings`, 'Open Admin Dashboard')}
      `
    ),
  )
}

