export { verificationCache }
import { LRUCache } from 'lru-cache'
import nodemailer from 'nodemailer'

type VerificationEntry = {
  code: string
  createdAt: number
  attempts: number
  metadata?: Record<string, any>
}

const verificationCache = new LRUCache<string, VerificationEntry>({
  max: 1000,
  ttl: 1000 * 60 * 30, // Extended to 30 minutes
  allowStale: false,
  updateAgeOnGet: false
})

export function generateVerificationCode(): string {
  // Generate a purely numeric 6-digit code (000000-999999)
  return String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
}

export function storeVerificationCode(
  email: string,
  metadata?: Record<string, any>
): string {
  const code = generateVerificationCode()
  const normalizedEmail = email.toLowerCase().trim()

  // Log storage
  console.log(`Storing verification code for email: ${normalizedEmail}`)

  verificationCache.set(normalizedEmail, {
    code,
    createdAt: Date.now(),
    attempts: 0,
    metadata
  })

  return code
}

export function verifyCode(
  email: string,
  code: string
): {
  isValid: boolean
  metadata?: Record<string, any>
  error?: string
} {
  const normalizedEmail = email.toLowerCase().trim()

  // Add debug logging
  console.log(`Verifying code for email: ${normalizedEmail}`)
  console.log(`Cached entries: ${Array.from(verificationCache.keys()).join(', ')}`)

  const entry = verificationCache.get(normalizedEmail)

  if (!entry) {
    console.log(`No entry found for email: ${normalizedEmail}`)
    return { isValid: false, error: 'No verification code found or code expired' }
  }

  console.log(
    `Found entry for ${normalizedEmail}: attempts=${entry.attempts}, code=${entry.code.substring(0, 2)}***`
  )

  entry.attempts += 1

  if (entry.attempts > 3) {
    verificationCache.delete(normalizedEmail)
    return { isValid: false, error: 'Too many verification attempts' }
  }

  verificationCache.set(normalizedEmail, entry)

  // Log code comparison
  console.log(
    `Code comparison: expected=${entry.code}, received=${code}, match=${entry.code === code}`
  )

  // Both codes should be treated as strings, but make sure to compare them as strings
  if (String(entry.code) !== String(code)) {
    return { isValid: false, error: 'Invalid verification code' }
  }

  verificationCache.delete(email.toLowerCase())

  console.log(`Verification successful for ${normalizedEmail}`)

  return {
    isValid: true,
    metadata: entry.metadata
  }
}

export async function sendVerificationEmail(
  email: string,
  purpose: string = 'account verification',
  metadata?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const code = storeVerificationCode(email, metadata)
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Your Application'

    // Create a transporter using Gmail with more explicit settings
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NEXT_PUBLIC_GMAIL_USER,
        pass: process.env.NEXT_PUBLIC_GMAIL_APP_PASSWORD
      },
      debug: true // Show debug output
    })

    // Send the email
    await transporter.sendMail({
      from: `"${appName}" <${process.env.NEXT_PUBLIC_GMAIL_USER}>`,
      to: email,
      subject: `Your verification code: ${code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verification Code</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 30px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .code-container {
              margin: 30px 0;
              text-align: center;
              background-color: #f8fafc;
              padding: 20px;
              border-radius: 6px;
              border: 1px solid #e2e8f0;
            }
            .code {
              font-family: monospace;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 4px;
              color: #1a202c;
            }
            .instructions {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              font-size: 14px;
              color: #718096;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verification Code</h1>
            </div>
            
            <p>Hello,</p>
            
            <p>You requested a verification code for ${purpose}. Use the code below to complete the verification process:</p>
            
            <div class="code-container">
              <div class="code">${code}</div>
            </div>
            
            <p>This code will expire in 15 minutes for security reasons.</p>
            
            <p>If you didn't request this code, you can safely ignore this email.</p>
            
            <div class="instructions">
              <p>— The ${appName} team</p>
            </div>
          </div>
        </body>
        </html>
      `
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send verification email:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error sending verification email'
    }
  }
}
