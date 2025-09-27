'use client'
import React from 'react'
import { Box, Button, Typography, useTheme, useMediaQuery, Theme } from '@mui/material'
import Link from 'next/link'
import Card from './components/cards'
interface SectionProps {
  theme: Theme //NOSONAR
}
const EXAMPLE_CARDS = [
  {
    id: 'caretaker',
    title: 'Elder Medical Carer',
    description:
      'I am able to attend to the care of an older adult with complex medical needs. This includes day-to-day care as well as basic medical care.',
    criteria: [
      'Solo caretaker certification',
      'Completed caretaker training program',
      'Basic medical care instructions',
      'Have CPR certification'
    ],
    duration: '5 Years',
    evidence: ['IMG_0630', 'IMG_0624', 'IMG_0640'],
    width: '195px',
    height: '385px',
    rotation: 'rotate(-5deg)',
    image: '/caretaker.jpeg',
    showPlayButton: false,
    showTimer: false
  },
  {
    id: 'barista',
    title: 'Barrista',
    description:
      'I am able to demonstrate advanced skills in coffee preparation, customer service, and knowledge of coffee origins and brewing techniques.',
    criteria: [
      'Took 12 hours of barista classes',
      'Received positive customer surveys',
      'Received positive teacher feedback'
    ],
    duration: '2 Days',
    evidence: [
      'Video of the Perfect Pour',
      'Coffee Portfolio',
      'Training Campus Certification',
      'Scent training',
      'IMG_0624',
      'Tamping',
      'IMG_0640'
    ],
    width: '195px',
    height: '410px',
    rotation: 'rotate(0deg)',
    image: '/coffee.jpeg',
    showPlayButton: true,
    showTimer: true
  },
  {
    id: 'landscaper',
    title: 'Landscaper',
    description:
      'I am able to demonstrate advanced skills in landscaping, including hedge art, gardening, and outdoor hardscaping.',
    criteria: [
      'Worked 3 years as landscaper',
      'Received local landscaping award program',
      'Received positive client reviews'
    ],
    duration: '2 Weeks',
    evidence: [
      'Portfolio of Garden Care',
      'Landscaper Portfolio',
      'Hardscape Training',
      'IMG_0624',
      'IMG_0640'
    ],
    width: '195px',
    height: '400px',
    rotation: 'rotate(5deg)',
    image: '/landscape.jpeg',
    showPlayButton: true,
    showTimer: true
  }
]

const STEPS = [
  {
    id: 'capture',
    title: '1. Capture your skills',
    icon: '/Document.svg',
    description:
      'Add your experiences, from school activities, caregiving, volunteering, to special projects and more.'
  },
  {
    id: 'validate',
    title: '2. Add validation',
    icon: '/Human Insurance.svg',
    description:
      'Upload proof of your skills and request recommendations from trusted connections.'
  },
  {
    id: 'share',
    title: '3. Share',
    icon: '/Network.svg',
    description:
      'Share your skills with employers, add them to your resume, or to your LinkedIn profile.'
  }
]

const LinkedCreds_FEATURES = [
  { id: 'verifiable', text: 'Verifiable' },
  { id: 'shareable', text: 'Shareable' },
  { id: 'tamper-proof', text: 'Tamper proof' },
  { id: 'beautiful', text: 'Presented beautifully' },
  { id: 'ownership', text: 'Owned by you' },
  { id: 'control', text: 'You control access' },
  { id: 'no-degree', text: 'For everyone!' }
]

const HeroSection: React.FC<SectionProps & { showCards: boolean }> = ({ showCards }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'))
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        ml: 'auto',
        mr: 'auto',
        width: { xs: '100%', md: '100%' },
        maxWidth: '1400px',
        px: { xs: '16px', sm: '24px', md: '32px', lg: '40px' },
        pb: { xs: 2, sm: 3, md: 4 },
        pt: { xs: '20px', sm: '30px', md: '50px', lg: '75px' }
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: '100%', md: '45%', lg: '40vw' },
          maxWidth: { xs: '100%', sm: '500px', md: '600px', lg: '771px' },
          textAlign: { xs: 'center', sm: 'center', md: 'left' },
          alignSelf: { xs: 'center', sm: 'center', md: 'flex-start' },
          pr: { xs: 0, sm: 0, md: 0 },
          mr: { xs: 0, sm: 0, md: '40px', lg: '71px' },
          height: { xs: 'auto', sm: 'auto', md: 'auto', lg: '432px' },
          mb: { xs: '30px', sm: '40px', md: 0 }
        }}
      >
        <Typography
          variant='h2'
          sx={{
            color: theme.palette.t3Black,
            mb: { xs: '15px', sm: '20px', md: '10px' },
            fontFamily: 'poppins',
            fontSize: { xs: '28px', sm: '36px', md: '42px', lg: '50px' },
            fontWeight: 'bolder',
            lineHeight: { xs: '35px', sm: '45px', md: '52px', lg: '62.5px' },
            maxWidth: { xs: '100%', sm: '500px', md: '600px', lg: '771px' }
          }}
        >
          {isMobile ? (
            'Showcase the skills that define you.'
          ) : isTablet ? (
            'Showcase the skills that define you.'
          ) : (
            <>
              Showcase the skills
              <br />
              that define you.
            </>
          )}
        </Typography>

        <Typography
          variant='body1'
          sx={{
            color: theme.palette.t3BodyText,
            mb: { xs: '25px', sm: '30px', md: '30px' },
            fontSize: { xs: '16px', sm: '17px', md: '18px' },
            lineHeight: { xs: '22px', sm: '24px', md: '26px' }
          }}
        >
          {isMobile ? (
            'Whether it&apos;s caring for your family, volunteering, a side hustle, or on-the-job learning, LinkedCreds helps you document, verify, and share your unique experiences.'
          ) : isTablet ? (
            'Whether it&apos;s caring for your family, volunteering, a side hustle, or on-the-job learning, LinkedCreds helps you document, verify, and share your unique experiences.'
          ) : (
            <>
              Whether it&apos;s caring for your family, volunteering, a side hustle,
              <br />
              or on-the-job learning, LinkedCreds helps you document, verify,
              <br />
              and share your unique experiences.
            </>
          )}
        </Typography>

        <Link href='/credentialForm' passHref>
          <Button
            variant='contained'
            sx={{
              backgroundColor: theme.palette.t3ButtonBlue,
              color: '#FFFFFF',
              width: { xs: '200px', sm: '220px', md: '200px', lg: '177px' },
              maxWidth: { xs: '200px', sm: '220px', md: '200px', lg: '177px' },
              height: { xs: '44px', sm: '48px', md: '50px', lg: '52px' },
              borderRadius: '100px',
              py: { xs: '12px', sm: '14px', md: '16px', lg: '22px' },
              px: { xs: '24px', sm: '28px', md: '32px', lg: '20px' },
              textTransform: 'none',
              fontSize: { xs: '15px', sm: '16px', md: '16px' },
              fontFamily: 'Roboto',
              lineHeight: '20px',
              fontWeight: '500',
              mb: { xs: '20px', sm: '25px', md: 0 }
            }}
          >
            Build your first skill
          </Button>
        </Link>
      </Box>

      {showCards && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { md: '8px', lg: '15px' },
            px: { md: '10px', lg: '20px' },
            overflow: 'hidden',
            width: { md: '55%', lg: '60%' },
            maxWidth: { md: '100%', lg: 'none' }
          }}
        >
          {EXAMPLE_CARDS.map((card, index) => (
            <Box
              key={card.id}
              sx={{
                transform: card.rotation,
                zIndex: 3 - index,
                flexShrink: 0,
                '&:hover': {
                  transform: `${card.rotation} scale(1.05)`,
                  zIndex: 10,
                  transition: 'transform 0.3s ease, z-index 0.3s ease'
                }
              }}
            >
              <Card
                {...card}
                width={isTablet ? '160px' : '195px'}
                height={isTablet ? '320px' : card.height}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

const MobileLinkedCredsSection: React.FC<SectionProps> = ({ theme }) => (
  <Box
    sx={{
      background: 'linear-gradient(180deg, #F1F5FC, #FFFFFF)',
      py: { xs: '20px', sm: '25px' },
      px: { xs: '16px', sm: '24px', md: '32px' },
      mt: { xs: '20px', sm: '25px' }
    }}
  >
    <Typography
      variant='h4'
      sx={{
        color: theme.palette.t3Black,
        textAlign: { xs: 'left', sm: 'center' },
        mb: { xs: '20px', sm: '25px' },
        fontFamily: 'poppins',
        fontSize: { xs: '20px', sm: '22px' },
        fontWeight: '700'
      }}
    >
      What are LinkedCreds?
    </Typography>
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: { xs: 'center', sm: 'space-between' },
        alignItems: { xs: 'center', sm: 'flex-start' },
        gap: { xs: '20px', sm: '15px' },
        pt: { xs: '15px', sm: '15px' },
        pb: { xs: '25px', sm: '30px' }
      }}
    >
      <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
        <Typography
          variant='body1'
          sx={{
            color: theme.palette.t3BodyText,
            mb: { xs: '15px', sm: '15px' },
            fontSize: { xs: '16px', sm: '18px' },
            fontWeight: 700
          }}
        >
          LinkedCreds are verifiable skills that you create to showcase your experiences.
          <br />
          <br />
          LinkedCreds are:
        </Typography>
        <Box
          component='ul'
          sx={{
            color: theme.palette.t3BodyText,
            pl: { xs: 0, sm: 2 },
            mb: 0,
            fontSize: { xs: '13px', sm: '14px' },
            fontWeight: 400,
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          {LinkedCreds_FEATURES.map(feature => (
            <Typography key={feature.id} component='li' variant='body2'>
              {feature.text}
            </Typography>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          height: '100%',
          width: 'auto',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Card
          {...EXAMPLE_CARDS[1]}
          width='160px'
          height='350px'
          rotation='rotate(0deg)'
          showPlayButton={true}
          showTimer={true}
          showDuration={true}
        />
      </Box>
    </Box>
  </Box>
)

const StepsSection: React.FC<SectionProps> = ({ theme }) => (
  <Box
    sx={{
      maxWidth: '1400px',
      mr: 'auto',
      ml: 'auto',
      px: { xs: '16px', sm: '24px', md: '32px', lg: '40px' }
    }}
  >
    <Box
      sx={{
        display: 'flex',
        width: { xs: '100%', sm: '400px', md: '450px', lg: '500px' },
        height: { xs: 'auto', sm: '39px' },
        mr: 'auto',
        ml: 'auto',
        mt: { xs: '30px', sm: '40px', md: '50px', lg: '60px' },
        mb: { xs: '20px', sm: '25px', md: '30px' },
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography
        sx={{
          textAlign: 'center',
          color: theme.palette.t3Black,
          fontSize: { xs: '20px', sm: '22px', md: '24px' },
          pb: { xs: '8px', sm: '10px' },
          px: { xs: '10px', sm: '15px' },
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: '600',
          lineHeight: { xs: '25px', sm: '27.5px', md: '30px' }
        }}
      >
        How it works - 3 simple steps
      </Typography>
    </Box>
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'column', md: 'row' },
        gap: { xs: 2, sm: 3, md: 4 },
        px: { xs: 0, sm: '20px', md: '32px', lg: '40px' },
        mb: { xs: '20px', sm: '25px', md: '30px' }
      }}
    >
      {STEPS.map(step => (
        <Box
          key={step.id}
          sx={{
            background: '#EEF5FF',
            borderRadius: '8px',
            pt: { xs: '20px', sm: '15px', md: '15px' },
            pb: { xs: '20px', sm: '15px', md: '30px' },
            px: { xs: '15px', sm: '10px', md: '10px' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            textAlign: 'center',
            minHeight: { xs: 'auto', sm: '280px', md: '300px' }
          }}
        >
          <Box
            component='img'
            src={step.icon}
            alt={step.title}
            sx={{
              mb: { xs: '15px', sm: '15px' },
              width: { xs: '50px', sm: '60px' },
              height: { xs: '50px', sm: '60px' }
            }}
          />
          <Typography
            sx={{
              color: theme.palette.t3BodyText,
              mb: { xs: '12px', sm: '15px' },
              fontSize: { xs: '16px', sm: '18px' },
              fontWeight: 700,
              lineHeight: { xs: '20px', sm: '22px' }
            }}
          >
            {step.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Lato',
              fontWeight: 400,
              fontSize: { xs: '15px', sm: '16px', md: '18px' },
              color: theme.palette.t3BodyText,
              lineHeight: { xs: '20px', sm: '22px', md: '24px' }
            }}
          >
            {step.description}
          </Typography>
        </Box>
      ))}
    </Box>
    <Link href='/credentialForm' passHref>
      <Button
        variant='contained'
        sx={{
          backgroundColor: theme.palette.t3ButtonBlue,
          color: '#FFFFFF',
          fontFamily: 'Roboto',
          borderRadius: '100px',
          py: { xs: 1.5, sm: 1.5 },
          px: { xs: 3, sm: 4 },
          textTransform: 'none',
          fontSize: { xs: '15px', sm: '16px' },
          lineHeight: '20px',
          mx: 'auto',
          display: { xs: 'block', sm: 'block', md: 'none' },
          mb: { xs: '25px', sm: '30px' },
          width: { xs: '100%', sm: 'auto' },
          maxWidth: { xs: '100%', sm: '360px' },
          fontWeight: 500
        }}
      >
        Start building your first skill
      </Button>
    </Link>
  </Box>
)

const Page = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background:
          'url(/Background.png) lightgray 50% / contain no-repeat, rgba(255, 255, 255, 0.5)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <HeroSection showCards={!isMobile} theme={theme} />
      {isMobile && <MobileLinkedCredsSection theme={theme} />}
      <StepsSection theme={theme} />
    </Box>
  )
}

export default Page
