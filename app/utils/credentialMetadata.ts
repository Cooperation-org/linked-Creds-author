/**
 * Firebase utilities for credential metadata management
 */

import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../firebase/config/firebase'

export interface CredentialMetadata {
  owner: string
  normalized: boolean
  verification: {
    status: 'pending' | 'verified' | 'unverified'
    ok?: boolean
    details?: any
  }
  source: string
  originalType?: string
  endorsements?: string[]
  createdAt: number
  updatedAt: number
}

export interface EndorsementMetadata {
  owner: string
  endorsedCredential: string // Google Drive file ID of original credential
  createdAt: number
  updatedAt: number
}

/**
 * Stores credential metadata in Firebase
 * @param googleFileId - The Google Drive file ID
 * @param metadata - The metadata to store
 */
export async function storeCredentialMetadata(
  googleFileId: string,
  metadata: Partial<CredentialMetadata>
): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firebase is not configured')
    }

    const docRef = doc(db, 'files', googleFileId)
    const now = Date.now()

    const fullMetadata: CredentialMetadata = {
      owner: metadata.owner || '',
      normalized: metadata.normalized || false,
      verification: metadata.verification || { status: 'pending' },
      source: metadata.source || 'unknown',
      originalType: metadata.originalType,
      endorsements: metadata.endorsements || [],
      createdAt: metadata.createdAt || now,
      updatedAt: now
    }

    await setDoc(docRef, fullMetadata, { merge: true })
    console.log(`Credential metadata stored for file ${googleFileId}`)
  } catch (error) {
    console.error('Error storing credential metadata:', error)
    throw error
  }
}

/**
 * Retrieves credential metadata from Firebase
 * @param googleFileId - The Google Drive file ID
 * @returns The metadata or null if not found
 */
export async function getCredentialMetadata(
  googleFileId: string
): Promise<CredentialMetadata | null> {
  try {
    if (!db) {
      console.error('Firebase is not configured')
      return null
    }

    const docRef = doc(db, 'files', googleFileId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data() as CredentialMetadata
    }

    return null
  } catch (error) {
    console.error('Error retrieving credential metadata:', error)
    return null
  }
}

/**
 * Updates credential verification status
 * @param googleFileId - The Google Drive file ID
 * @param verificationResult - The verification result
 */
export async function updateCredentialVerification(
  googleFileId: string,
  verificationResult: { ok: boolean; details: any }
): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firebase is not configured')
    }

    const docRef = doc(db, 'files', googleFileId)
    await updateDoc(docRef, {
      verification: {
        status: verificationResult.ok ? 'verified' : 'unverified',
        ok: verificationResult.ok,
        details: verificationResult.details
      },
      updatedAt: Date.now()
    })

    console.log(
      `Verification status updated for file ${googleFileId}: ${verificationResult.ok ? 'verified' : 'unverified'}`
    )
  } catch (error) {
    console.error('Error updating credential verification:', error)
    throw error
  }
}

/**
 * Adds an endorsement reference to a credential
 * @param googleFileId - The Google Drive file ID of the original credential
 * @param endorsementFileId - The Google Drive file ID of the endorsement
 */
export async function addEndorsementToCredential(
  googleFileId: string,
  endorsementFileId: string
): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firebase is not configured')
    }

    const docRef = doc(db, 'files', googleFileId)
    await updateDoc(docRef, {
      endorsements: arrayUnion(endorsementFileId),
      updatedAt: Date.now()
    })

    console.log(`Endorsement ${endorsementFileId} added to credential ${googleFileId}`)
  } catch (error) {
    console.error('Error adding endorsement to credential:', error)
    throw error
  }
}

/**
 * Stores endorsement metadata
 * @param endorsementFileId - The Google Drive file ID of the endorsement
 * @param metadata - The endorsement metadata
 */
export async function storeEndorsementMetadata(
  endorsementFileId: string,
  metadata: Partial<EndorsementMetadata>
): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firebase is not configured')
    }

    const docRef = doc(db, 'files', endorsementFileId)
    const now = Date.now()

    const fullMetadata: EndorsementMetadata = {
      owner: metadata.owner || '',
      endorsedCredential: metadata.endorsedCredential || '',
      createdAt: metadata.createdAt || now,
      updatedAt: now
    }

    await setDoc(docRef, fullMetadata, { merge: true })
    console.log(`Endorsement metadata stored for file ${endorsementFileId}`)
  } catch (error) {
    console.error('Error storing endorsement metadata:', error)
    throw error
  }
}

/**
 * Gets all endorsements for a credential
 * @param googleFileId - The Google Drive file ID of the original credential
 * @returns Array of endorsement file IDs
 */
export async function getCredentialEndorsements(googleFileId: string): Promise<string[]> {
  try {
    const metadata = await getCredentialMetadata(googleFileId)
    return metadata?.endorsements || []
  } catch (error) {
    console.error('Error getting credential endorsements:', error)
    return []
  }
}
