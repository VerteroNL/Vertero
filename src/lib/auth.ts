import { cookies } from 'next/headers'

export async function getOwnerUserId(): Promise<string | null> {
  const jar = await cookies()
  if (jar.get('vertero_auth')?.value !== 'true') return null
  return process.env.OWNER_USER_ID ?? null
}
