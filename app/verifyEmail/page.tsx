'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import useGoogleDrive from '../hooks/useGoogleDrive'
import { CredentialEngine } from '@cooperation/vc-storage'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material'

type VerificationState = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error'

export default function EmailVerification() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [state, setState] = useState<VerificationState>('idle')
  const [error, setError] = useState('')
  const { data: session } = useSession()
  const { storage } = useGoogleDrive()

  const sendVerificationCode = async () => {
    try {
      setState('sending')
      setError('')

      const response = await fetch('/api/verification/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to send verification code')
      }

      setState('sent')
    } catch (err) {
      console.error('Error sending code:', err)
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
        throw new Error(data.error ?? 'Invalid verification code')
      }

      if (!storage) {
        throw new Error('Storage not initialized')
      }

      if (!session?.user?.id) {
        throw new Error('User session or ID not found. Unable to issue email VC.')
      }

      // Initialize credential engine with storage
      const engine = new CredentialEngine(storage)

      // Generate and sign email VC
      const result = await engine.generateAndSignEmailVC(email, session.user.id)
      console.log('Generated email VC:', result)

      setState('verified')
    } catch (err) {
      console.error('Verification error:', err)
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
    <Container maxWidth='sm' sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography
          variant='h5'
          component='h2'
          gutterBottom
          sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}
        >
          Email Verification
        </Typography>

        {state === 'idle' && (
          <Box component='form' noValidate autoComplete='off'>
            <TextField
              label='Email Address'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              margin='normal'
              placeholder='your@email.com'
              id='emailInput'
            />
            <Button
              onClick={sendVerificationCode}
              disabled={!email}
              variant='contained'
              color='primary'
              fullWidth
              sx={{ mt: 2 }}
            >
              Send Verification Code
            </Button>
          </Box>
        )}

        {state === 'sending' && (
          <Box sx={{ textAlign: 'center', my: 3 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Sending verification code...</Typography>
          </Box>
        )}

        {state === 'sent' && (
          <Box>
            <Typography gutterBottom>
              A verification code has been sent to{' '}
              <Typography component='span' sx={{ fontWeight: 'bold' }}>
                {email}
              </Typography>
            </Typography>
            <TextField
              label='Verification Code'
              type='text'
              value={code}
              onChange={e => setCode(e.target.value)}
              fullWidth
              margin='normal'
              placeholder='Enter code'
              id='codeInput'
              inputProps={{ style: { textAlign: 'center', letterSpacing: '0.2em' } }}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                onClick={verifyCode}
                disabled={!code}
                variant='contained'
                color='success'
                sx={{ flexGrow: 1 }}
              >
                Verify
              </Button>
              <Button onClick={reset} variant='outlined' color='secondary'>
                Cancel
              </Button>
            </Box>
          </Box>
        )}

        {state === 'verifying' && (
          <Box sx={{ textAlign: 'center', my: 3 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Verifying code...</Typography>
          </Box>
        )}

        {state === 'verified' && (
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity='success' sx={{ mb: 2 }}>
              Your email has been successfully verified!
            </Alert>
            <Button onClick={reset} variant='contained' color='primary' fullWidth>
              Verify Another Email
            </Button>
          </Box>
        )}

        {state === 'error' && (
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity='error' sx={{ mb: 2, textAlign: 'left' }}>
              {error}
            </Alert>
            <Button onClick={reset} variant='contained' color='primary' fullWidth>
              Try Again
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  )
}
