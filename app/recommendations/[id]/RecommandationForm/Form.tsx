'use client'

import React, { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { FormControl, Box, Link, Typography } from '@mui/material'
import { useParams } from 'next/navigation'
import { FormData } from '../../../credentialForm/form/types/Types'
import { textGuid } from './fromTexts/FormTextSteps'
import Step1 from './Steps/Step1'
import Step2 from './Steps/Step2'
import DataPreview from './Steps/dataPreview'
import SuccessPage from './Steps/SuccessPage'
import { Buttons } from './buttons/Buttons'
import useLocalStorage from '../../../hooks/useLocalStorage'
import { useStepContext } from '../../../credentialForm/form/StepContext'
import { GoogleDriveStorage, saveToGoogleDrive } from '@cooperation/vc-storage'
import { createDID } from '../../../utils/signCred'
import { signCred } from '../../../utils/credential'
import { useSession } from 'next-auth/react'
import { Logo } from '../../../Assets/SVGs'
import useGoogleDrive from '../../../hooks/useGoogleDrive'
import { storeFileTokens } from '../../../firebase/storage'
interface FormProps {
  fullName: string
  email: string
}

const Form: React.FC<FormProps> = ({ fullName, email }) => {
  const { activeStep, handleNext, handleBack, setActiveStep } = useStepContext()
  const { data: session } = useSession()
  const accessToken = session?.accessToken
  const refreshToken = session?.refreshToken

  const [storedValue, setStoreNewValue, clearValue] = useLocalStorage('formData', {
    storageOption: 'Google Drive',
    fullName: '',
    howKnow: '',
    recommendationText: '',
    portfolio: [{ name: '', url: '' }],
    qualifications: '',
    explainAnswer: ''
  })
  const [submittedFullName, setSubmittedFullName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tooltipText, setTooltipText] = useState('saving your recommendation')
  const [recId, setRecId] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<any[]>([])

  const defaultValues: FormData = storedValue

  const methods = useForm<FormData>({
    defaultValues,
    mode: 'onChange'
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors, isValid }
  } = methods

  const formData = watch()
  const params = useParams()
  const VSFileId = params?.id as string

  useEffect(() => {
    if (JSON.stringify(formData) !== JSON.stringify(storedValue)) {
      setStoreNewValue(formData)
    }
  }, [formData, storedValue, setStoreNewValue])

  const { storage } = useGoogleDrive()

  const saveAndAddComment = async () => {
    try {
      if (!accessToken) {
        throw new Error('No access token provided.')
      }
      // Step 1: Create DID
      const newDid = await createDID(accessToken)
      const { didDocument, keyPair, issuerId } = newDid

      // Save the DID document and keyPair to Google Drive
      const file = await saveToGoogleDrive({
        storage: storage as GoogleDriveStorage,
        data: {
          didDocument,
          keyPair
        },
        type: 'DID'
      })

      // Step 3: Sign the credential (recommendation)
      const signedCred = await signCred(
        accessToken,
        formData,
        issuerId,
        keyPair,
        'RECOMMENDATION',
        VSFileId
      )

      // Step 4: Save the signed recommendation to Google Drive
      const savedRecommendation = await saveToGoogleDrive({
        storage: storage as GoogleDriveStorage,
        data: signedCred,
        type: 'RECOMMENDATION'
      })
      await storeFileTokens({
        googleFileId: savedRecommendation.id,
        tokens: {
          accessToken,
          refreshToken: refreshToken as string
        }
      })
      setRecId(savedRecommendation.id)
      return signedCred
    } catch (error: any) {
      console.error('Error during signing process:', error.message)
      throw error
    }
  }

  const handleFormSubmit = handleSubmit(async (data: FormData) => {
    try {
      setIsLoading(true)
      setTooltipText('saving your recommendation')
      setTimeout(() => {
        setTooltipText('wait while we link your recommendation to the claim')
      }, 2000)

      setSubmittedFullName(data.fullName)
      await saveAndAddComment()
      clearValue()
      reset({
        storageOption: 'Google Drive',
        fullName: '',
        howKnow: '',
        recommendationText: '',
        portfolio: [{ name: '', url: '' }],
        qualifications: '',
        explainAnswer: ''
      })
      setActiveStep(4)
    } catch (error) {
      console.error('Error during form submission:', error)
    } finally {
      setIsLoading(false)
    }
  })

  // New function to handle form data updates from DataPreview
  const handleUpdateFormData = (newData: FormData) => {
    Object.keys(newData).forEach(key => {
      return setValue(key as any, newData[key as keyof FormData])
    })
  }

  return (
    <FormProvider {...methods}>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          alignItems: 'center',
          marginTop: '5px',
          padding: '20px',
          width: '100%',
          maxWidth: '720px',
          minWidth: '320px',
          backgroundColor: '#f0f4f8',
          margin: '0 auto',
          marginBottom: '20px'
        }}
        onSubmit={handleFormSubmit}
      >
        {(activeStep === 2 || activeStep === 3) && (
          <Box
            sx={{
              backgroundColor: 'white',
              p: 2,
              borderRadius: 2,
              width: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box
                sx={{
                  backgroundColor: 'blue.50',
                  borderRadius: '8px',
                  mt: 1
                }}
              >
                <Logo />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {activeStep === 2 && (
                  <Typography
                    variant='h6'
                    sx={{ fontWeight: 'bold', color: 'text.primary' }}
                  >
                    Create your recommendation
                  </Typography>
                )}
                {activeStep === 3 && (
                  <Typography
                    variant='h6'
                    sx={{ fontWeight: 'bold', color: 'text.primary' }}
                  >
                    Review before signing
                  </Typography>
                )}
                {activeStep === 2 && (
                  <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                    You can also{' '}
                    <Link
                      href='#'
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          color: 'primary.dark'
                        },
                        textDecoration: 'underline'
                      }}
                      onClick={e => {
                        e.preventDefault()
                        console.log('Save & Exit clicked')
                      }}
                    >
                      Save & Exit
                    </Link>{' '}
                    to keep this as a draft.
                  </Typography>
                )}
                {activeStep === 3 && (
                  <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                    if everything looks good, select{'  '}
                    <Link
                      href='#'
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          color: 'primary.dark'
                        },
                        textDecoration: 'underline'
                      }}
                      onClick={e => {
                        e.preventDefault()
                        console.log('Save & Exit clicked')
                      }}
                    >
                      Save & Exit
                    </Link>{' '}
                    to complete your recommendation.
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ width: '100%' }}>
          <FormControl sx={{ width: '100%' }}>
            {activeStep === 1 && (
              <Step1 watch={watch} setValue={setValue} handleNext={handleNext} />
            )}
            {activeStep === 2 && (
              <Step2
                register={register}
                watch={watch}
                errors={errors}
                setValue={setValue}
                fullName={fullName}
                control={control}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
              />
            )}
            {activeStep === 3 && (
              <DataPreview
                formData={formData}
                fullName={fullName}
                handleNext={handleNext}
                handleBack={handleBack}
                handleSign={handleFormSubmit}
                isLoading={isLoading}
                onUpdateFormData={handleUpdateFormData}
                selectedFiles={selectedFiles}
              />
            )}
            {activeStep === 4 && (
              <SuccessPage
                formData={formData}
                submittedFullName={submittedFullName}
                fullName={fullName}
                email={email}
                handleBack={handleBack}
                recId={recId}
              />
            )}
          </FormControl>
        </Box>

        <Buttons
          activeStep={activeStep}
          maxSteps={textGuid(fullName).length}
          handleNext={handleNext}
          handleSign={handleFormSubmit}
          handleBack={handleBack}
          isValid={isValid}
          isLoading={isLoading}
          tooltipText={tooltipText}
        />
      </form>
    </FormProvider>
  )
}

export default Form
