import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from './config/firebase'

interface FileTokens {
  accessToken: string
  refreshToken: string
}

interface UserTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export const getFileViaFirebase = async (fileId: string) => {
  try {
    // Check if Firebase is configured
    if (!db) {
      console.error('Firebase is not configured. Cannot retrieve file.')
      return null
    }

    // 1- getAccessToken   2- fetch file
    const accessToken = await getAccessToken(fileId)
    const fileContent = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    const data = await fileContent.json()
    return data
  } catch (error) {
    console.error(`Error retrieving file ${fileId} from Firebase:`, error)
    return null
  }
}
/**
 * Stores both access and refresh tokens in Firestore for a Google Drive file.
 */
export const storeFileTokens = async ({
  googleFileId,
  tokens
}: {
  googleFileId: string
  tokens: FileTokens
}): Promise<void> => {
  try {
    if (!db) {
      throw new Error('Firebase is not configured')
    }

    if (!tokens.accessToken || !tokens.refreshToken) {
      throw new Error('Invalid tokens object')
    }
    await setDoc(
      doc(db, 'files', googleFileId),
      {
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600 * 1000, // 1 hour from now,
        ...tokens
      },
      {
        merge: true
      }
    )

    console.log(`Tokens stored for file ${googleFileId}`)
  } catch (error) {
    console.error('Error storing file tokens:', error)
    throw error
  }
}

export const getAccessToken = async (fileId: string) => {
  try {
    if (!db) {
      console.error('Firebase is not configured. Cannot retrieve access token.')
      return null
    }

    const docRef = doc(db, 'files', fileId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      console.error(`No tokens found for file: ${fileId}`)
      return null
    }

    const data = docSnap.data()

    if (!data || !data.accessToken || !data.expiresAt) {
      console.error(`Invalid token data for file: ${fileId}`)
      return null
    }

    const isExpired = data.expiresAt > Date.now()
    if (true) {
      console.log(`Access token for file ${fileId} is expired, refreshing...`)
      const refreshedToken = await refreshAccessToken({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        googleFileId: fileId
      })

      return refreshedToken.accessToken
    }

    return data.accessToken
  } catch (error) {
    console.error(`Error retrieving tokens for file ${fileId}:`, error)
    throw error
  }
}

const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
const client_secret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || ''
const refreshAccessToken = async (tokens: any) => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id,
        client_secret,
        refresh_token: tokens.refreshToken,
        grant_type: 'refresh_token'
      })
    })

    const data = await response.json()
    const newAccessToken = data.access_token

    // Update the access token in Firestore
    await updateFileAccessToken({
      googleFileId: tokens.googleFileId,
      accessToken: newAccessToken
    })

    return { ...tokens, accessToken: newAccessToken, expiresAt: Date.now() + 3600 * 1000 }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    throw error
  }
}

/**
 * Updates the access token for a Google Drive file in Firestore.
 */
export const updateFileAccessToken = async ({
  googleFileId,
  accessToken
}: {
  googleFileId: string
  accessToken: string
}): Promise<void> => {
  console.log(
    '🚀 ~ googleFileId: string accessToken, expiresAt',
    googleFileId,
    accessToken
  )
  try {
    if (!db) {
      throw new Error('Firebase is not configured')
    }

    await setDoc(
      doc(db, 'files', googleFileId),
      { accessToken, expiresAt: Date.now() + 3600 * 1000 },
      { merge: true }
    )

    console.log(`Access token updated for file ${googleFileId}`)
  } catch (error) {
    console.error('Error updating file access token:', error)
    throw error
  }
}

/**
 * Retrieves tokens for a specific Google Drive file from Firestore.
 */
export const getFileTokens = async ({ googleFileId }: { googleFileId: string }) => {
  try {
    if (!db) {
      console.error('Firebase is not configured. Cannot retrieve file tokens.')
      return null
    }

    const docRef = doc(db, 'files', googleFileId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data()
    }
    return null
  } catch (error) {
    console.error('Error retrieving file tokens:', error)
    throw error
  }
}

/**
 * Retrieves tokens from Firestore for a specific user.
 */
export const getUserTokens = async ({
  userId
}: {
  userId: string
}): Promise<UserTokens | null> => {
  try {
    if (!db) {
      console.error('Firebase is not configured. Cannot retrieve user tokens.')
      return null
    }

    const docRef = doc(db, 'users', userId, 'tokens', 'googleDrive')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data() as UserTokens
    }
    return null
  } catch (error) {
    console.error('Error retrieving user tokens:', error)
    throw error
  }
}

/**
 * Retrieves or refreshes the access token for a Google Drive file.
 */
export const getAccessTokenForFile = async ({
  googleFileId
}: {
  googleFileId: string
}): Promise<string | null> => {
  try {
    const tokens = await getFileTokens({ googleFileId })
    if (!tokens) {
      console.error(`No tokens found for file: ${googleFileId}`)
      return null
    }

    // Check if the access token is still valid
    if (tokens.expiresAt > Date.now()) {
      console.log('Access token is still valid')
      return tokens.accessToken
    }

    // Refresh the access token
    console.log(`Refreshing access token for file: ${googleFileId}...`)
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        refresh_token: tokens.refreshToken,
        grant_type: 'refresh_token'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to refresh access token')
    }

    const data = await response.json()
    const newAccessToken = data.accessToken
    // Update the access token in Firestore
    await updateFileAccessToken({
      googleFileId,
      accessToken: newAccessToken
    })

    console.log(`Access token refreshed successfully for file: ${googleFileId}`)
    return newAccessToken
  } catch (error) {
    console.error('Error refreshing access token:', error)
    throw error
  }
}

/**
 * Deletes tokens for a Google Drive file from Firestore.
 */
export const deleteFileTokens = async ({
  googleFileId
}: {
  googleFileId: string
}): Promise<void> => {
  try {
    if (!db) {
      throw new Error('Firebase is not configured')
    }

    await setDoc(doc(db, 'files', googleFileId), {})
    console.log(`Tokens deleted successfully for file ${googleFileId}`)
  } catch (error) {
    console.error('Error deleting file tokens:', error)
    throw error
  }
}

/**
 * Deletes user tokens from Firestore.
 */
export const deleteUserTokens = async ({ userId }: { userId: string }): Promise<void> => {
  try {
    if (!db) {
      throw new Error('Firebase is not configured')
    }

    await setDoc(doc(db, 'users', userId, 'tokens', 'googleDrive'), {})
    console.log(`Tokens deleted successfully for user ${userId}`)
  } catch (error) {
    console.error('Error deleting user tokens:', error)
    throw error
  }
}
