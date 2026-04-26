import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getUserPlan } from '@/lib/subscription'
import { clerkClient } from '@clerk/nextjs/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: Request) {
  try {
    const { slug, name, email, phone, street, postcode, city, answers } = await req.json()

    // Zoek de quiz op basis van slug
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (quizError || !quiz) {
      return NextResponse.json({ error: 'Quiz niet gevonden' }, { status: 404 })
    }

    // Free plan: max 5 leads per maand
    if (quiz.user_id) {
      const plan = await getUserPlan(quiz.user_id)
      if (plan === 'free') {
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)
        const { count } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', quiz.user_id)
          .gte('created_at', startOfMonth.toISOString())
        if ((count ?? 0) >= 5) {
          return NextResponse.json({ error: 'LIMIT_REACHED' }, { status: 403, headers: { 'Access-Control-Allow-Origin': '*' } })
        }
      }
    }

    const address = [street, postcode, city].filter(Boolean).join(', ')

    // Sla de lead op
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        quiz_id: quiz.id,
        user_id: quiz.user_id,
        name,
        email,
        phone,
        answers: { ...answers, ...(address ? { adres: address } : {}) },
        status: 'new'
      })
      .select()
      .maybeSingle()

    if (leadError) {
      return NextResponse.json({ error: leadError.message }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } })
    }

    // Stuur e-mail naar de quiz-eigenaar als die dat wil (pro only)
    if (quiz.user_id) {
      const [ownerPlan, { data: settings }] = await Promise.all([
        getUserPlan(quiz.user_id),
        supabase.from('user_settings').select('email_on_new_lead').eq('user_id', quiz.user_id).maybeSingle(),
      ])

      const emailEnabled = ownerPlan === 'pro' && settings?.email_on_new_lead !== false

      if (emailEnabled) {
        try {
          const clerk = await clerkClient()
          const owner = await clerk.users.getUser(quiz.user_id)
          const ownerEmail = owner.emailAddresses[0]?.emailAddress
          if (ownerEmail) {
            const resend = new Resend(process.env.RESEND_API_KEY)
            const answersHtml = Object.entries(answers as Record<string, string>)
              .map(([q, a]) => `<tr><td style="padding:6px 12px;color:#999;font-size:13px">${q}</td><td style="padding:6px 12px;font-size:13px">${a}</td></tr>`)
              .join('')
            await resend.emails.send({
              from: 'Vertero <noreply@vertero.nl>',
              to: ownerEmail,
              subject: `Nieuwe lead: ${name}`,
              html: `
                <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#07070f;color:#fff;padding:32px;border-radius:16px">
                  <h2 style="margin:0 0 4px;font-size:20px">Nieuwe lead ontvangen</h2>
                  <p style="margin:0 0 24px;color:#999;font-size:14px">Via quiz: <strong style="color:#f97316">${quiz.name ?? slug}</strong></p>
                  <table style="width:100%;border-collapse:collapse;background:#0d0d1c;border-radius:12px;overflow:hidden">
                    <tr><td style="padding:6px 12px;color:#999;font-size:13px">Naam</td><td style="padding:6px 12px;font-size:13px">${name}</td></tr>
                    <tr><td style="padding:6px 12px;color:#999;font-size:13px">E-mail</td><td style="padding:6px 12px;font-size:13px">${email}</td></tr>
                    ${phone ? `<tr><td style="padding:6px 12px;color:#999;font-size:13px">Telefoon</td><td style="padding:6px 12px;font-size:13px">${phone}</td></tr>` : ''}
                    ${address ? `<tr><td style="padding:6px 12px;color:#999;font-size:13px">Adres</td><td style="padding:6px 12px;font-size:13px">${address}</td></tr>` : ''}
                    ${answersHtml}
                  </table>
                  <p style="margin:24px 0 0;font-size:12px;color:#555">Vertero · <a href="https://vertero.nl/dashboard" style="color:#f97316">Bekijk in dashboard</a></p>
                </div>
              `
            })
          }
        } catch {
          // e-mail fout mag lead niet blokkeren
        }
      }
    }

    return NextResponse.json({ success: true, lead }, { headers: { 'Access-Control-Allow-Origin': '*' } })
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } })
  }
}

export async function PATCH(req: Request) {
  const { ids, status } = await req.json()
  if (!Array.isArray(ids) || ids.length === 0)
    return NextResponse.json({ error: 'No ids' }, { status: 400 })

  const { error } = await supabase.from('leads').update({ status }).in('id', ids)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const { ids } = await req.json()
  if (!Array.isArray(ids) || ids.length === 0)
    return NextResponse.json({ error: 'No ids' }, { status: 400 })

  const { error } = await supabase.from('leads').delete().in('id', ids)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}