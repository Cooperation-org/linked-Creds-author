'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Box } from '@mui/material'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import { useSession } from 'next-auth/react'

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

interface EvidencePreviewProps {
  readonly url: string
  readonly width?: number
  readonly height?: number
  readonly isPreviewMode?: boolean
}
function extractDriveFileId(url: string): string | undefined {
  const matchIdParam = /[?&]id=([^&]+)/.exec(url)
  if (matchIdParam) return matchIdParam[1]
  const matchFilePath = /\/file\/d\/([^/]+)/.exec(url)
  if (matchFilePath) return matchFilePath[1]
  return undefined
}

function getDriveViewUrl(fileId: string) {
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

export default function EvidencePreview({
  url,
  width = 180,
  height = 150,
  isPreviewMode = false
}: EvidencePreviewProps) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken
  const [thumbnailUrl, setThumbnailUrl] = useState(url)
  const [loading, setLoading] = useState(true)
  const fileId = extractDriveFileId(url)

  const getMimeType = useCallback(async (id: string, token: string) => {
    const resp = await fetch(`/api/drive-metadata?fileId=${id}&access_token=${token}`)
    if (!resp.ok) {
      throw new Error(`Failed to fetch metadata (status: ${resp.status})`)
    }
    const data = await resp.json()
    return data.mimeType as string
  }, [])

  const generatePDFThumbnail = useCallback(
    async (id: string, token: string) => {
      try {
        const resp = await fetch(`/api/pdf-proxy?fileId=${id}&access_token=${token}`)
        if (!resp.ok) {
          throw new Error(`Failed to fetch PDF (status: ${resp.status})`)
        }
        const pdfData = await resp.arrayBuffer()
        const pdfTask = getDocument({ data: pdfData })
        const pdf = await pdfTask.promise
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 1 })
        const scale = Math.min(
          (width ?? 180) / viewport.width,
          (height ?? 150) / viewport.height
        )
        const scaledViewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = scaledViewport.width
        canvas.height = scaledViewport.height
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Could not get 2D context for PDF canvas')
        await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise
        setThumbnailUrl(canvas.toDataURL())
      } catch {
        setThumbnailUrl('/fallback-pdf-thumbnail.png')
      } finally {
        setLoading(false)
      }
    },
    [width, height]
  )

  const generateVideoThumbnail = useCallback(
    async (id: string, token: string) => {
      try {
        const resp = await fetch(`/api/video-proxy?fileId=${id}&access_token=${token}`)
        if (!resp.ok) {
          throw new Error(`Failed to fetch video (status: ${resp.status})`)
        }
        const buffer = await resp.arrayBuffer()
        const blob = new Blob([buffer], { type: 'video/mp4' })
        const blobUrl = URL.createObjectURL(blob)
        const videoEl = document.createElement('video')
        videoEl.src = blobUrl
        await new Promise<void>((resolve, reject) => {
          videoEl.addEventListener(
            'loadeddata',
            () => {
              videoEl.currentTime = 1
              resolve()
            },
            { once: true }
          )
          videoEl.addEventListener('error', e => reject(new Error(`Video error: ${e}`)))
        })
        await new Promise<void>((resolve, reject) => {
          videoEl.addEventListener('seeked', () => resolve(), { once: true })
          videoEl.addEventListener('error', e =>
            reject(new Error(`Video seek error: ${e}`))
          )
        })
        const canvas = document.createElement('canvas')
        canvas.width = videoEl.videoWidth
        canvas.height = videoEl.videoHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Could not get 2D context for video canvas')
        ctx.drawImage(videoEl, 0, 0)
        const scale = Math.min(
          (width ?? 180) / videoEl.videoWidth,
          (height ?? 150) / videoEl.videoHeight
        )
        const scaledW = Math.floor(videoEl.videoWidth * scale)
        const scaledH = Math.floor(videoEl.videoHeight * scale)
        const scaledCanvas = document.createElement('canvas')
        scaledCanvas.width = scaledW
        scaledCanvas.height = scaledH
        const sctx = scaledCanvas.getContext('2d')
        if (!sctx) throw new Error('Could not get 2D context for scaled video canvas')
        sctx.drawImage(canvas, 0, 0, scaledW, scaledH)
        setThumbnailUrl(scaledCanvas.toDataURL())
      } catch {
        setThumbnailUrl('/fallback-video.png')
      } finally {
        setLoading(false)
      }
    },
    [width, height]
  )

  useEffect(() => {
    if (!fileId || !url.includes('drive.google.com') || !accessToken) {
      setThumbnailUrl(url)
      setLoading(false)
      return
    }
    const handleFile = async () => {
      try {
        const mimeType = await getMimeType(fileId, accessToken)
        if (mimeType === 'application/pdf') {
          await generatePDFThumbnail(fileId, accessToken)
        } else if (mimeType.startsWith('video/')) {
          await generateVideoThumbnail(fileId, accessToken)
        } else {
          setThumbnailUrl(getDriveViewUrl(fileId))
          setLoading(false)
        }
      } catch {
        setThumbnailUrl(getDriveViewUrl(fileId))
        setLoading(false)
      }
    }
    void handleFile()
  }, [
    fileId,
    url,
    accessToken,
    getMimeType,
    generatePDFThumbnail,
    generateVideoThumbnail
  ])

  function handleImageError() {
    console.warn('Thumbnail failed to load.')
  }

  return (
    <Box
      sx={{
        width,
        height,
        position: 'relative',
        borderRadius: '10px',
        overflow: 'hidden'
      }}
    >
      <Image
        src={thumbnailUrl}
        alt='Evidence Preview'
        width={isPreviewMode ? width : 500}
        height={isPreviewMode ? height : 300}
        style={{
          borderRadius: '10px',
          objectFit: 'cover'
        }}
        onError={handleImageError}
      />
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          Loading...
        </Box>
      )}
    </Box>
  )
}
