/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState } from 'react'
import {
  Typography,
  Box,
  Button,
  Snackbar,
  useMediaQuery,
  useTheme,
  Stack,
  CircularProgress,
  Tooltip,
  Alert
} from '@mui/material'
import {
  GlobalSVG,
  HeartSVG,
  BlueBadge,
  NewCopy,
  NewLinkedin,
  SVGEmail
} from '../../../Assets/SVGs'
import LoadingOverlay from '../../../components/Loading/LoadingOverlay'
import { FormData } from '../../../credentialForm/form/types/Types'
import { copyFormValuesToClipboard } from '../../../utils/formUtils'
import { useStepContext } from '../StepContext'
import { useRouter } from 'next/navigation'

interface SuccessPageProps {
  setActiveStep: (step: number) => void //NOSONAR
  formData: FormData | null
  reset: () => void
  link: string
  setLink: (link: string) => void
  setFileId: (fileId: string) => void
  storageOption: string
  fileId: string
  selectedImage: string
  res: any
}

interface SnackbarState {
  open: boolean
  message: string
  severity: 'success' | 'error'
}

const SuccessPage: React.FC<SuccessPageProps> = ({
  formData,
  reset,
  setLink,
  setFileId,
  fileId,
  res
}) => {
  const router = useRouter()
  const { setActiveStep } = useStepContext()
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  })
  const [tooltipMessage, setTooltipMessage] = useState('Signing your skill...')
  // refLink commented out. To use link and fileId Directly: Ensures the component uses the latest values from props.
  // const refLink = fileId
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    if (!fileId) {
      setTooltipMessage('Signing your skill...')
      const timer1 = setTimeout(() => setTooltipMessage('Saving your skill...'), 3000)
      const timer2 = setTimeout(() => setTooltipMessage('Fetching link...'), 6000)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    } else {
      setTooltipMessage('Click to view')
    }
  }, [fileId])

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const generateLinkedInUrl = () => {
    const baseLinkedInUrl = 'https://www.linkedin.com/profile/add'
    const params = new URLSearchParams({
      startTask: 'CERTIFICATION_NAME',
      name: formData?.credentialName ?? 'Certification Name',
      organizationName: 'LinkedTrust',
      issueYear: '2024',
      issueMonth: '8',
      expirationYear: '2025',
      expirationMonth: '8',
      certUrl: `https://linkedcreds.allskillscount.org/view/${fileId}`
    })
    return `${baseLinkedInUrl}?${params.toString()}`
  }

  const handleShareOption = (
    option: 'LinkedIn' | 'Email' | 'CopyURL' | 'View' | 'LinkedTrust'
  ) => {
    const credentialLink = `https://linkedcreds.allskillscount.org/view/${fileId}`
    // const credentialData = res

    if (option === 'LinkedIn') {
      const linkedInUrl = generateLinkedInUrl()
      window.open(linkedInUrl, '_blank', 'noopener noreferrer')
      return
    }

    if (option === 'CopyURL') {
      copyFormValuesToClipboard(credentialLink)
      showNotification('Link copied to clipboard!', 'success')
      return
    }

    if (option === 'View') {
      window.location.href = credentialLink
      return
    }

    if (option === 'Email') {
      // Navigate to the mail route instead of creating mailto: link
      const mailPageUrl = `${window.location.origin}/mail/${fileId}`
      window.location.href = mailPageUrl
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        maxWidth: isMobile ? '100%' : '720px',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        mx: 'auto'
      }}
    >
      {!isMobile && (
        <Button
          onClick={() => setActiveStep(0)}
          sx={{
            alignSelf: 'flex-start',
            color: '#003FE0',
            textTransform: 'none',
            mb: 2
          }}
        >
          &lt; Back
        </Button>
      )}

      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          maxWidth: '660px'
        }}
      >
        <Box
          sx={{
            aspectRatio: '1',
            objectFit: 'contain',
            objectPosition: 'center',
            width: isMobile ? '80px' : '100px',
            maxWidth: '98%'
          }}
        >
          <GlobalSVG />
        </Box>
        <Typography
          sx={{
            marginTop: '32px',
            color: '#202E5B',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: isMobile ? '24px' : '32px',
            fontFamily: 'Lato, sans-serif'
          }}
        >
          Success!
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          marginTop: '32px',
          width: '100%',
          flexDirection: 'column',
          color: '#003FE0',
          letterSpacing: '0.12px',
          justifyContent: 'center',
          padding: '5px',
          fontWeight: 700,
          fontSize: '24px',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <Tooltip placement='top' title={tooltipMessage}>
          <span style={{ width: '100%' }}>
            <Button
              onClick={() => handleShareOption('View')}
              disabled={!fileId}
              sx={{
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                gap: '20px',
                justifyContent: 'space-between',
                padding: '15px',
                border: '3px solid #003FE0'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BlueBadge />
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    margin: 0,
                    color: '#003FE0'
                  }}
                >
                  {formData?.credentialName}
                </Typography>
              </Box>
              {!fileId && <CircularProgress size={24} />}
            </Button>
          </span>
        </Tooltip>

        <Button
          onClick={() => handleShareOption('CopyURL')}
          disabled={!fileId}
          sx={{
            ...buttonStyles,
            mt: '15px'
          }}
        >
          <NewCopy />
          Copy URL
        </Button>
      </Box>

      <Box
        sx={{
          marginTop: '45px',
          width: '100%'
        }}
      >
        <Typography
          sx={{
            color: '#202E5B',
            fontWeight: 400,
            fontSize: '24px',
            fontFamily: 'Lato, sans-serif',
            marginBottom: '10px'
          }}
        >
          Strengthen the value of your skill:
        </Typography>

        <Button
          onClick={() => {
            window.location.href = `/askforrecommendation/${fileId}`
          }}
          disabled={!fileId}
          sx={buttonStyles}
        >
          <HeartSVG />
          Ask for a recommendation
        </Button>
      </Box>

      <Box
        sx={{
          marginTop: '45px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '15px'
        }}
      >
        <Typography
          sx={{
            width: '100%',
            color: '#202E5B',
            padding: '5px 0 5px 5px',
            fontWeight: 400,
            fontSize: '24px',
            fontFamily: 'Lato, sans-serif',
            marginBottom: '10px'
          }}
        >
          Make your skills work for you:
        </Typography>

        <Button
          disabled={!fileId}
          onClick={() => handleShareOption('LinkedIn')}
          sx={buttonStyles}
        >
          <NewLinkedin />
          Share to LinkedIn
        </Button>
        <Button
          disabled={!fileId}
          onClick={() => handleShareOption('Email')}
          sx={buttonStyles}
        >
          <SVGEmail />
          Share Via Mail
        </Button>
      </Box>

      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={isMobile ? 1 : 2}
        sx={{
          marginTop: '45px',
          width: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '16px',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <Button
          variant='outlined'
          onClick={() => {
            window.location.href = '/claims'
          }}
          sx={{
            ...finalButtonStyles,
            minWidth: isMobile ? '360px' : '130px',
            backgroundColor: '#EFF6FF',
            color: '#003FE0',
            border: '1px solid #003FE0'
          }}
        >
          View my skills
        </Button>
        <Button
          onClick={() => {
            setActiveStep(1)
            setLink('')
            setFileId('')
            reset()
            router.push('/credentialForm#step1')
          }}
          variant='contained'
          sx={{
            ...finalButtonStyles,
            minWidth: isMobile ? '360px' : '220px'
          }}
        >
          Add another skill
        </Button>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <LoadingOverlay text='Saving credential. Patience is a virtue...' open={!fileId} />
    </Box>
  )
}

const buttonStyles = {
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  color: '#000',
  letterSpacing: '0.08px',
  justifyContent: 'flex-start',
  padding: '15px',
  gap: '10px',
  fontWeight: 700,
  fontSize: '16px',
  fontFamily: 'Inter, sans-serif',
  borderRadius: '10px',
  backgroundColor: '#FFFFFF',
  border: '3px solid #14B8A6',
  textTransform: 'none'
}

const finalButtonStyles = {
  borderRadius: '100px',
  minHeight: '40px',
  width: '100%',
  gap: '10px',
  overflow: 'hidden',
  padding: '10px 20px',
  textTransform: 'none',
  color: '#FFFFFF',
  backgroundColor: '#003FE0'
}

export default SuccessPage
