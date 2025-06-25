'use client'

import React, { useState, useEffect } from 'react'
import { Typography, Box, useMediaQuery, Theme, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Credential from './viewCredential/Credential'
import { useStepContext } from '../../credentialForm/form/StepContext'
import useGoogleDrive from '../../hooks/useGoogleDrive'
import { useParams } from 'next/navigation'
import Form from './RecommandationForm/Form'

const CredentialData = () => {
  const { activeStep, setActiveStep } = useStepContext()
  const theme = useTheme<Theme>()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('sm'))
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { getContent, fetchFileMetadata, ownerEmail } = useGoogleDrive()
  const params = useParams()
  const idArray = Array.isArray(params?.id) ? params.id[0] : undefined
  const id = typeof params?.id === 'string' ? params.id : idArray

  const { storage } = useGoogleDrive()
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setErrorMessage('Error: Missing credential data.')
        setLoading(false)
        return
      }

      try {
        const content = await storage?.retrieve(id)
        const credentialSubject = content?.data?.credentialSubject
        if (credentialSubject?.name) {
          setFullName(credentialSubject.name)
        } else {
          setFullName('User')
        }

        await fetchFileMetadata(id)
        if (ownerEmail) {
          setEmail(ownerEmail)
        } else {
          setEmail('user@example.com')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setErrorMessage('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, getContent, fetchFileMetadata, ownerEmail, storage])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (errorMessage) {
    return (
      <Box sx={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant='h6' color='error'>
          {errorMessage}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: !isLargeScreen ? 'flex' : 'block',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'auto',
        mt: '20px',
        alignItems: 'center'
      }}
    >
      <Box sx={{ height: '100%' }}>
        {activeStep === 0 && (
          <Credential setactivStep={setActiveStep} fullName={fullName} email={email} />
        )}
        {activeStep !== 0 && <Form fullName={fullName} email={email} />}
      </Box>
    </Box>
  )
}

export default CredentialData
