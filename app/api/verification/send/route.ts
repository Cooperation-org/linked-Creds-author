// app/api/verification/send/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '../../../utils/email-verification/rate-limit'
import { Resend } from 'resend'
import { storeVerificationCode } from '../../../utils/email-verification/verification-store'

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000
})

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    try {
      await limiter.check(10, ip) // Increased to 10 requests per minute
    } catch (error) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const { email, purpose, metadata } = await request.json()

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store code in file-based cache
    storeVerificationCode(email, code)

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your Email Verification Code',
      html: `
        <h1>Email Verification</h1>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in verification send:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function GET() {
  return NextResponse.json({
    status: 'API is running',
    endpoint: 'Email verification endpoint',
    method: 'POST requires: { email, purpose (optional), metadata (optional) }'
  })
}
