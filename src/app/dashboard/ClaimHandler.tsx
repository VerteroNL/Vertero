'use client'

import { useEffect } from 'react'

export default function ClaimHandler() {
  useEffect(() => {
    const token = localStorage.getItem('vertero_claim_token')
    if (!token) return

    fetch('/api/quiz-claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).then(() => {
      localStorage.removeItem('vertero_claim_token')
    })
  }, [])

  return null
}
