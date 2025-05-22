import { NextRequest, NextResponse } from 'next/server'
import { getVerificationCode, deleteVerificationCode } from '../../../utils/email-verification/verification-store'
import { rateLimit } from '../../../utils/email-verification/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
})

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      )
    }

    // Rate limiting with email-specific token
    try {
      await limiter.check(5, `VERIFY_${email}`)
    } catch {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Get stored code
    const storedCode = getVerificationCode(email)
    
    if (!storedCode) {
      return NextResponse.json(
        { error: 'No verification code found or code has expired' },
        { status: 400 }
      )
    }

    // Verify code
    if (storedCode !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Delete used code
    deleteVerificationCode(email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in verification confirm:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'API is running',
    endpoint: 'Verification confirmation endpoint',
    method: 'POST requires: { email, code }'
  })
}
