import React from 'react'
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
  letterSpacing: '0.08px'
}))

const MediaContainer = styled(Box)(({ theme }) => ({
  height: '180px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
}))

const IconImage = styled('div')({
  width: '38px',
  height: '38px',
  backgroundImage:
    'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-04-09/PnoGJMohCj.png)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat'
})

const SkillMedia = styled('div')({
  width: '160.506px',
  height: '153.129px',
  backgroundImage:
    'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-04-09/usRRv5nxOd.png)',
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat'
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

                  <MediaContainer>
                    <SkillMedia />
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

                  <Field
                    label='Earning Criteria'
                    value={formData?.description as string}
                    isHtml={true}
                  />
                  <Field label='Duration' value={formData?.credentialDuration} />
                  <Field
                    label='Supporting Documentation'
                    value={
                      formData?.evidenceLink || formData?.portfolio?.length
                        ? 'Provided'
                        : undefined
                    }
                  />
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
