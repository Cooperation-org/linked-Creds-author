// app/api/verification/debug/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verificationCache } from '../../../utils/email-verfification/verification-cache'

export async function GET(request: NextRequest) {
  try {
    // Only available in development environment
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Only available in development mode' },
        { status: 403 }
      )
    }

    // Get cache info
    const cacheInfo = {
      size: verificationCache.size,
      maxSize: verificationCache.max,
      keys: Array.from(verificationCache.keys()),
      // Get safe version of values (without exposing full codes)
      values: Array.from(verificationCache.keys()).map(key => {
        const value = verificationCache.get(key)
        return {
          email: key,
          attempts: value?.attempts,
          createdAt: value?.createdAt,
          age: value ? Math.floor((Date.now() - value.createdAt) / 1000) + 's' : null,
          // Only show first 2 digits of code for security
          codeHint: value?.code ? `${value.code.substring(0, 2)}****` : null
        }
      })
    }

    return NextResponse.json(cacheInfo)
  } catch (error) {
    console.error('Debug cache error:', error)
    return NextResponse.json(
      {
        error: 'Failed to debug cache',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
