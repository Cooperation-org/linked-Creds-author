'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { getFileViaFirebase } from '../../firebase/storage'

export default function CredentialRawPage() {
  const [rawCredential, setRawCredential] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [viewType, setViewType] = useState<'formatted' | 'raw'>('formatted')

  const params = useParams()
  // Extract the full file ID from the URL path
  const getFullFileId = useCallback((): string => {
    if (!params.fileId) return ''

    // Handle both string and array types for params.fileId
    const fileId = Array.isArray(params.fileId)
      ? params.fileId.join('/')
      : (params.fileId as string)

    return fileId
  }, [params])

  // Extract Google Drive ID if needed
  const extractGoogleDriveId = (url: string): string => {
    // Handle Google Drive file links
    const fileRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/
    const fileMatch = url.match(fileRegex)
    if (fileMatch && fileMatch[1]) {
      return fileMatch[1]
    }

    // Handle Google Drive folder links
    const folderRegex = /drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/i
    const folderMatch = url.match(folderRegex)
    if (folderMatch && folderMatch[1]) {
      return folderMatch[1]
    }

    // If not a Google Drive link or different format, return the original
    return url
  }

  useEffect(() => {
    const extractRawCredential = async () => {
      const fullFileId = getFullFileId()

      if (!fullFileId) {
        setError('File ID is missing')
        setLoading(false)
        return
      }

      try {
        // Extract the actual file ID if it's a Google Drive link
        const actualFileId = extractGoogleDriveId(fullFileId)

        console.log('Using file ID:', actualFileId)
        const fileData = await getFileViaFirebase(actualFileId)
        console.log('🚀 ~ extractRawCredential ~ fileData:', fileData.body)
        const vcJSON = JSON.parse(fileData.body)
        setRawCredential(vcJSON)
      } catch (err) {
        setError('Failed to extract raw credential')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    extractRawCredential()
  }, [getFullFileId])

  // Function to download JSON file
  const downloadJson = () => {
    if (!rawCredential) return

    // Create a Blob with the JSON data
    const blob = new Blob([JSON.stringify(rawCredential, null, 2)], {
      type: 'application/json'
    })

    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    // Create a temporary anchor element
    const a = document.createElement('a')
    a.href = url
    a.download = `credential-${getFullFileId()}.json`

    // Trigger the download
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-xl'>Loading credential...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-red-500 text-xl'>Error: {error}</div>
      </div>
    )
  }

  return (
    <div>
      <h2 className=''>Raw Credential</h2>

      <div className='flex'>
        <button
          onClick={() => setViewType('formatted')}
          className={`px-4 py-2 rounded ${viewType === 'formatted' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          style={{ marginInline: '0 10px' }}
        >
          Formatted View
        </button>

        <button
          onClick={() => setViewType('raw')}
          className={`px-4 py-2 rounded ${viewType === 'raw' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          style={{ marginInline: '0 10px' }}
        >
          Raw View
        </button>

        <button onClick={downloadJson}>Download JSON</button>
      </div>

      {viewType === 'formatted' ? (
        <pre>{JSON.stringify(rawCredential, null, 2)}</pre>
      ) : (
        <div>{JSON.stringify(rawCredential)}</div>
      )}
    </div>
  )
}
