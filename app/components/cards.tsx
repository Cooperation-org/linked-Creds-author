import React from 'react'
import { Box, Typography } from '@mui/material'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import Image from 'next/image'
interface CardProps {
  title?: string
  description?: string
  criteria?: string[]
  duration?: string
  evidence?: string[]
  width?: string
  height?: string
  rotation?: string
  image?: string
  showPlayButton?: boolean
  showTimer?: boolean
  showDuration?: boolean
  showEvidence?: boolean
}

const Card = ({
  title = 'barista',
  description = 'I am able to demonstrate advanced skills in coffee preparation, customer service, and knowledge of coffee origins and brewing techniques.',
  criteria = [
    'Took 12 hours of barista classes',
    'Received positive customer surveys',
    'Received positive teacher feedback'
  ],
  duration = '2 Days',
  evidence = [
    'Video of the Perfect Pour',
    'Coffee Portfolio',
    'Training Campus Certification',
    'Scent training',
    'IMG_0624',
    'Tamping',
    'IMG_0640'
  ],
  width = '195px',
  height = '410px',
  rotation = 'rotate(0deg)',
  image = '/coffee.jpeg',
  showPlayButton = true,
  showTimer = true,
  showDuration = true,
  showEvidence = true
}: CardProps) => {
  // Responsive sizing based on width prop
  const isSmallCard = width === '160px'
  const cardFontSizes = {
    title: isSmallCard ? '12px' : '14px',
    description: isSmallCard ? '8px' : '9px',
    criteria: isSmallCard ? '8px' : '9px',
    evidence: isSmallCard ? '8px' : '9px',
    label: isSmallCard ? '9px' : '10px'
  }
  return (
    <Box
      sx={{
        width,
        height,
        transform: rotation,
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid #003FE0',
        padding: '7.5px',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          height: '100%',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '3px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '1.5px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '1.5px'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Image src='/Badge.svg' alt='Badge' height={24} width={20} />
          <Typography
            sx={{
              color: '#202E5B',
              flex: 1,
              ml: '5.5px',
              fontFamily: 'Inter',
              fontSize: cardFontSizes.title,
              fontWeight: 700,
              letterSpacing: '0.12px',
              textTransform: 'capitalize'
            }}
          >
            {title}
          </Typography>
          <KeyboardDoubleArrowDownIcon sx={{ color: '#666', fontSize: '16px' }} />
        </Box>

        <Typography
          sx={{
            color: '#202E5B',
            fontFamily: 'Inter',
            fontSize: cardFontSizes.description,
            mb: 1,
            lineHeight: isSmallCard ? '10px' : '12px'
          }}
        >
          {description}
        </Typography>

        <Box
          sx={{
            position: 'relative',
            height: '100px',
            borderRadius: '6px',
            overflow: 'hidden',
            mb: 1
          }}
        >
          <Box
            component='img'
            src={image}
            alt='Card media'
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          {showPlayButton && (
            <Box
              component='img'
              src='/play-circle.svg'
              alt='Play'
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '28px',
                height: '28px',
                filter: 'drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.3))'
              }}
            />
          )}

          {showTimer && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '4px',
                left: '4px',
                background: '#003FE0',
                borderRadius: '4px',
                padding: '2px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '10px',
                  lineHeight: 1
                }}
              >
                1:36
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography
            sx={{
              color: '#000E40',
              fontSize: cardFontSizes.label,
              fontFamily: 'Inter',
              fontWeight: 400,
              mb: 0.25
            }}
          >
            Earning criteria:
          </Typography>
          {criteria.map((item, index) => (
            <Typography
              key={`criteria-${index}`}
              sx={{
                color: '#000E40',
                fontSize: cardFontSizes.criteria,
                fontFamily: 'Inter',
                fontWeight: 400,
                pl: 1,
                lineHeight: 1.2
              }}
            >
              • {item}
            </Typography>
          ))}
        </Box>

        {showDuration && (
          <Box sx={{ mb: 1 }}>
            <Typography
              sx={{
                color: '#000E40',
                fontSize: cardFontSizes.label,
                fontFamily: 'Inter',
                fontWeight: 400,
                mb: 0.25
              }}
            >
              Duration:
            </Typography>
            <Typography
              sx={{
                color: '#000E40',
                fontSize: cardFontSizes.criteria,
                fontFamily: 'Inter',
                pl: 1
              }}
            >
              • {duration}
            </Typography>
          </Box>
        )}

        {showEvidence && (
          <Box>
            <Typography
              sx={{
                color: '#000E40',
                fontSize: cardFontSizes.label,
                fontWeight: 400,
                fontFamily: 'Inter',
                mb: 0.25
              }}
            >
              Supporting Evidence:
            </Typography>
            {evidence.map((item, index) => (
              <Typography
                key={`evidence-${index}`}
                sx={{
                  color: '#000E40',
                  fontSize: cardFontSizes.evidence,
                  fontFamily: 'Inter',
                  pl: 1,
                  lineHeight: 1.2
                }}
              >
                •{' '}
                <span
                  style={{
                    color: '#003FE0',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  {item}
                </span>
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Card
