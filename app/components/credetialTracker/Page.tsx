import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Container,
  styled,
  Card,
  CardContent,
  Divider
} from '@mui/material'
import { FormData } from '../../credentialForm/form/types/Types'
import { Logo } from '../../Assets/SVGs'
import Image from 'next/image'
import { commonTypographyStyles, evidenceListStyles } from '../Styles/appStyles'

// Styled components
const HeaderContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: '720px',
  padding: '30px',
  borderRadius: '20px 20px 0 0',
  borderLeft: '1px solid #d1e4ff',
  borderRight: '1px solid #d1e4ff',
  borderBottom: '1px solid #d1e4ff',
  display: 'flex',
  alignItems: 'center'
}))

const MainContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '720px',
  padding: '45px 30px',
  backgroundColor: '#87abe4',
  borderRadius: '0 0 20px 20px',
  borderTop: '1px solid #d1e4ff',
  borderLeft: '1px solid #d1e4ff',
  borderRight: '1px solid #d1e4ff',
  margin: '0 auto'
}))

const SkillCard = styled(Card)(({ theme }) => ({
  padding: '15px 30px',
  backgroundColor: '#fff',
  borderRadius: '10px',
  border: '1px solid #003fe0',
  width: '100%'
}))

const FieldLabel = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter',
  fontSize: '16px',
  fontWeight: 700,
  lineHeight: '24px',
  color: '#000e40',
  letterSpacing: '0.08px'
}))

const FieldValue = styled(Typography)(({ theme }) => ({
  fontFamily: 'Inter',
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
  color: '#6b7280',
  letterSpacing: '0.08px',
  wordBreak: 'break-word',
  whiteSpace: 'pre-line',
  overflowWrap: 'anywhere'
}))

const MediaContainer = styled(Box)(({ theme }) => ({
  height: '180px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
}))

const Media = styled(Box)({
  width: '160.506px',
  height: '153.129px',
  position: 'relative',
  backgroundImage: 'url(/images/SkillMedia.svg)',
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
  overflow: 'hidden',
  margin: '0 auto'
})

// Field component for consistent styling
interface FieldProps {
  label: string
  value?: string
  isHtml?: boolean
}

const Field: React.FC<FieldProps> = ({ label, value, isHtml }) => (
  <Box sx={{ mb: 2.5 }}>
    <FieldLabel>{label}</FieldLabel>
    {isHtml && value ? (
      <FieldValue>
        <span dangerouslySetInnerHTML={{ __html: value }} />
      </FieldValue>
    ) : (
      <FieldValue>{value || 'To be completed...'}</FieldValue>
    )}
  </Box>
)

interface CredentialTrackerProps {
  formData?: FormData
}

const CredentialTracker: React.FC<CredentialTrackerProps> = ({ formData }) => {
  // Helper for Evidence section
  const isGoogleDriveImageUrl = (url: string): boolean => {
    return /https:\/\/drive\.google\.com\/uc\?export=view&id=.+/.test(url)
  }
  const shouldDisplayUrl = (url: string): boolean => {
    return !isGoogleDriveImageUrl(url)
  }
  const handleNavigate = (url: string, target: string = '_blank') => {
    window.open(url, target)
  }
  const hasValidEvidence =
    (formData?.portfolio &&
      Array.isArray(formData.portfolio) &&
      formData.portfolio.some((p: any) => p.name && p.url)) ||
    (formData?.evidenceLink && shouldDisplayUrl(formData.evidenceLink))

  return (
    <Box sx={{ p: 0, width: '100%', maxWidth: '720px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          margin: '0 auto'
        }}
      >
        {/* Header Section */}
        <HeaderContainer elevation={0}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Logo />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant='h5'
                sx={{
                  fontFamily: 'Lato',
                  fontSize: '32px',
                  fontWeight: 700,
                  lineHeight: '38px',
                  color: '#202e5b'
                }}
              >
                Here&apos;s what you&apos;re building
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: '24px',
                  color: '#202e5b',
                  letterSpacing: '0.08px'
                }}
              >
                {formData?.fullName || 'User'} - just now
              </Typography>
            </Box>
          </Box>
        </HeaderContainer>

        {/* Main Content Section */}
        <MainContentContainer>
          <Box sx={{ width: '100%', mb: 6 }}>
            <SkillCard>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Field label='Skill Name' value={formData?.credentialName} />
                  <Field
                    label='Skill Description'
                    value={formData?.credentialDescription as string}
                    isHtml={true}
                  />
                  {/* Media Section using Next.js Image */}
                  <MediaContainer>
                    <Media>
                      {formData?.evidenceLink ? (
                        <Image
                          src={formData.evidenceLink}
                          alt='Featured Media'
                          width={160}
                          height={153}
                          style={{
                            borderRadius: '10px',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <Image
                          src='/images/SkillMedia.svg'
                          alt='Media placeholder'
                          width={160}
                          height={153}
                          style={{
                            borderRadius: '10px',
                            objectFit: 'contain'
                          }}
                        />
                      )}
                    </Media>
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontSize: '16px',
                        fontWeight: 500,
                        lineHeight: '24px',
                        color: '#6b7280',
                        letterSpacing: '0.08px',
                        mt: 1
                      }}
                    >
                      Media (optional)
                    </Typography>
                  </MediaContainer>

                  {/* Evidence Section (matches dataPreview.tsx) */}
                  {hasValidEvidence && (
                    <Box sx={commonTypographyStyles}>
                      <FieldLabel sx={{ display: 'block' }}>
                        Supporting Documentation:
                      </FieldLabel>
                      <ul style={evidenceListStyles}>
                        {formData.evidenceLink &&
                          shouldDisplayUrl(formData.evidenceLink) && (
                            <li
                              style={{
                                cursor: 'pointer',
                                width: 'fit-content',
                                color: '#003fe0',
                                textDecoration: 'underline'
                              }}
                              key={formData.evidenceLink}
                              onClick={() =>
                                handleNavigate(formData.evidenceLink, '_blank')
                              }
                            >
                              {formData.evidenceLink}
                            </li>
                          )}
                        {Array.isArray(formData.portfolio) &&
                          formData.portfolio.map(
                            (porto: { name: string; url: string }) =>
                              porto.name &&
                              porto.url && (
                                <li
                                  style={{
                                    cursor: 'pointer',
                                    width: 'fit-content',
                                    color: '#003fe0',
                                    textDecoration: 'underline'
                                  }}
                                  key={porto.url}
                                  onClick={() => handleNavigate(porto.url, '_blank')}
                                >
                                  {porto.name || porto.url}
                                </li>
                              )
                          )}
                      </ul>
                    </Box>
                  )}

                  <Field
                    label='Earning Criteria'
                    value={formData?.description as string}
                    isHtml={true}
                  />
                  <Field label='Duration' value={formData?.credentialDuration} />
                </Box>
              </CardContent>
            </SkillCard>
          </Box>
        </MainContentContainer>
      </Box>
    </Box>
  )
}

export default CredentialTracker
