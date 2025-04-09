import React from 'react'
import { Box, Typography, Button, Drawer, IconButton, Divider } from '@mui/material'
import { SVGCheckMarks, HamburgerMenuSVG, CloseIcon } from '../../Assets/SVGs'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '../../Assets/SVGs/index'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const features = [
  { id: 1, name: 'Capture any skill or experience' },
  { id: 2, name: 'Add portfolio pieces and evidence' },
  { id: 3, name: 'Request references from others' },
  { id: 4, name: 'Share with employers & on LinkedIn' }
]

const HamburgerMenu = () => {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  const isActive = (path: string) => pathname === path

  return (
    <>
      <IconButton
        sx={{ padding: '0px', mr: '15px' }}
        onClick={toggleDrawer}
        aria-label='Open menu'
      >
        <HamburgerMenuSVG />
      </IconButton>
      <Drawer anchor='left' open={isOpen} onClose={toggleDrawer}>
        <Box
          sx={{
            width: '300px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              height: '63px',
              paddingBottom: '15px',
              gap: '10px',
              alignSelf: 'stretch'
            }}
          >
            <Link href='/'>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Logo />
                <Typography
                  sx={{
                    ml: '8px',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: '#000'
                  }}
                >
                  LinkedCreds
                </Typography>
              </Box>
            </Link>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              width: 'calc(100% + 40px)',
              height: '1px',
              backgroundColor: '#9CA3AF',
              margin: '0 -20px',
              alignSelf: 'center'
            }}
          />

          {/* Content based on session state */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '22px',
              alignSelf: 'stretch',
              pt: '22px'
            }}
          >
            {session ? (
              <>
                {/* Links with underline effect */}
                <Link href='/credentialForm' passHref style={{ width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        flex: 1
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: isActive('/credentialForm') ? '600' : '400',
                          color: isActive('/credentialForm') ? '#003FE0' : 'inherit',
                          cursor: 'pointer',
                          display: 'inline-block',
                          position: 'relative',
                          height: '22px'
                        }}
                      >
                        Add a New Skill
                        {isActive('/credentialForm') && (
                          <Box
                            sx={{
                              height: '2px',
                              width: '100%',
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              backgroundColor: '#003FE0'
                            }}
                          />
                        )}
                      </Typography>
                    </Box>
                    <ArrowForwardIosIcon fontSize='small' />
                  </Box>
                </Link>
                <Link href='/claims ' passHref style={{ width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: isActive('/claims') ? '600' : '400',
                          color: isActive('/claims') ? '#003FE0' : 'inherit',
                          cursor: 'pointer',
                          display: 'inline-block',
                          position: 'relative',
                          height: '22px'
                        }}
                      >
                        My Skills
                        {isActive('/claims') && (
                          <Box
                            sx={{
                              height: '2px',
                              width: '100%',
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              backgroundColor: '#003FE0'
                            }}
                          />
                        )}
                      </Typography>
                    </Box>
                    <ArrowForwardIosIcon fontSize='small' />
                  </Box>
                </Link>
                <Link href='/analytics' passHref style={{ width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: isActive('/analytics') ? '600' : '400',
                          color: isActive('/analytics') ? '#003FE0' : 'inherit',
                          cursor: 'pointer',
                          display: 'inline-block',
                          position: 'relative',
                          height: '22px'
                        }}
                      >
                        Analytics
                        {isActive('/analytics') && (
                          <Box
                            sx={{
                              height: '2px',
                              width: '100%',
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              backgroundColor: '#003FE0'
                            }}
                          />
                        )}
                      </Typography>
                    </Box>
                    <ArrowForwardIosIcon fontSize='small' />
                  </Box>
                </Link>
                <Link href='/credentialImportForm' passHref style={{ width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: isActive('/credentialImportForm') ? '600' : '400',
                          color: isActive('/credentialImportForm')
                            ? '#003FE0'
                            : 'inherit',
                          cursor: 'pointer',
                          height: '22px'
                        }}
                      >
                        Import a Skill Credential
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
                    <ArrowForwardIosIcon fontSize='small' />
                  </Box>
                </Link>
              </>
            ) : (
              <>
                {/* Login description and features */}
                <Typography variant='h6' sx={{ fontWeight: 400, fontSize: '16px' }}>
                  Login to access your LinkedCreds
                </Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 400 }}>
                  With LinkedCreds, you can:
                </Typography>
                {features.map(feature => (
                  <Box key={feature.id} sx={{ display: 'flex', alignItems: 'center' }}>
                    <SVGCheckMarks />
                    <Typography sx={{ ml: 1, fontSize: '13px', fontFamily: 'lato' }}>
                      {feature.name}
                    </Typography>
                  </Box>
                ))}

                {/* Login Button */}
                <Button
                  sx={{
                    width: '91.53%',
                    borderRadius: '100px',
                    height: '40px',
                    textTransform: 'capitalize',
                    backgroundColor: '#003FE0',
                    color: '#FFF',
                    mb: '30px',
                    '&:hover': {
                      backgroundColor: '#003FE0'
                    }
                  }}
                  onClick={() => {
                    signIn()
                    toggleDrawer()
                  }}
                >
                  Sign up or Login
                </Button>
              </>
            )}
          </Box>

          {/* About and Support Links */}
          <Box
            sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}
          >
            <Link href='/about' passHref>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  height: '22px',
                  mt: '22px'
                }}
              >
                <Typography sx={{ fontWeight: 400, fontSize: '16px', height: '22px' }}>
                  About LinkedCreds
                </Typography>
                <ArrowForwardIosIcon fontSize='small' />
              </Box>
            </Link>
            <Link href='mailto:support@linkedcreds.allskillscount.org' passHref>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  pb: '6px'
                }}
              >
                <Typography sx={{ fontWeight: 400, fontSize: '16px', height: '22px' }}>
                  Support
                </Typography>
                <ArrowForwardIosIcon fontSize='small' />
              </Box>
            </Link>
          </Box>

          {/* Logout Button */}
          {session && (
            <Button
              sx={{
                width: '100%',
                borderRadius: '100px',
                textTransform: 'capitalize',
                backgroundColor: '#003FE0',
                color: '#FFF',
                mt: 2,
                '&:hover': {
                  backgroundColor: '#003FE0'
                }
              }}
              onClick={() => {
                signOut()
                toggleDrawer()
              }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  )
}

export default HamburgerMenu
