'use client'

import { Box, Typography, CircularProgress } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'
import QRCodeSVG from 'react-qr-code'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getOrCreateAppInstanceDid } from '@cooperation/vc-storage'
import { APP_BASE_URL, LCW_DEEP_LINK } from '../../app.config'
import { pollExchange } from '../lib/exchanges'

export default function WasLoginPage() {
  const [qrData, setQrData] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const sessionId = uuidv4()
    const exchangeUrl = `${APP_BASE_URL}/api/exchanges/${sessionId}`
    let intervalId: NodeJS.Timeout

    ;(async () => {
      try {
        // Create / load appInstanceDid for this client
        const appInstanceDid = localStorage.getItem('AppInstanceDID')
        if (!appInstanceDid) {
          setError('Failed to connect to the wallet: missing AppInstanceDID')
          setIsLoading(false)
          return
        }
        // Initialize exchange session with appInstanceDid
        const res = await fetch(exchangeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appInstanceDid })
        })

        if (!res.ok) {
          setError('Failed to connect to the wallet')
          setIsLoading(false)
          return
        }

        // Prepare LCW deep link
        const chapiRequest = {
          credentialRequestOrigin: APP_BASE_URL,
          protocols: { vcapi: exchangeUrl }
        }
        const encodedRequest = encodeURIComponent(JSON.stringify(chapiRequest))
        const lcwRequestUrl = `${LCW_DEEP_LINK}?request=${encodedRequest}`

        setQrData(lcwRequestUrl)
        setIsLoading(false)

        // Start polling until zcap arrives (with initial delay)
        setTimeout(() => {
          intervalId = setInterval(() => {
            pollExchange({
              exchangeUrl,
            onFetchVP: (vp: any) => {
              if (vp.zcap && vp.appInstanceDid) {
                console.log('🚀 ~ WasLoginPage ~ vp:', vp)
                clearInterval(intervalId)
                // TODO: navigate to dashboard if needed
                // router.push('/dashboard')
              }
            },
              stopPolling: () => clearInterval(intervalId)
            })
          }, 2000) // Reduced polling interval to 2 seconds
        }, 1000) // Initial 1 second delay before starting to poll
      } catch (err) {
        console.error(err)
        setError('Unexpected error while connecting to wallet')
        setIsLoading(false)
      }
    })()

    return () => clearInterval(intervalId)
  }, [])

  return (
    <Box sx={{ width: '100%', bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          width: '100%',
          bgcolor: '#F7F9FC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 3, md: 6 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 24, sm: 32, md: 40 },
            fontWeight: 700,
            color: '#44464D',
            textAlign: 'center',
            lineHeight: 1.2,
            fontFamily: 'Poppins'
          }}
        >
          LinkedCreds Login with LCW
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: { xs: 'center', md: 'flex-start' },
          px: { xs: 2, sm: 4, md: 8, lg: 25 },
          py: { xs: 4, md: 8 },
          gap: { xs: 6, md: 15 }
        }}
      >
        {/* Left */}
        <Box sx={{ width: { xs: '100%', md: '40%' }, maxWidth: 400 }}>
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 24 },
              fontWeight: 700,
              color: '#44464D',
              mb: 2,
              textAlign: 'center'
            }}
          >
            Connect Your Wallet
          </Typography>
          <Typography
            sx={{
              color: '#2D2D47',
              fontSize: { xs: 14, sm: 18 },
              mb: 3,
              textAlign: 'center'
            }}
          >
            Scan the QR code with Learner Credential Wallet to authorize access to WAS.
          </Typography>
          <Box
            sx={{
              bgcolor: '#E9E6F8',
              borderRadius: 2,
              mt: 2,
              p: '15px',
              width: '100%',
              maxWidth: 300
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 400, mb: 1 }}>
              Need LCW?
            </Typography>
            <Typography
              component="a"
              href="https://lcw.app"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#2563EB',
                fontWeight: 700,
                fontSize: 14,
                textDecoration: 'underline',
                '&:hover': { opacity: 0.8 }
              }}
            >
              Download Learner Credential Wallet
            </Typography>
          </Box>
        </Box>

        {/* Right */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            sx={{
              fontSize: { xs: 20, sm: 24 },
              fontWeight: 700,
              color: '#44464D',
              mb: 2,
              textAlign: 'center'
            }}
          >
            Scan the QR Code
          </Typography>

          <Box
            sx={{
              my: 3,
              display: 'flex',
              justifyContent: 'center',
              width: 256,
              height: 256,
              bgcolor: 'white',
              p: 2,
              borderRadius: 1,
              border: '1px solid #eee'
            }}
          >
            {isLoading ? (
              <CircularProgress />
            ) : error ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <ErrorIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
                <Typography color="error" textAlign="center">
                  {error}
                </Typography>
              </Box>
            ) : (
              <QRCodeSVG value={qrData} size={256} level="H" />
            )}
          </Box>

          {!isLoading && !error && (
            <Typography
              sx={{ color: '#666', fontSize: 14, textAlign: 'center', fontStyle: 'italic' }}
            >
              Waiting for wallet connection...
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}
