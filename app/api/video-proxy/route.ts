import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(request: Request) {
  console.log('[video-proxy] Received request.url:', request.url)
  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get('fileId')
  const accessToken = searchParams.get('access_token')

  console.log('[video-proxy] fileId:', fileId)
  console.log('[video-proxy] accessToken?', accessToken ? 'yes' : 'no')

  if (!fileId) {
    return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
  }
  if (!accessToken) {
    return NextResponse.json({ error: 'Access token is required' }, { status: 401 })
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXTAUTH_URL
    )
    oauth2Client.setCredentials({ access_token: accessToken })

    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    console.log('[video-proxy] Attempting to fetch drive file (video) ...')
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    )
    console.log('[video-proxy] Drive response success. Returning video bytes.')

    const headers = new Headers()
    headers.set('Content-Type', 'video/mp4')
    headers.set('Content-Disposition', 'inline')

    return new NextResponse(response.data as ArrayBuffer, { headers })
  } catch (error) {
    console.error('[video-proxy] Error fetching video:', error)
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
  }
}
