'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Box, Typography, styled, Card } from '@mui/material'
import { useDropzone } from 'react-dropzone'

import FileListDisplay from '../../../components/FileList'
import { GoogleDriveStorage, uploadToGoogleDrive } from '@cooperation/vc-storage'
import useGoogleDrive from '../../../hooks/useGoogleDrive'
import { useStepContext } from '../StepContext'
import LoadingOverlay from '../../../components/Loading/LoadingOverlay'
import { TasksVector, SVGUplaodLink, SVGUploadMedia } from '../../../Assets/SVGs'
import { StepTrackShape } from '../fromTexts & stepTrack/StepTrackShape'
import { FileItem } from '../types/Types'
import LinkAdder from '../../../components/LinkAdder'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

interface LinkItem {
  id: string
  name: string
  url: string
}

interface PortfolioItem {
  name: string
  url: string
  googleId?: string
}

interface FileUploadAndListProps {
  readonly setValue: (field: string, value: any, options?: any) => void
  readonly selectedFiles: readonly FileItem[]
  readonly setSelectedFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
  readonly watch: <T>(name: string) => T
}

const StyledTipBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '24px',
  width: '100%',
  maxWidth: '800px',
  gap: '1rem',
  marginTop: theme.spacing(2),
  backgroundColor: '#D1E4FF',
  padding: '0.6rem 1rem',
  borderRadius: '1rem'
}))

const FileUploadAndList: React.FC<FileUploadAndListProps> = ({
  setValue,
  selectedFiles,
  setSelectedFiles,
  watch
}) => {
  const { loading, setUploadImageFn } = useStepContext()
  const [showLinkAdder, setShowLinkAdder] = useState(false)
  const [showMediaAdder, setShowMediaAdder] = useState(false)
  const { storage } = useGoogleDrive()
  const [files, setFiles] = useState<FileItem[]>([...selectedFiles])
  const [links, setLinks] = useState<LinkItem[]>([
    { id: crypto.randomUUID(), name: '', url: '' }
  ])
  const maxFiles = 10
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }
  useEffect(() => {
    setFiles([...selectedFiles])
  }, [selectedFiles])
  const handleFilesSelected = useCallback(
    (newFiles: FileItem[]) => {
      setFiles(newFiles)
      setSelectedFiles(newFiles)
    },
    [setSelectedFiles]
  )

  const handleReorder = useCallback(
    (reorderedFiles: FileItem[]) => {
      // Update local state
      setFiles(reorderedFiles)
      setSelectedFiles(reorderedFiles)

      // Update portfolio items order in form
      const currentPortfolio = watch<PortfolioItem[]>('portfolio') || []
      const newPortfolioOrder = reorderedFiles
        .filter(file => file.googleId) // Only include uploaded files
        .map(file => ({
          name: file.name,
          url: `https://drive.google.com/uc?export=view&id=${file.googleId}`,
          googleId: file.googleId
        }))

      // If there's a featured file (first in the list), update the evidenceLink
      if (reorderedFiles[0]?.googleId) {
        setValue(
          'evidenceLink',
          `https://drive.google.com/uc?export=view&id=${reorderedFiles[0].googleId}`
        )
      }

      // Update the portfolio with the new order
      setValue('portfolio', newPortfolioOrder)
    },
    [setValue, watch, setSelectedFiles]
  )

  const handleUpload = useCallback(async () => {
    try {
      if (selectedFiles.length === 0) return
      const filesToUpload = selectedFiles.filter(
        fileItem => !fileItem.uploaded && fileItem.file && fileItem.name
      )
      if (filesToUpload.length === 0) return
      const uploadedFiles = await Promise.all(
        filesToUpload.map(async (fileItem, index) => {
          const newFile = new File([fileItem.file], fileItem.name, {
            type: fileItem.file.type
          })
          const uploadedFile = await storage?.uploadBinaryFile({
            file: newFile
          })
          const fileId = (uploadedFile as { id: string }).id
          return {
            ...fileItem,
            googleId: fileId,
            uploaded: true,
            isFeatured: index === 0 && !watch<string>('evidenceLink')
          }
        })
      )
      const featuredFile = uploadedFiles.find(file => file.isFeatured)
      if (featuredFile?.googleId) {
        setValue(
          'evidenceLink',
          `https://drive.google.com/uc?export=view&id=${featuredFile.googleId}`
        )
      }
      const currentPortfolio = watch<PortfolioItem[]>('portfolio') || []
      const newPortfolioEntries: PortfolioItem[] = uploadedFiles.map(file => ({
        name: file.name,
        url: `https://drive.google.com/uc?export=view&id=${file.googleId}`,
        googleId: file.googleId
      }))
      setValue('portfolio', [...currentPortfolio, ...newPortfolioEntries])
      setSelectedFiles(prevFiles =>
        prevFiles.map(file => {
          const uploadedFile = uploadedFiles.find(f => f.name === file.name)
          return uploadedFile
            ? { ...file, googleId: uploadedFile.googleId, uploaded: true }
            : file
        })
      )
    } catch (error) {
      console.error('Error uploading files:', error)
    }
  }, [selectedFiles, setValue, setSelectedFiles, storage, watch])
  const handleAddLink = useCallback(() => {
    setLinks(prev => [...prev, { id: crypto.randomUUID(), name: '', url: '' }])
  }, [])
  const handleRemoveLink = useCallback(
    (index: number) => {
      setLinks(prev => prev.filter((_, i) => i !== index))
      const currentPortfolio = watch<PortfolioItem[]>('portfolio') || []
      setValue(
        'portfolio',
        currentPortfolio.filter((_, i) => i !== index)
      )
    },
    [setValue, watch]
  )
  const handleLinkChange = useCallback(
    (index: number, field: 'name' | 'url', value: string) => {
      setLinks(prev =>
        prev.map((link, i) => (i === index ? { ...link, [field]: value } : link))
      )
      const currentPortfolio = watch<PortfolioItem[]>('portfolio') || []
      const updatedPortfolio = [...currentPortfolio]
      updatedPortfolio[index] = { ...updatedPortfolio[index], [field]: value }
      setValue('portfolio', updatedPortfolio)
    },
    [setValue, watch]
  )
  const handleNameChange = useCallback(
    (id: string, newName: string) => {
      const updateFiles = (prevFiles: FileItem[]) =>
        prevFiles.map(file => (file.id === id ? { ...file, name: newName } : file))
      setFiles(updateFiles)
      setSelectedFiles(updateFiles)
    },
    [setSelectedFiles]
  )
  const setAsFeatured = useCallback(
    (id: string) => {
      const updateFiles = (prevFiles: FileItem[]) =>
        prevFiles
          .map(file => ({ ...file, isFeatured: file.id === id }))
          .sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1))
      setFiles(updateFiles)
      setSelectedFiles(updateFiles)
    },
    [setSelectedFiles]
  )
  const handleDelete = useCallback(
    (event: React.MouseEvent, id: string) => {
      event.stopPropagation()
      let isFeaturedFileDeleted = false
      setFiles(prevFiles => {
        const updatedFiles = prevFiles.filter(
          file => file.googleId !== id && file.id !== id
        )
        isFeaturedFileDeleted = prevFiles[0]?.googleId === id || prevFiles[0]?.id === id
        if (isFeaturedFileDeleted && updatedFiles.length > 0) {
          updatedFiles[0].isFeatured = true
        }
        return updatedFiles
      })
      setSelectedFiles(prevFiles =>
        prevFiles.filter(file => file.googleId !== id && file.id !== id)
      )
      const currentPortfolio = watch<PortfolioItem[]>('portfolio') || []
      let updatedPortfolio = currentPortfolio.filter(file => file.googleId !== id)
      const newFeaturedFile = files[1]
      if (isFeaturedFileDeleted && newFeaturedFile?.googleId) {
        setValue(
          'evidenceLink',
          `https://drive.google.com/uc?export=view&id=${newFeaturedFile.googleId}`
        )
        updatedPortfolio = updatedPortfolio.filter(
          file => file.googleId !== newFeaturedFile.googleId
        )
      }
      setValue('portfolio', updatedPortfolio)
    },
    [setValue, watch, files, setSelectedFiles]
  )
  useEffect(() => {
    // @ts-ignore-next-line
    setUploadImageFn(() => handleUpload)
  }, [handleUpload, setUploadImageFn])

  // Drag and drop functionality
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} files.`)
        return
      }

      const isAnyFileFeatured = files.some(file => file.isFeatured)
      let hasSetFeatured = isAnyFileFeatured

      const processFile = (file: File) => {
        return new Promise<FileItem>(resolve => {
          const reader = new FileReader()
          reader.onload = e => {
            const newFileItem: FileItem = {
              id: crypto.randomUUID(),
              file: file,
              name: file.name,
              url: e.target?.result as string,
              isFeatured: !hasSetFeatured && files.length === 0,
              uploaded: false,
              fileExtension: file.name.split('.').pop() ?? ''
            }

            if (newFileItem.isFeatured) hasSetFeatured = true
            resolve(newFileItem)
          }
          reader.readAsDataURL(file)
        })
      }

      Promise.all(acceptedFiles.map(processFile)).then(newFileItems => {
        const updatedFiles = [...files]
        newFileItems.forEach(newFile => {
          const duplicateIndex = updatedFiles.findIndex(f => f.name === newFile.name)
          if (duplicateIndex !== -1) {
            updatedFiles[duplicateIndex] = newFile
          } else {
            if (newFile.isFeatured) {
              updatedFiles.unshift(newFile)
            } else {
              updatedFiles.push(newFile)
            }
          }
        })
        handleFilesSelected(updatedFiles)
      })
    },
    [files, handleFilesSelected]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': [],
      'video/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'text/*': []
    },
    noClick: true
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files
    if (newFiles) {
      if (files.length + newFiles.length > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} files.`)
        return
      }

      const filesArray = Array.from(newFiles)
      const isAnyFileFeatured = files.some(file => file.isFeatured)
      let hasSetFeatured = isAnyFileFeatured

      const processFile = (file: File) => {
        return new Promise<FileItem>(resolve => {
          const reader = new FileReader()
          reader.onload = e => {
            const newFileItem: FileItem = {
              id: crypto.randomUUID(),
              file: file,
              name: file.name,
              url: e.target?.result as string,
              isFeatured: !hasSetFeatured && files.length === 0,
              uploaded: false,
              fileExtension: file.name.split('.').pop() ?? ''
            }

            if (newFileItem.isFeatured) hasSetFeatured = true
            resolve(newFileItem)
          }
          reader.readAsDataURL(file)
        })
      }

      Promise.all(filesArray.map(processFile)).then(newFileItems => {
        const updatedFiles = [...files]
        newFileItems.forEach(newFile => {
          const duplicateIndex = updatedFiles.findIndex(f => f.name === newFile.name)
          if (duplicateIndex !== -1) {
            updatedFiles[duplicateIndex] = newFile
          } else {
            if (newFile.isFeatured) {
              updatedFiles.unshift(newFile)
            } else {
              updatedFiles.push(newFile)
            }
          }
        })
        handleFilesSelected(updatedFiles)
      })
    }
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        gap: '24px'
      }}
    >
      <TasksVector />

      <Typography sx={{ fontFamily: 'Lato', fontSize: '24px', fontWeight: 400 }}>
        Step 3
      </Typography>
      <Typography
        sx={{
          fontFamily: 'Lato',
          fontSize: '16px',
          fontWeight: 400,
          maxWidth: '360px',
          textAlign: 'center'
        }}
      >
        Do you have any supporting documentation or links that you would like to add?{' '}
      </Typography>

      <StepTrackShape />

      <Box
        display='flex'
        flexDirection='column'
        bgcolor='#FFFFFF'
        gap={3}
        borderRadius={2}
        width='100%'
      >
        {/* Add Links Section */}

        <CardStyle variant='outlined' onClick={() => setShowLinkAdder(true)}>
          {showLinkAdder && (
            <Box mb={3} width='100%'>
              <LinkAdder
                fields={links}
                onAdd={handleAddLink}
                onRemove={handleRemoveLink}
                onNameChange={(index, value) => handleLinkChange(index, 'name', value)}
                onUrlChange={(index, value) => handleLinkChange(index, 'url', value)}
                maxLinks={5}
                nameLabel='Name'
                urlLabel='URL'
                namePlaceholder='(e.g., LinkedIn profile, github repo, etc.)'
                urlPlaceholder='https://'
              />{' '}
            </Box>
          )}
          <SVGUplaodLink />
          <Typography variant='body1' color='primary' align='center'>
            + Add links
            <br />
            (social media, articles, your website, etc.)
          </Typography>
        </CardStyle>

        {/* Add Media Section */}
        <Box width='100%'>
          <CardStyle variant='outlined' {...getRootProps()} isDragActive={isDragActive}>
            <input {...getInputProps()} />
            <FileListDisplay
              files={[...selectedFiles]}
              onDelete={handleDelete}
              onNameChange={handleNameChange}
              onSetAsFeatured={setAsFeatured}
              onReorder={handleReorder}
            />

            <Box onClick={open} sx={{ textAlign: 'center', cursor: 'pointer' }}>
              <SVGUploadMedia />
              <Typography variant='body1' color='primary' align='center'>
                {isDragActive ? (
                  'Drop files here...'
                ) : (
                  <>
                    + Add media
                    <br />
                    (images, documents, video)
                  </>
                )}
              </Typography>
            </Box>
          </CardStyle>
        </Box>
      </Box>

      <LoadingOverlay text='Uploading files...' open={loading} />
    </Box>
  )
}
const CardStyle = styled(Card)<{ isDragActive?: boolean }>(
  ({ isDragActive = false }) => ({
    padding: '40px 20px',
    cursor: 'default',
    width: '100%',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    p: 4,
    borderRadius: 2,
    gap: 2,
    border: isDragActive ? '2px dashed #2563EB' : '2px dashed #ccc',
    backgroundColor: isDragActive ? '#f0f9ff' : 'transparent',
    '&:hover': {
      borderColor: '#2563EB'
    }
  })
)

export default FileUploadAndList
