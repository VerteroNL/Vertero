import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#07070f] flex items-center justify-center">
      <SignUp />
    </main>
  )
}
