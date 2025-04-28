'use client'

import { useState } from 'react'

type VerificationState = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error'

export default function EmailVerification() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [state, setState] = useState<VerificationState>('idle')
  const [error, setError] = useState('')

  const sendVerificationCode = async () => {
    try {
      setState('sending')
      setError('')

      const response = await fetch('/api/verification/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          purpose: 'skill verification'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code')
      }

      setState('sent')
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const verifyCode = async () => {
    try {
      setState('verifying')
      setError('')

      const response = await fetch('/api/verification/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code')
      }

      setState('verified')
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const reset = () => {
    setEmail('')
    setCode('')
    setState('idle')
    setError('')
  }

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded shadow-md'>
      <h2 className='text-xl font-bold mb-4'>Email Verification</h2>

      {state === 'idle' && (
        <>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>Email Address</label>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='w-full px-3 py-2 border rounded'
              placeholder='your@email.com'
            />
          </div>
          <button
            onClick={sendVerificationCode}
            disabled={!email}
            className='w-full bg-blue-500 text-white py-2 px-4 rounded'
          >
            Send Verification Code
          </button>
        </>
      )}

      {state === 'sending' && <p>Sending verification code...</p>}

      {state === 'sent' && (
        <>
          <p className='mb-4'>A verification code has been sent to {email}</p>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>Verification Code</label>
            <input
              type='text'
              value={code}
              onChange={e => setCode(e.target.value)}
              className='w-full px-3 py-2 border rounded text-center tracking-wider'
              placeholder='Enter code'
            />
          </div>
          <div className='flex space-x-2'>
            <button
              onClick={verifyCode}
              disabled={!code}
              className='flex-1 bg-green-500 text-white py-2 px-4 rounded'
            >
              Verify
            </button>
            <button onClick={reset} className='px-4 py-2 border rounded'>
              Cancel
            </button>
          </div>
        </>
      )}

      {state === 'verifying' && <p>Verifying code...</p>}

      {state === 'verified' && (
        <>
          <div className='p-4 bg-green-100 text-green-800 rounded mb-4'>
            Your email has been successfully verified!
          </div>
          <button
            onClick={reset}
            className='w-full bg-blue-500 text-white py-2 px-4 rounded'
          >
            Verify Another Email
          </button>
        </>
      )}

      {state === 'error' && (
        <>
          <div className='p-4 bg-red-100 text-red-800 rounded mb-4'>{error}</div>
          <button
            onClick={reset}
            className='w-full bg-blue-500 text-white py-2 px-4 rounded'
          >
            Try Again
          </button>
        </>
      )}
    </div>
  )
}
