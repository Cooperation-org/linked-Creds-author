'use client'
import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Container,
  LinearProgress,
  Card,
  CardContent,
  styled
} from '@mui/material'

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '2px 4px 20px 0 rgba(197,208,244,0.35)',
  borderRadius: '10px',
  border: '1px solid #f3f6ff',
  height: '100%'
}))

const StyledMetricCard = styled(StyledCard)({
  minHeight: '100px'
})

const StyledCardContent = styled(CardContent)({
  padding: '16px 12px',
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
})

const StyledMetricValue = styled(Typography)({
  fontFamily: 'Inter',
  fontSize: '24px',
  fontWeight: 700,
  lineHeight: '16.625px',
  marginTop: 'auto'
})

const StyledMetricTitle = styled(Typography)({
  fontFamily: 'Inter',
  fontSize: '12px',
  fontWeight: 500,
  color: '#4f4f4f'
})

const StyledSectionTitle = styled(Typography)({
  fontFamily: 'Inter',
  fontSize: '32px',
  fontWeight: 600,
  lineHeight: '24px',
  marginBottom: '15px'
})

const StyledChartContainer = styled(Box)({
  width: '126.813px',
  height: '30.848px',
  marginTop: 'auto'
})

const StyledProgressBarContainer = styled(Box)({
  position: 'relative',
  width: '320px',
  height: '17px'
})

const StyledProgressLabel = styled(Typography)({
  position: 'absolute',
  right: '-40px',
  bottom: '5px',
  fontFamily: 'Inter',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '16.625px'
})

const StyledProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 8,
  backgroundColor: 'rgba(20,184,166,0.5)',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#14b8a6',
    borderRadius: 8
  }
}))

// Custom LinearProgress component with label
interface LabeledProgressProps {
  value: number
  label: string
}

const LabeledProgress: React.FC<LabeledProgressProps> = ({ value, label }) => {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography
        variant='body1'
        sx={{
          fontFamily: 'Inter',
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '16.625px',
          mb: 0.5
        }}
      >
        {label}
      </Typography>
      <StyledProgressBarContainer>
        <StyledProgressLabel>{`${value}%`}</StyledProgressLabel>
        <StyledProgressBar variant='determinate' value={value} />
      </StyledProgressBarContainer>
    </Box>
  )
}

// Main component
export default function Main() {
  return (
    <Container maxWidth='lg' sx={{ py: 5 }}>
      <Typography sx={{ fontWeight: 600, fontSize: '32px', lineHeight: '24px', mb: 6 }}>
        Analytics
      </Typography>
      <Paper
        sx={{
          p: 4,
          borderRadius: '20px',
          border: '1px solid #d1e4ff',
          width: '100%',
          maxWidth: '1240px',
          margin: '0 auto'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
          {/* Credentials Issued Section */}
          <Box>
            <StyledSectionTitle>Credentials Issued</StyledSectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <StyledCardContent>
                    <StyledMetricTitle>Skill</StyledMetricTitle>
                    <StyledMetricValue>13</StyledMetricValue>
                  </StyledCardContent>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <StyledCardContent>
                    <StyledMetricTitle>Employment</StyledMetricTitle>
                    <StyledMetricValue>24</StyledMetricValue>
                  </StyledCardContent>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <StyledCardContent>
                    <StyledMetricTitle>Performance Review</StyledMetricTitle>
                    <StyledMetricValue>28</StyledMetricValue>
                  </StyledCardContent>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <StyledCardContent>
                    <StyledMetricTitle>Volunteer</StyledMetricTitle>
                    <StyledMetricValue>61</StyledMetricValue>
                  </StyledCardContent>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <StyledCardContent>
                    <StyledMetricTitle>ID Verification</StyledMetricTitle>
                    <StyledMetricValue>24</StyledMetricValue>
                  </StyledCardContent>
                </StyledMetricCard>
              </Grid>
            </Grid>
          </Box>

          {/* Click Rates Section */}
          <Box>
            <StyledSectionTitle>Click Rates</StyledSectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StyledCard>
                  <StyledCardContent sx={{ gap: '16px' }}>
                    <StyledMetricTitle
                      sx={{ height: '32px', display: 'flex', alignItems: 'center' }}
                    >
                      Request Recommendation
                    </StyledMetricTitle>
                    <StyledMetricValue>73</StyledMetricValue>
                    <StyledChartContainer
                      sx={{
                        backgroundImage:
                          'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-04-09/xGjGNzEWD4.png)',
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  </StyledCardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledCard>
                  <StyledCardContent sx={{ gap: '16px' }}>
                    <StyledMetricTitle
                      sx={{ height: '32px', display: 'flex', alignItems: 'center' }}
                    >
                      Share Credential
                    </StyledMetricTitle>
                    <StyledMetricValue>3</StyledMetricValue>
                    <StyledChartContainer
                      sx={{
                        backgroundImage:
                          'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-04-09/JXFgo9MP2P.png)',
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  </StyledCardContent>
                </StyledCard>
              </Grid>
            </Grid>
          </Box>

          {/* Evidence Attachment Rates Section */}
          <Box>
            <StyledSectionTitle>Evidence Attachment Rates</StyledSectionTitle>
            <StyledCard sx={{ maxWidth: '396px' }}>
              <Box sx={{ p: 1, pl: 2 }}>
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#828282',
                    py: 0.5
                  }}
                >
                  Rate of VCs with evidence attached
                </Typography>
              </Box>
              <CardContent>
                <LabeledProgress value={52} label='Skill VCs' />
                <LabeledProgress value={80} label='Employment VCs' />
                <LabeledProgress value={23} label='Volunteer VCs' />
                <LabeledProgress value={95} label='Performance Reviews' />
              </CardContent>
            </StyledCard>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
