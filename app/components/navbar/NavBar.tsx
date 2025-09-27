import { useTheme } from '@mui/material/styles'
import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import HamburgerMenu from '../hamburgerMenu/HamburgerMenu'
import { Logo } from '../../Assets/SVGs'
import router from 'next/router'

const NavBar = () => {
  const theme = useTheme()
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (path: string): boolean => pathname === path
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false })
      localStorage.clear()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      localStorage.clear()
      router.push('/')
    }
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: { xs: '60px', sm: '70px', md: '80px', lg: '100px' },
        display: 'flex',
        position: 'sticky',
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        my: { xs: '10px', sm: '15px', md: '0px' },
        px: { xs: '16px', sm: '20px', md: '0px' },
        boxShadow: {
          sm: '0px 2px 8px rgba(209, 213, 219, 0.3)',
          md: '0px 4px 10px rgba(209, 213, 219, 0.5)'
        },
        zIndex: 1000
      }}
    >
      {/* Logo and Name */}
      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          pl: { xs: '0px', sm: '0px', md: '9.6vw' },
          gap: { xs: '8px', sm: '10px', md: '12px' }
        }}
      >
        <Link href='/' aria-label='LinkedCreds Home'>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Logo />
          </Box>
        </Link>
        <Link href='/' aria-label='LinkedCreds Home'>
          <Typography
            sx={{
              fontWeight: '700',
              fontSize: { xs: '16px', sm: '18px', md: '22px', lg: '24px' },
              color: theme.palette.t3DarkSlateBlue,
              fontFamily: 'inter',
              lineHeight: 1.2
            }}
          >
            LinkedCreds
          </Typography>
        </Link>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: { xs: 'none', md: 'block' }
        }}
      ></Box>

      {/* Navigation Links and Sign Button */}
      <Box
        sx={{
          width: { md: '65%', lg: '60%' },
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: session ? 'space-between' : 'flex-end',
          mr: { md: '4vw', lg: '10.938vw' },
          gap: { md: '1.5vw', lg: '3.9vw' },
          textWrap: 'nowrap',
          flexWrap: { md: 'nowrap', lg: 'nowrap' }
        }}
      >
        {session && (
          <>
            <Link href='/credentialForm' passHref>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography
                  sx={{
                    fontSize: { md: '13px', lg: '16px' },
                    fontWeight: isActive('/credentialForm') ? '600' : '400',
                    color: isActive('/credentialForm')
                      ? '#003FE0'
                      : theme.palette.t3DarkSlateBlue,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Add a New Skill
                </Typography>
                {isActive('/credentialForm') && (
                  <Box
                    sx={{
                      height: '2px',
                      width: '100%',
                      mt: '5px',
                      backgroundColor: '#003FE0'
                    }}
                  />
                )}
              </Box>
            </Link>
            <Link href='/credentialImportForm' passHref>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Typography
                  sx={{
                    fontSize: { md: '13px', lg: '16px' },
                    fontWeight: isActive('/credentialImportForm') ? '600' : '400',
                    color: isActive('/credentialImportForm')
                      ? '#003FE0'
                      : theme.palette.t3DarkSlateBlue,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Import Skill Credential
                </Typography>
                {isActive('/credentialImportForm') && (
                  <Box
                    sx={{
                      height: '2px',
                      width: '100%',
                      mt: '5px',
                      backgroundColor: '#003FE0'
                    }}
                  />
                )}
              </Box>
            </Link>
            <Link href='/claims' passHref>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Typography
                  sx={{
                    fontSize: { md: '13px', lg: '16px' },
                    fontWeight: isActive('/claims') ? '600' : '400',
                    color: isActive('/claims')
                      ? '#003FE0'
                      : theme.palette.t3DarkSlateBlue,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  My Skills
                </Typography>
                {isActive('/claims') && (
                  <Box
                    sx={{
                      height: '2px',
                      width: '100%',
                      mt: '5px',
                      backgroundColor: '#003FE0'
                    }}
                  />
                )}
              </Box>
            </Link>
            <Link href='/analytics' passHref>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Typography
                  sx={{
                    fontSize: { md: '13px', lg: '16px' },
                    fontWeight: isActive('/analytics') ? '600' : '400',
                    color: isActive('/analytics')
                      ? '#003FE0'
                      : theme.palette.t3DarkSlateBlue,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Analytics
                </Typography>
                {isActive('/analytics') && (
                  <Box
                    sx={{
                      height: '2px',
                      width: '100%',
                      mt: '5px',
                      backgroundColor: '#003FE0'
                    }}
                  />
                )}
              </Box>
            </Link>
            <Link href='/help' passHref>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Typography
                  sx={{
                    fontSize: { md: '13px', lg: '16px' },
                    fontWeight: isActive('/help') ? '600' : '400',
                    color: isActive('/help') ? '#003FE0' : theme.palette.t3DarkSlateBlue,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Help & FAQ
                </Typography>
                {isActive('/help') && (
                  <Box
                    sx={{
                      height: '2px',
                      width: '100%',
                      mt: '5px',
                      backgroundColor: '#003FE0'
                    }}
                  />
                )}
              </Box>
            </Link>
          </>
        )}

        {/* Sign In/Out Button */}
        {session ? (
          <Button
            sx={{
              width: { md: '100px', lg: '148px' },
              height: { md: '32px', lg: '40px' },
              fontFamily: 'roboto',
              fontSize: { md: '12px', lg: '16px' },
              fontWeight: '500',
              lineHeight: '20px',
              textAlign: 'center',
              justifyContent: 'center',
              minWidth: 'auto',
              padding: { md: '6px 12px', lg: '10px 24px' }
            }}
            variant='actionButton'
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        ) : (
          <Button
            sx={{
              width: { md: '100px', lg: '148px' },
              height: { md: '32px', lg: '40px' },
              fontFamily: 'roboto',
              fontSize: { md: '12px', lg: '16px' },
              fontWeight: '500',
              lineHeight: '20px',
              textAlign: 'center',
              justifyContent: 'center',
              minWidth: 'auto',
              padding: { md: '6px 12px', lg: '10px 24px' }
            }}
            variant='actionButton'
            onClick={() => signIn('google')}
          >
            Sign In
          </Button>
        )}
      </Box>

      {/* Small Screen - Hamburger Menu */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'center',
          pr: { xs: '0px', sm: '0px' }
        }}
      >
        <HamburgerMenu aria-label='Open menu' />
      </Box>
    </Box>
  )
}

export default NavBar
