// Eenmalig script — verwijder na gebruik
// Gebruik: node sync-users.mjs

import { readFileSync } from 'fs'

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
}

const CLERK_SECRET = process.env.CLERK_SECRET_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY

async function fetchAllUsers() {
  const users = []
  let offset = 0
  const limit = 100

  while (true) {
    const res = await fetch(`https://api.clerk.com/v1/users?limit=${limit}&offset=${offset}`, {
      headers: { Authorization: `Bearer ${CLERK_SECRET}` },
    })
    const batch = await res.json()
    if (!Array.isArray(batch) || batch.length === 0) break
    users.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }

  return users
}

async function upsertToSupabase(users) {
  const rows = users.map(u => ({
    clerk_id: u.id,
    email: u.email_addresses?.[0]?.email_address ?? null,
    first_name: u.first_name ?? null,
    last_name: u.last_name ?? null,
  })).filter(r => r.email)

  const res = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(rows),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Supabase fout: ${err}`)
  }

  return rows.length
}

const users = await fetchAllUsers()
console.log(`${users.length} users opgehaald uit Clerk`)

const count = await upsertToSupabase(users)
console.log(`${count} users gesynchroniseerd naar Supabase`)
