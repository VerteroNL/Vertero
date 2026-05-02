import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Privacybeleid — Vertero',
  description: 'Hoe Vertero omgaat met jouw persoonsgegevens.',
}

export default function PrivacyPage() {
  redirect('/')
}
