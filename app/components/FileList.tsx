'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  styled,
  Card,
  CardContent,
  IconButton,
  TextField,
  Tooltip
} from '@mui/material'
import Image from 'next/image'
import { FileItem } from '../credentialForm/form/types/Types'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import StarIcon from '@mui/icons-material/Star'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

interface FileListProps {
  files: FileItem[]
  onDelete: (event: React.MouseEvent, id: string) => void
  onNameChange: (id: string, newName: string) => void
  onSetAsFeatured: (id: string) => void
  onReorder: (files: FileItem[]) => void
}

const FileListContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  paddingBottom: '20px',
  marginTop: '1rem',
  width: '100%'
})

const isImage = (f: string) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(f)
const isPDF = (f: string) => f.toLowerCase().endsWith('.pdf')
const isMP4 = (f: string) => f.toLowerCase().endsWith('.mp4')

const renderPDFThumbnail = async (file: FileItem) => {
  const pdf = await (await getDocument(file.url)).promise
  const page = await pdf.getPage(1)
  const vp = page.getViewport({ scale: 0.1 })
  const c = document.createElement('canvas')
  c.width = vp.width
  c.height = vp.height
  await page.render({ canvasContext: c.getContext('2d')!, viewport: vp }).promise
  return c.toDataURL()
}

const generateVideoThumbnail = (file: FileItem): Promise<string> =>
  new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = file.url
    video.addEventListener('loadeddata', () => (video.currentTime = 1), { once: true })
    video.addEventListener(
      'seeked',
      () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error())
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/png'))
      },
      { once: true }
    )
    video.addEventListener('error', () => reject(new Error()))
  })

const FileListDisplay: React.FC<FileListProps> = ({
  files,
  onDelete,
  onNameChange,
  onSetAsFeatured,
  onReorder
}) => {
  const [pdfThumbs, setPdfThumbs] = useState<Record<string, string>>({})
  const [vidThumbs, setVidThumbs] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')

  useEffect(() => {
    const generateThumbs = async () => {
      for (const f of files) {
        if (isPDF(f.name) && !pdfThumbs[f.id]) {
          const thumb = await renderPDFThumbnail(f)
          setPdfThumbs(prev => ({ ...prev, [f.id]: thumb }))
        }
        if (isMP4(f.name) && !vidThumbs[f.id]) {
          try {
            const thumb = await generateVideoThumbnail(f)
            setVidThumbs(prev => ({ ...prev, [f.id]: thumb }))
          } catch {
            setVidThumbs(prev => ({ ...prev, [f.id]: '/fallback-video.png' }))
          }
        }
      }
    }
    generateThumbs()
  }, [files, pdfThumbs, vidThumbs])

  const moveItem = (e: React.MouseEvent, idx: number, dir: 'up' | 'down') => {
    e.stopPropagation()

    const next = dir === 'up' ? idx - 1 : idx + 1
    if (next < 0 || next >= files.length) return

    const reordered = [...files]
    ;[reordered[idx], reordered[next]] = [reordered[next], reordered[idx]]

    reordered.forEach(f => (f.isFeatured = false))
    reordered[0].isFeatured = true
    onSetAsFeatured(reordered[0].id)

    onReorder(reordered)
  }

  const startEdit = (f: FileItem) => {
    setEditingId(f.id)
    setEditingValue(f.name.replace(/(\.[^/.]+)$/, ''))
  }

  const saveEdit = (f: FileItem) => {
    if (!editingValue.trim()) return setEditingId(null)
    const ext = f.name.split('.').pop() ?? ''
    onNameChange(f.id, `${editingValue.trim()}.${ext}`)
    setEditingId(null)
  }

  return (
    <FileListContainer>
      {files.map((f, idx) => {
        const ext = f.name.split('.').pop()
        const isEditing = editingId === f.id
        return (
          <Box key={f.id} sx={{ width: '100%' }}>
            <Card sx={{ width: '100%', bgcolor: 'white', borderRadius: 2 }}>
              <CardContent sx={{ p: 4, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {isImage(f.name) && (
                    <Image
                      src={f.url}
                      alt={f.name}
                      width={80}
                      height={80}
                      style={{ borderRadius: 8 }}
                    />
                  )}
                  {isPDF(f.name) && (
                    <Image
                      src={pdfThumbs[f.id] ?? '/fallback-pdf-thumbnail.svg'}
                      alt={f.name}
                      width={80}
                      height={80}
                      style={{ borderRadius: 8 }}
                    />
                  )}
                  {isMP4(f.name) && (
                    <Image
                      src={vidThumbs[f.id] ?? '/fallback-video.png'}
                      alt={f.name}
                      width={80}
                      height={80}
                      style={{ borderRadius: 8 }}
                    />
                  )}
                  {!isImage(f.name) && !isPDF(f.name) && !isMP4(f.name) && (
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: '#f3f3f3',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        color: '#666'
                      }}
                    >
                      FILE
                    </Box>
                  )}
                  <Box sx={{ flexGrow: 1 }}>
                    {isEditing ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          size='small'
                          value={editingValue}
                          onChange={e => setEditingValue(e.target.value)}
                          sx={{ width: '100%' }}
                        />
                        <Box>.{ext}</Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          wordBreak: 'break-all'
                        }}
                      >
                        {f.name}
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1,
                  bgcolor: '#242c41',
                  p: 2,
                  borderBottomLeftRadius: 2,
                  borderBottomRightRadius: 2
                }}
                onClick={e => e.stopPropagation()}
              >
                {idx === 0 && (
                  <Tooltip title='Featured media' arrow>
                    <IconButton sx={{ color: '#ffce31', cursor: 'default' }}>
                      <StarIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {isEditing ? (
                  <Tooltip title='Save file name' arrow>
                    <IconButton sx={{ color: 'white' }} onClick={() => saveEdit(f)}>
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title='Edit file name' arrow>
                    <IconButton sx={{ color: 'white' }} onClick={() => startEdit(f)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title='Delete media' arrow>
                  <IconButton
                    sx={{ color: 'white' }}
                    onClick={e => onDelete(e, f.googleId ?? f.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Move up' arrow>
                  <span>
                    <IconButton
                      sx={{ color: 'white' }}
                      onClick={e => moveItem(e, idx, 'up')}
                      disabled={idx === 0}
                    >
                      <KeyboardArrowUpIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title='Move down' arrow>
                  <span>
                    <IconButton
                      sx={{ color: 'white' }}
                      onClick={e => moveItem(e, idx, 'down')}
                      disabled={idx === files.length - 1}
                    >
                      <KeyboardArrowDownIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Card>
          </Box>
        )
      })}
    </FileListContainer>
  )
}

export default FileListDisplay
