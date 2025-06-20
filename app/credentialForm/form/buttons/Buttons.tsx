'use client'

import React from 'react'
import { Box, Button, CircularProgress } from '@mui/material'

interface ButtonsProps {
  activeStep: number
  handleBack: React.MouseEventHandler<HTMLButtonElement> | undefined
  handleNext: React.MouseEventHandler<HTMLButtonElement> | undefined
  handleSkip?: React.MouseEventHandler<HTMLButtonElement> | undefined
  handleSign: React.MouseEventHandler<HTMLButtonElement> | undefined
  isValid: boolean
  handleSaveSession: () => void
  loading: boolean
}

export function Buttons({
  activeStep,
  handleNext,
  handleSign,
  isValid,
  handleSaveSession,
  loading,
  handleSkip
}: Readonly<ButtonsProps>) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '40px',
        display: 'flex',
        gap: '15px',
        justifyContent: 'center'
      }}
    >
      {activeStep !== 0 && (
        <Button
          sx={{ minWidth: '130px' }}
          onClick={handleSaveSession}
          color='secondary'
          variant='finishButton'
        >
          Save & Exit
        </Button>
      )}
      {activeStep === 3 && (
        <Button variant='finishButton' onClick={handleSkip} color='secondary'>
          Skip
        </Button>
      )}
      {(activeStep === 1 || (activeStep !== 4 && activeStep !== 0)) && (
        <Button
          onClick={handleNext}
          color='primary'
          disabled={activeStep !== 0 && activeStep !== 3 && !isValid}
          variant='nextButton'
        >
          Next
        </Button>
      )}
      {activeStep === 4 && (
        <Button variant='nextButton' onClick={handleSign} color='primary'>
          Finish & Sign
        </Button>
      )}
      {activeStep === 5 && (
        <Button
          onClick={handleNext}
          disabled={loading} // Disable button during loading
          color='primary'
          variant='nextButton'
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} /> Uploading...
            </>
          ) : (
            'Preview'
          )}
        </Button>
      )}
    </Box>
  )
}
