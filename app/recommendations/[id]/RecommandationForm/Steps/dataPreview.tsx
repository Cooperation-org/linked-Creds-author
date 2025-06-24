'use client'

import React, { useState } from 'react'
import { Box, Card, Link, Typography, IconButton, TextField } from '@mui/material'
import { Edit } from 'lucide-react'
import { QuoteSVG } from '../../../../Assets/SVGs'
import LoadingOverlay from '../../../../components/Loading/LoadingOverlay'

interface Portfolio {
  name: string
  url: string
}

interface FormData {
  fullName?: string
  howKnow?: string
  recommendationText?: string
  qualifications?: string
  explainAnswer?: string
  portfolio?: Portfolio[]
}

interface DataPreviewProps {
  formData: FormData
  fullName: string
  handleNext: () => void
  handleBack: () => void
  handleSign: () => void
  isLoading: boolean
  onUpdateFormData: (newData: any) => void
  selectedFiles?: any[]
}

const cleanHTML = (htmlContent: any): string => {
  if (typeof htmlContent !== 'string') {
    return ''
  }
  return htmlContent
    .replace(/<p><br><\/p>/g, '')
    .replace(/<p><\/p>/g, '')
    .replace(/<br>/g, '')
    .replace(/class="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')
}

const EditableCard = ({
  title,
  content,
  onSave,
  multiline = false,
  icon,
  isQuote = false
}: {
  title: string
  content: string
  onSave: (newContent: string) => void
  multiline?: boolean
  icon?: React.ReactNode
  isQuote?: boolean
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)

  const handleBlur = () => {
    setIsEditing(false)
    if (editedContent !== content) {
      onSave(editedContent)
    }
  }

  return (
    <Card
      variant='outlined'
      sx={{
        p: '10px',
        mb: '10px',
        mt: title === 'Your name' ? '10px' : '0px',
        border: '1px solid #003fe0',
        borderRadius: '10px'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}
      >
        <Typography
          variant='subtitle1'
          sx={{
            fontWeight: 'bold',
            fontSize: '15px',
            letterSpacing: '0.01em'
          }}
        >
          {title}
        </Typography>
        <IconButton
          size='small'
          onClick={() => setIsEditing(true)}
          sx={{
            ml: 1,
            padding: '4px',
            '&:hover': {
              backgroundColor: 'rgba(0, 63, 224, 0.04)'
            }
          }}
        >
          <Edit size={16} color='#003fe0' />
        </IconButton>
      </Box>

      {isEditing ? (
        <TextField
          fullWidth
          multiline={multiline}
          minRows={multiline ? 3 : 1}
          value={editedContent}
          onChange={e => setEditedContent(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          variant='outlined'
          size='small'
          sx={{
            mt: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#003fe0'
              },
              '&:hover fieldset': {
                borderColor: '#003fe0'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#003fe0'
              }
            }
          }}
        />
      ) : (
        <>
          {title === 'Your name' ? (
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: '700',
                ml: '5px',
                letterSpacing: '0.01em',
                position: 'relative'
              }}
            >
              {content}
            </Typography>
          ) : (
            <Box display='flex' alignItems={isQuote ? 'center' : 'flex-start'}>
              {icon && icon}
              <Typography
                variant='body2'
                sx={{
                  ml: isQuote ? 1 : 0,
                  fontSize: '15px',
                  lineHeight: '24px',
                  color: isQuote ? '#202e5b' : '#000e40',
                  letterSpacing: '0.01em',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line',
                  overflowWrap: 'anywhere'
                }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(content)
                  }}
                />
              </Typography>
            </Box>
          )}
        </>
      )}
    </Card>
  )
}

const DataPreview: React.FC<DataPreviewProps> = ({
  formData,
  isLoading,
  onUpdateFormData,
  selectedFiles = []
}) => {
  const handleUpdateField = (field: keyof FormData, value: string) => {
    onUpdateFormData({
      ...formData,
      [field]: value
    })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        bgcolor: '#f0f4f8',
        borderRadius: 2
      }}
    >
      <Box
        sx={{
          width: '100%',
          bgcolor: 'white',
          p: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          borderRadius: 2
        }}
      >
        {typeof formData.fullName === 'string' && (
          <EditableCard
            title='Your name'
            content={formData.fullName}
            onSave={value => handleUpdateField('fullName', value)}
          />
        )}

        {typeof formData.howKnow === 'string' && formData.howKnow.trim() && (
          <EditableCard
            title='How They Know Each Other'
            content={formData.howKnow}
            onSave={value => handleUpdateField('howKnow', value)}
            multiline
          />
        )}

        {typeof formData.recommendationText === 'string' &&
          formData.recommendationText.trim() && (
            <EditableCard
              title='Recommendation'
              content={formData.recommendationText}
              onSave={value => handleUpdateField('recommendationText', value)}
              multiline
            />
          )}

        {typeof formData.qualifications === 'string' &&
          formData.qualifications.trim() && (
            <EditableCard
              title='Your Qualifications'
              content={formData.qualifications}
              onSave={value => handleUpdateField('qualifications', value)}
              multiline
            />
          )}

        {typeof formData.explainAnswer === 'string' && formData.explainAnswer.trim() && (
          <EditableCard
            title='Additional Information'
            content={formData.explainAnswer}
            onSave={value => handleUpdateField('explainAnswer', value)}
            multiline
            icon={<QuoteSVG />}
            isQuote={true}
          />
        )}

        {(Array.isArray(formData.portfolio) &&
          formData.portfolio.filter(item => item.name || item.url).length > 0) ||
        selectedFiles.length > 0 ? (
          <Card
            variant='outlined'
            sx={{
              p: '10px',
              border: '1px solid #003fe0',
              borderRadius: '10px'
            }}
          >
            <Typography
              variant='subtitle1'
              sx={{
                fontWeight: 'bold',
                fontSize: '15px',
                letterSpacing: '0.01em'
              }}
            >
              Supporting Evidence
            </Typography>
            {selectedFiles.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '15px',
                  mt: 2,
                  mb: 2
                }}
              >
                {selectedFiles.map(file => (
                  <Box
                    key={file.id}
                    sx={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s'
                      }
                    }}
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <img
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      src={file.url}
                      alt={file.name}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {formData.portfolio
              ?.filter(item => item.name || item.url)
              .map((item, index) => (
                <Box key={`portfolio-item-${index}`} sx={{ mt: 1 }}>
                  {item.name && item.url ? (
                    <Link
                      href={item.url}
                      underline='hover'
                      color='primary'
                      sx={{
                        fontSize: '15px',
                        textDecoration: 'underline',
                        color: '#003fe0'
                      }}
                      target='_blank'
                    >
                      {item.name}
                    </Link>
                  ) : null}
                </Box>
              ))}
          </Card>
        ) : null}
      </Box>

      <LoadingOverlay text='Saving your recommendation...' open={isLoading} />
    </Box>
  )
}

export default DataPreview
