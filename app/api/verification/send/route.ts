// app/api/verification/send/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '../../../utils/email-verfification/rate-limit'
import { sendVerificationEmail } from '../../../utils/email-verfification/verification-cache'

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500
})

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    try {
      await limiter.check(3, ip)
    } catch (error) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
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

    const result = await sendVerificationEmail(
      email,
      purpose || 'email verification',
      metadata
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Verification code sent successfully'
      })
    } else {
      console.error('Error sending verification email:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send verification code. Please try again later.'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Verification request error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
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
