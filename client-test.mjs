import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'node:fs'

const url = 'https://kcwhoxtolfqyaaypagwf.supabase.co'
const key = 'sb_publishable_LONJ36WwuqzBxUIZMsZrLg_uiWKfKpN'
const sb = createClient(url, key)

const payload = {
  customer_name: 'ClientLib Test',
  email: 'clientlibtest@example.com',
  phone: '+63 900 555 4444',
  room_id: '1',
  check_in: '2026-10-10',
  check_out: '2026-10-12',
  guests: '2',
  message: 'Testing the exact supabase-js client path.',
}

try {
  const { data, error } = await sb
    .from('bookings')
    .insert([{ ...payload, status: 'pending' }])
    .select()
    .single()
  writeFileSync(
    'client-test-result.txt',
    error
      ? `ERROR_CODE: ${error.code}\nERROR_MESSAGE: ${error.message}`
      : `OK inserted id: ${data?.id}`
  )
} catch (err) {
  writeFileSync('client-test-result.txt', `THROWN: ${err.message}`)
}