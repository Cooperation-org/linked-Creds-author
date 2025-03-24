/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import { Box, Typography, useMediaQuery, Theme } from '@mui/material'
import { FormData } from '../types/Types'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import {
  commonTypographyStyles,
  commonBoxStyles,
  evidenceListStyles
} from '../../../components/Styles/appStyles'
import { StepTrackShape } from '../fromTexts & stepTrack/StepTrackShape'

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
const isPDF = (fileName: string) => fileName.toLowerCase().endsWith('.pdf')
const isMP4 = (fileName: string) => fileName.toLowerCase().endsWith('.mp4')
const isGoogleDriveImageUrl = (url: string): boolean => {
  return /https:\/\/drive\.google\.com\/uc\?export=view&id=.+/.test(url)
}

const cleanHTML = (htmlContent: string) => {
  return htmlContent
    .replace(/<p><br><\/p>/g, '')
    .replace(/<p><\/p>/g, '')
    .replace(/<br>/g, '')
    .replace(/class="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')
}

interface DataPreviewProps {
  formData: FormData
  selectedFiles: {
    id: string
    name: string
    url: string
    isFeatured?: boolean
  }[]
}
const renderPDFThumbnail = async (fileUrl: string) => {
  try {
    const loadingTask = getDocument(fileUrl)
    const pdf = await loadingTask.promise
    const page = await pdf.getPage(1)
    const viewport = page.getViewport({ scale: 0.1 })
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (context) {
      canvas.height = viewport.height
      canvas.width = viewport.width
      await page.render({ canvasContext: context, viewport }).promise
      return canvas.toDataURL()
    }
  } catch (error) {
    console.error('Error rendering PDF thumbnail:', error)
  }
  return '/fallback-pdf-thumbnail.svg'
}

const generateVideoThumbnail = (videoUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = videoUrl
    video.addEventListener(
      'loadeddata',
      () => {
        video.currentTime = 1
      },
      { once: true }
    )
    video.addEventListener(
      'seeked',
      () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get 2D canvas context'))
          return
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataURL = canvas.toDataURL('image/png')
        resolve(dataURL)
      },
      { once: true }
    )

    video.addEventListener('error', e => {
      reject(e)
    })
  })
}

const DataPreview: React.FC<DataPreviewProps> = ({ formData, selectedFiles }) => {
  const theme: Theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('sm'))

  const [pdfThumbnails, setPdfThumbnails] = useState<Record<string, string>>({})
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>({})

  useEffect(() => {
    selectedFiles.forEach(async file => {
      if (isPDF(file.name) && !pdfThumbnails[file.id]) {
        const thumbnail = await renderPDFThumbnail(file.url)
        setPdfThumbnails(prev => ({ ...prev, [file.id]: thumbnail }))
      }

      if (isMP4(file.name) && !videoThumbnails[file.id]) {
        try {
          const thumbnail = await generateVideoThumbnail(file.url)
          setVideoThumbnails(prev => ({ ...prev, [file.id]: thumbnail }))
        } catch (error) {
          console.error('Error generating video thumbnail:', error)
          setVideoThumbnails(prev => ({
            ...prev,
            [file.id]: '/fallback-video.png'
          }))
        }
      }
    })
  }, [selectedFiles, pdfThumbnails, videoThumbnails])

  const handleNavigate = (url: string, target: string = '_self') => {
    window.open(url, target)
  }
  const shouldDisplayUrl = (url: string): boolean => {
    return !isGoogleDriveImageUrl(url)
  }

  const hasValidEvidence = formData.portfolio?.some(
    (porto: { name: string; url: string }) => porto.name && porto.url
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <Typography
        sx={{
          fontFamily: 'Lato',
          fontSize: '24px',
          fontWeight: 400,
          textAlign: 'center'
        }}
      >
        Here&apos;s what you&apos;ve created!
      </Typography>
      <StepTrackShape />
      <Box
        sx={{
          width: '100%',
          bgcolor: '#FFF',
          borderRadius: '8px',
          border: '1px solid #003FE0',
          p: '10px',
          gap: '20px'
        }}
      >
        <Box sx={commonBoxStyles}>
          <Typography
            sx={{
              ...commonTypographyStyles,
              fontSize: '24px',
              fontWeight: 700
            }}
          >
            {formData.credentialName}
          </Typography>
          {formData.credentialDescription && (
            <Box sx={commonTypographyStyles}>
              <span
                dangerouslySetInnerHTML={{
                  __html: cleanHTML(formData.credentialDescription)
                }}
              />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isLargeScreen ? 'row' : 'column',
            gap: isLargeScreen ? '20px' : '10px',
            mb: '10px'
          }}
        >
          {formData?.evidenceLink ? (
            selectedFiles.filter(f => f.isFeatured).length > 0 ? (
              selectedFiles
                .filter(f => f.isFeatured)
                .map(file => (
                  <Box key={file.id} sx={{ width: isLargeScreen ? '179px' : '100%' }}>
                    {isPDF(file.name) ? (
                      <img
                        style={{
                          borderRadius: '20px',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        src={pdfThumbnails[file.id] ?? '/fallback-pdf-thumbnail.svg'}
                        alt='PDF Preview'
                      />
                    ) : isMP4(file.name) ? (
                      <img
                        style={{
                          borderRadius: '20px',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        src={videoThumbnails[file.id] ?? '/fallback-video.png'}
                        alt='Video Thumbnail'
                      />
                    ) : (
                      <img
                        style={{
                          borderRadius: '20px',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        src={file.url}
                        alt='Certification Evidence'
                      />
                    )}
                  </Box>
                ))
            ) : (
              <Box sx={{ width: !isLargeScreen ? '100%' : '179px', height: '100%' }} />
            )
          ) : (
            <Box sx={{ width: !isLargeScreen ? '100%' : '179px', height: '100%' }} />
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Typography sx={commonTypographyStyles}>
            <span
              dangerouslySetInnerHTML={{
                __html: cleanHTML(formData?.description as string)
              }}
            />
          </Typography>
          {formData.credentialDuration && (
            <Typography sx={{ ...commonTypographyStyles, fontSize: '13px' }}>
              Duration:
              <br />
              <ul>
                <li style={{ marginLeft: '20px', width: 'fit-content' }}>
                  {formData.credentialDuration}
                </li>
              </ul>
            </Typography>
          )}

          {hasValidEvidence && (
            <Box sx={commonTypographyStyles}>
              <Typography sx={{ display: 'block' }}>Evidence:</Typography>
              <ul style={evidenceListStyles}>
                {formData.evidenceLink &&
                  shouldDisplayUrl(formData.evidenceLink as string) && (
                    <li
                      style={{ cursor: 'pointer', width: 'fit-content' }}
                      key={formData.evidenceLink}
                      onClick={() =>
                        handleNavigate(formData.evidenceLink as string, '_blank')
                      }
                    >
                      {formData.evidenceLink}
                    </li>
                  )}
                {formData.portfolio.map(
                  (porto: { name: string; url: string }) =>
                    porto.name &&
                    porto.url &&
                    (porto.name || shouldDisplayUrl(porto.url)) && (
                      <li
                        style={{ cursor: 'pointer', width: 'fit-content' }}
                        key={porto.url}
                        onClick={() => handleNavigate(porto.url, '_blank')}
                      >
                        {porto.name || porto.url}
                      </li>
                    )
                )}
              </ul>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default DataPreview
