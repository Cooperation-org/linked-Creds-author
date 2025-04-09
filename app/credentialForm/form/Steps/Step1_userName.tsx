'use client'

import React from 'react'
import { FormLabel, TextField, Box, Typography } from '@mui/material'
import {
  formLabelStyles,
  TextFieldStyles,
  textFieldInputProps
} from '../../../components/Styles/appStyles'
import {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue
} from 'react-hook-form'
import { FormData } from '../types/Types'
import { useSession } from 'next-auth/react'
import { SVGSProfileName } from '../../../Assets/SVGs'
import { StepTrackShape } from '../fromTexts & stepTrack/StepTrackShape'
interface Step1Props {
  register: UseFormRegister<FormData>
  errors: FieldErrors<FormData>
  watch: UseFormWatch<FormData>
  setValue: UseFormSetValue<FormData>
  handleNext: () => void
}

export function Step1({ register, errors, handleNext }: Readonly<Step1Props>) {
  const { data: session } = useSession()

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const isValid = !errors.fullName && register('fullName').name

      if (isValid) {
        handleNext()
      }
    }
  }

  return (
    <Box
      sx={{
        mt: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px'
      }}
    >
      <SVGSProfileName />
      <Typography sx={{ fontFamily: 'Lato', fontSize: '24px', fontWeight: 400 }}>
        Step 1
      </Typography>
      <Typography sx={{ fontFamily: 'Lato', fontSize: '24px', fontWeight: 400 }}>
        please confirm your name
      </Typography>
      <StepTrackShape />
      <Box sx={{ width: '100%' }}>
        <FormLabel sx={formLabelStyles} id='name-label'>
          Name (required)
        </FormLabel>
        <TextField
          {...register('fullName', {
            required: 'Full name is required'
          })}
          placeholder={
            session?.user?.name ?? 'e.g., Maria Fernández or Kumar Enterprises'
          }
          variant='outlined'
          sx={TextFieldStyles}
          aria-labelledby='name-label'
          inputProps={textFieldInputProps}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
          onKeyDown={handleKeyDown}
        />
      </Box>
    </Box>
  )
}
