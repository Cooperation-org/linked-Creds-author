import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '../../../utils/email-verfification/rate-limit'
import { verifyCode } from '../../../utils/email-verfification/verification-cache'

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500
})

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    try {
      await limiter.check(5, ip)
    } catch (error) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const { email, code } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      )
    }

    const verification = verifyCode(email, code)

    if (verification.isValid) {
      return NextResponse.json({
        success: true,
        message: 'Email successfully verified',
        metadata: verification.metadata
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: verification.error || 'Invalid verification code'
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Verification confirmation error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'API is running',
    endpoint: 'Verification confirmation endpoint',
    method: 'POST requires: { email, code }'
  })
}
