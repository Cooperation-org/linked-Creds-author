import { useTheme } from '@mui/material/styles'
import React from 'react'
import { Box, Typography, useMediaQuery, Container } from '@mui/material'
import Link from 'next/link'

const CCHeartIcon = () => (
  <Box
    sx={{
      width: '20px',
      height: '16px',
      backgroundImage: 'url(/icons/footer/ccheart_black.svg)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      flexShrink: 0
    }}
  />
)

const ApachePoweredByIcon = () => (
  <Box
    sx={{
      width: '20px',
      height: '20px',
      backgroundImage: 'url(/icons/footer/Apache_PoweredBy.svg)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      flexShrink: 0
    }}
  />
)

const GitHubIcon = () => (
  <Box
    sx={{
      width: '20px',
      height: '20px',
      backgroundImage: 'url(/icons/footer/github.svg)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      flexShrink: 0
    }}
  />
)

const PrivacyPolicyIcon = () => (
  <Box
    sx={{
      width: '20px',
      height: '20px',
      backgroundImage: 'url(/icons/footer/privacy.svg)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      flexShrink: 0
    }}
  />
)

const EmailIcon = () => (
  <Box
    sx={{
      width: '20px',
      height: '15px',
      backgroundImage: 'url(/icons/footer/email.svg)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      flexShrink: 0
    }}
  />
)

const Footer: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  const textStyle = {
    color: '#ffffff',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: '-0.14px',
    display: 'flex',
    alignItems: 'center'
  }

  const linkStyle = {
    ...textStyle,
    textDecoration: 'underline',
    cursor: 'pointer'
  }

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#252C41',
        py: { xs: 2, sm: 2, md: 2 },
        overflow: 'hidden'
      }}
    >
      <Container maxWidth='xl'>
        {isMobile ? (
          // Mobile layout - stacked vertical
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 2,
              width: '100%',
              height: '224px'
            }}
          >
            <FooterItem
              icon={<CCHeartIcon />}
              text='Copyright, Creative Commons License BY 4.0'
            />
            <FooterItem
              icon={<ApachePoweredByIcon />}
              text='Apache 2 License'
              href='https://www.apache.org/licenses/LICENSE-2.0'
            />
            <FooterItem
              icon={<GitHubIcon />}
              text='Source Code: https://github.com/Cooperation-org/linked-claims-author'
              href='https://github.com/Cooperation-org/linked-claims-author'
              isSourceCode={true}
            />
            <FooterItem
              icon={<PrivacyPolicyIcon />}
              text='Privacy Policy'
              href='/privacy'
            />
            <FooterItem
              icon={<EmailIcon />}
              text='support@lc.allskillscount.org'
              href='mailto:support@lc.allskillscount.org'
            />
          </Box>
        ) : isTablet ? (
          // Tablet layout - two rows
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 3,
                justifyContent: 'space-between'
              }}
            >
              <FooterItem
                icon={<CCHeartIcon />}
                text='Copyright, Creative Commons License BY 4.0'
              />
              <FooterItem
                icon={<ApachePoweredByIcon />}
                text='Apache 2 License'
                href='https://www.apache.org/licenses/LICENSE-2.0'
              />
              <FooterItem
                icon={<PrivacyPolicyIcon />}
                text='Privacy Policy'
                href='/privacy'
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 3,
                justifyContent: 'space-between'
              }}
            >
              <FooterItem
                icon={<GitHubIcon />}
                text='Source Code: https://github.com/Cooperation-org/linked-claims-author'
                href='https://github.com/Cooperation-org/linked-claims-author'
                isSourceCode={true}
              />
              <FooterItem
                icon={<EmailIcon />}
                text='support@lc.allskillscount.org'
                href='mailto:support@lc.allskillscount.org'
              />
            </Box>
          </Box>
        ) : (
          // Desktop layout - single row
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: { md: 3, lg: 4 },
              width: '100%',
              height: '114px',
              justifyContent: { md: 'flex-start', lg: 'space-between' }
            }}
          >
            <FooterItem
              icon={<CCHeartIcon />}
              text='Copyright, Creative Commons License BY 4.0'
            />
            <FooterItem
              icon={<ApachePoweredByIcon />}
              text='Apache 2 License'
              href='https://www.apache.org/licenses/LICENSE-2.0'
            />
            <FooterItem
              icon={<GitHubIcon />}
              text='Source Code: https://github.com/Cooperation-org/linked-claims-author'
              href='https://github.com/Cooperation-org/linked-claims-author'
              isSourceCode={true}
            />
            <FooterItem
              icon={<PrivacyPolicyIcon />}
              text='Privacy Policy'
              href='/privacy'
            />
            <FooterItem
              icon={<EmailIcon />}
              text='support@lc.allskillscount.org'
              href='mailto:support@lc.allskillscount.org'
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}

interface FooterItemProps {
  icon: React.ReactNode
  text: string
  href?: string
  isSourceCode?: boolean
}

const FooterItem: React.FC<FooterItemProps> = ({ icon, text, href, isSourceCode }) => {
  const textStyle = {
    color: '#ffffff',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: '-0.14px',
    ml: 1.5
  }

  const linkStyle = {
    ...textStyle,
    textDecoration: 'underline'
  }

  const content = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexShrink: 0
      }}
    >
      {icon}
      {isSourceCode ? (
        <Box sx={{ ml: 1.5 }}>
          <Typography component='span' sx={{ ...textStyle, ml: 0 }}>
            Source Code:{' '}
          </Typography>
          <Typography component='span' sx={{ ...linkStyle, ml: 0 }}>
            https://github.com/Cooperation-org/linked-claims-author
          </Typography>
        </Box>
      ) : (
        <Typography sx={href ? linkStyle : textStyle}>{text}</Typography>
      )}
    </Box>
  )

  if (href) {
    return (
      <Link href={href} passHref>
        {content}
      </Link>
    )
  }

  return content
}

export default Footer
