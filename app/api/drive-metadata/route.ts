import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(request: Request) {
  console.log('[drive-metadata] Received request.url:', request.url)

  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get('fileId')
  const accessToken = searchParams.get('access_token')

  console.log('[drive-metadata] fileId:', fileId)
  console.log('[drive-metadata] accessToken?', accessToken ? 'yes' : 'no')

  if (!fileId) {
    return NextResponse.json({ error: 'fileId is required' }, { status: 400 })
  }
  if (!accessToken) {
    return NextResponse.json({ error: 'access_token is required' }, { status: 401 })
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXTAUTH_URL
    )

    oauth2Client.setCredentials({ access_token: accessToken })

    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    const resp = await drive.files.get({
      fileId,
      fields: 'mimeType'
    })

    console.log('[drive-metadata] Drive response mimeType:', resp.data.mimeType)
    return NextResponse.json({ mimeType: resp.data.mimeType })
  } catch (err) {
    console.error('[drive-metadata] Error fetching metadata:', err)
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 })
  }
}
