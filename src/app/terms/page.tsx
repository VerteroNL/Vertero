import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Algemene voorwaarden — Vertero',
  description: 'De algemene voorwaarden van Vertero.',
}

export default function TermsPage() {
  redirect('/')
}
