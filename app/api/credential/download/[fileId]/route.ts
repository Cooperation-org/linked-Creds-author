// app/api/download/[fileId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getFileViaFirebase } from '../../../../firebase/storage'

export const dynamic = 'force-dynamic' // Makes the route dynamic instead of statically optimized

/**
 * Handles GET requests to download files
 *
 * @param request - The incoming request
 * @param params - URL parameters, including fileId
 * @returns JSON response with file data or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  const { fileId } = params
  console.log('🚀 ~ fileId:', fileId)

  if (!fileId) {
    return NextResponse.json({ error: 'File ID is missing' }, { status: 400 })
  }

  try {
    // Extract Google Drive ID if the fileId is a Drive URL
    const actualFileId = extractGoogleDriveId(fileId)

    console.log(`Processing download request for file: ${actualFileId}`)

    // Get the file data from Firebase
    const fileData = await getFileViaFirebase(actualFileId)

    if (!fileData) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Set filename in headers for download
    const filename = `credential-${actualFileId}.json`

    // Return the file data as JSON with appropriate headers
    return NextResponse.json(fileData, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Error retrieving file:', error)

    return NextResponse.json({ error: 'Failed to retrieve file data' }, { status: 500 })
  }
}

/**
 * Extracts a Google Drive file ID from a Drive URL
 *
 * @param url - The URL or ID to process
 * @returns The extracted Google Drive ID or the original string if not a Drive URL
 */
function extractGoogleDriveId(url: string): string {
  // Handle Google Drive links in format https://drive.google.com/file/d/{fileId}/view?usp=...
  const regex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/
  const match = url.match(regex)

  if (match && match[1]) {
    return match[1]
  }

  // If not a Google Drive link or different format, return the original
  return url
}
