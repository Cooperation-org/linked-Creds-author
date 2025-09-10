'use client'
import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Link as MuiLink
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import HelpIcon from '@mui/icons-material/Help'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTheme } from '@mui/material/styles'

interface QuickHelpCardProps {
  title: string
  steps: string[]
  tips?: string[]
  helpLink?: string
}

const QuickHelpCard: React.FC<QuickHelpCardProps> = ({ 
  title, 
  steps, 
  tips = [], 
  helpLink = '/help' 
}) => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  return (
    <Card 
      elevation={2} 
      sx={{ 
        mb: 2, 
        border: `1px solid ${theme.palette.primary.light}`,
        borderRadius: 2
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HelpIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              {title}
            </Typography>
          </Box>
          <IconButton onClick={toggleExpanded} size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        
        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Quick Steps:
            </Typography>
            <List dense>
              {steps.map((step, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={step}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
            
            {tips.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                  💡 Tips:
                </Typography>
                <List dense>
                  {tips.map((tip, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary={tip}
                        primaryTypographyProps={{ variant: 'body2', fontStyle: 'italic' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button 
                component={MuiLink}
                href={helpLink}
                variant="outlined"
                size="small"
                sx={{ textTransform: 'none' }}
              >
                View Full Help Guide
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}

export default QuickHelpCard
