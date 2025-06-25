import React, { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import {
  addAnotherBoxStyles,
  addAnotherButtonStyles,
  addAnotherIconStyles
} from './Styles/appStyles'
import { handleUrlValidation } from '../utils/urlValidation'
import DeleteIcon from '@mui/icons-material/Delete'

interface LinkItem {
  id: string
  name: string
  url: string
}

interface LinkAdderProps {
  fields: LinkItem[]
  onAdd: () => void
  onRemove: (index: number) => void
  onNameChange: (index: number, value: string) => void
  onUrlChange: (index: number, value: string) => void
  maxLinks?: number
  errors?: Record<number, { name?: { message?: string }; url?: { message?: string } }>
  nameLabel?: string
  urlLabel?: string
  namePlaceholder?: string
  urlPlaceholder?: string
}

const LinkAdder: React.FC<LinkAdderProps> = ({
  fields,
  onAdd,
  onRemove,
  onNameChange,
  onUrlChange,
  maxLinks = 5,
  errors = {}
}) => {
  const theme = useTheme()
  const [urlErrors, setUrlErrors] = useState<string[]>([])

  const handleUrlValidationChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    handleUrlValidation(event, setUrlErrors, index, urlErrors)
    onUrlChange(index, event.target.value)
  }

  return (
    <>
      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          <Card
            sx={{
              width: '100%',
              bgcolor: 'white',
              borderRadius: 2
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 4, display: 'flex', gap: '15px', alignItems: 'center' }}>
                {/* URL Input */}
                <Typography
                  variant='body1'
                  component='label'
                  htmlFor='url'
                  sx={{ fontWeight: 500, color: 'gray.700', display: 'block', mb: 1 }}
                >
                  URL
                </Typography>
                <TextField
                  id='url'
                  value={field.url}
                  onChange={e => handleUrlValidationChange(e, index)}
                  fullWidth
                  variant='outlined'
                  placeholder='www.example.com'
                  InputProps={{
                    sx: { bgcolor: 'blue.50', borderRadius: 1 }
                  }}
                  aria-labelledby={`url-label-${index}`}
                  error={!!errors[index]?.url}
                  helperText={urlErrors[index]}
                />
              </Box>

              {/* Title Input */}
              <Box sx={{ mb: 4, display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Typography
                  variant='body1'
                  component='label'
                  htmlFor='title'
                  sx={{ fontWeight: 500, color: 'gray.700', display: 'block', mb: 1 }}
                >
                  Title
                </Typography>
                <TextField
                  id='title'
                  value={field.name}
                  onChange={e => onNameChange(index, e.target.value)}
                  fullWidth
                  variant='outlined'
                  placeholder='Give this URL a clear name'
                  aria-labelledby={`name-label-${index}`}
                  error={!!errors[index]?.name}
                  helperText={errors[index]?.name?.message}
                />
              </Box>
            </CardContent>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                bgcolor: '#242c41',
                p: 2,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8
              }}
            >
              <IconButton sx={{ color: 'white', '&:hover': { bgcolor: 'slate.800' } }}>
                <DeleteIcon type='button' onClick={() => onRemove(index)} />
              </IconButton>
            </Box>
          </Card>
        </React.Fragment>
      ))}
      {fields.length < maxLinks && fields.length !== 0 && (
        <Box sx={addAnotherBoxStyles}>
          <Button
            type='button'
            onClick={onAdd}
            sx={addAnotherButtonStyles(theme)}
            endIcon={
              <Box sx={addAnotherIconStyles}>
                <AddIcon />
              </Box>
            }
          >
            Add another
          </Button>
        </Box>
      )}
    </>
  )
}

export default LinkAdder
