import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getUserPlan } from '@/lib/subscription'
import { getOwnerUserId } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: Request) {
  try {
    const { slug, name, email, phone, street, postcode, city, answers } = await req.json()

    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (quizError || !quiz) {
      return NextResponse.json({ error: 'Quiz niet gevonden' }, { status: 404 })
    }

    const address = [street, postcode, city].filter(Boolean).join(', ')

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

    if (quiz.user_id) {
      const [ownerPlan, { data: settings }] = await Promise.all([
        getUserPlan(quiz.user_id),
        supabase.from('user_settings').select('email_on_new_lead').eq('user_id', quiz.user_id).maybeSingle(),
      ])

      const emailEnabled = ownerPlan === 'pro' && settings?.email_on_new_lead !== false
      const ownerEmail = process.env.OWNER_EMAIL

      if (emailEnabled && ownerEmail) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          })
          const answersHtml = [
            `<tr><td style="padding:10px 16px;color:#888;font-size:13px;border-bottom:1px solid #1e1e2e;">Naam</td><td style="padding:10px 16px;font-size:13px;color:#e0e0e0;border-bottom:1px solid #1e1e2e;">${name}</td></tr>`,
            `<tr><td style="padding:10px 16px;color:#888;font-size:13px;border-bottom:1px solid #1e1e2e;">E-mail</td><td style="padding:10px 16px;font-size:13px;color:#e0e0e0;border-bottom:1px solid #1e1e2e;">${email}</td></tr>`,
            phone ? `<tr><td style="padding:10px 16px;color:#888;font-size:13px;border-bottom:1px solid #1e1e2e;">Telefoon</td><td style="padding:10px 16px;font-size:13px;color:#e0e0e0;border-bottom:1px solid #1e1e2e;">${phone}</td></tr>` : '',
            address ? `<tr><td style="padding:10px 16px;color:#888;font-size:13px;border-bottom:1px solid #1e1e2e;">Adres</td><td style="padding:10px 16px;font-size:13px;color:#e0e0e0;border-bottom:1px solid #1e1e2e;">${address}</td></tr>` : '',
            ...Object.entries(answers as Record<string, string>).map(([qId, a]) => {
              const questionText = (quiz.config?.questions as { id: string; question: string }[] | undefined)
                ?.find(q => q.id === qId)?.question ?? qId
              return `<tr><td style="padding:10px 16px;color:#888;font-size:13px;border-bottom:1px solid #1e1e2e;">${questionText}</td><td style="padding:10px 16px;font-size:13px;color:#e0e0e0;border-bottom:1px solid #1e1e2e;">${a}</td></tr>`
            }),
          ].filter(Boolean).join('')
          await transporter.sendMail({
            from: 'Vertero <noreply@vertero.nl>',
            to: ownerEmail,
            subject: `Nieuwe lead: ${name}`,
            html: `<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8"/></head><body style="margin:0;padding:0;background-color:#07070f;font-family:'Segoe UI',Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#07070f;padding:40px 0;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background-color:#0f0f1a;border-radius:12px;overflow:hidden;border:1px solid #1e1e2e;"><tr><td style="background-color:#0d0d1f;padding:28px 40px;text-align:center;border-bottom:1px solid #1e1e2e;"><img src="https://vertero.nl/logo.png" alt="Vertero" width="140" style="display:block;margin:0 auto;border:0;"/></td></tr><tr><td style="padding:40px;color:#e0e0e0;font-size:15px;line-height:1.8;"><p style="margin:0 0 20px;font-size:16px;color:#ffffff;">Je hebt een nieuwe lead ontvangen via quiz <strong style="color:#f86c06;">${quiz.name ?? slug}</strong>:</p><table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a14;border-radius:8px;overflow:hidden;border:1px solid #1e1e2e;margin-bottom:32px;">${answersHtml}</table><table cellpadding="0" cellspacing="0" style="margin:0 0 36px;"><tr><td style="background:#f86c06;border-radius:8px;"><a href="https://vertero.nl/dashboard/leads" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;">Bekijk in dashboard &rarr;</a></td></tr></table></td></tr></table></td></tr></table></body></html>`,
          })
        } catch {
          // e-mail fout mag lead niet blokkeren
        }
      }
    }

    return NextResponse.json({ success: true, lead }, { headers: { 'Access-Control-Allow-Origin': '*' } })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } })
  }
}

export async function PATCH(req: Request) {
  const userId = await getOwnerUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { ids, status } = await req.json()
  if (!Array.isArray(ids) || ids.length === 0)
    return NextResponse.json({ error: 'No ids' }, { status: 400 })

  const { error } = await supabase.from('leads').update({ status }).in('id', ids).eq('user_id', userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const userId = await getOwnerUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { ids } = await req.json()
  if (!Array.isArray(ids) || ids.length === 0)
    return NextResponse.json({ error: 'No ids' }, { status: 400 })

  const { error } = await supabase.from('leads').delete().in('id', ids).eq('user_id', userId)
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
