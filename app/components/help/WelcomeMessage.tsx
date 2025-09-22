'use client'
import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Link as MuiLink
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddIcon from '@mui/icons-material/Add'
import ShareIcon from '@mui/icons-material/Share'
import RecommendIcon from '@mui/icons-material/Recommend'
import { useTheme } from '@mui/material/styles'

const WelcomeMessage: React.FC = () => {
  const theme = useTheme()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const features = [
    {
      icon: <AddIcon />,
      title: 'Create Skills',
      description: 'Document any skill or experience with evidence'
    },
    {
      icon: <RecommendIcon />,
      title: 'Get Recommendations',
      description: 'Request validation from trusted contacts'
    },
    {
      icon: <ShareIcon />,
      title: 'Share Credentials',
      description: 'Showcase verified skills to employers'
    }
  ]

  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.primary.main}05)`
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2
          }}
        >
          <Typography
            variant='h5'
            sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
          >
            🎉 Welcome to LinkedCreds!
          </Typography>
          <IconButton
            size='small'
            onClick={() => setDismissed(true)}
            sx={{ color: theme.palette.text.secondary }}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>

        <Typography variant='body1' sx={{ mb: 3, color: theme.palette.text.secondary }}>
          You&apos;re now ready to create verifiable credentials that showcase your unique
          skills and experiences. Here&apos;s what you can do:
        </Typography>

        <List dense>
          {features.map((feature, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
                {feature.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                }
                secondary={feature.description}
                secondaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            component={MuiLink}
            href='/credentialForm'
            variant='contained'
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': { backgroundColor: theme.palette.primary.dark },
              textTransform: 'none'
            }}
          >
            Create Your First Skill
          </Button>
          <Button
            component={MuiLink}
            href='/help'
            variant='outlined'
            sx={{ textTransform: 'none' }}
          >
            View Help Guide
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default WelcomeMessage
