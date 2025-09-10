import { ZcapClient } from '@digitalcredentials/ezcap'
import { Ed25519Signature2020 } from '@digitalcredentials/ed25519-signature-2020'

export interface ZcapStorage {
  zcap: string
  appInstanceDid: string
  timestamp: number
}

export interface ZcapClientConfig {
  appDidSigner: any
}

/**
 * Store zCap in localStorage for later use by file upload components
 */
export function storeZcap(zcap: string, appInstanceDid: string): void {
  if (typeof window === 'undefined') return
  
  const zcapStorage: ZcapStorage = {
    zcap,
    appInstanceDid,
    timestamp: Date.now()
  }
  
  localStorage.setItem('zcap', JSON.stringify(zcapStorage))
  console.log('✅ ZCap stored in localStorage:', zcapStorage)
}

/**
 * Retrieve zCap from localStorage
 */
export function getStoredZcap(): ZcapStorage | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem('zcap')
    if (!stored) return null
    
    const zcapStorage: ZcapStorage = JSON.parse(stored)
    
    // Check if zCap is not too old (24 hours)
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    if (Date.now() - zcapStorage.timestamp > maxAge) {
      console.warn('⚠️ Stored zCap is too old, removing from localStorage')
      localStorage.removeItem('zcap')
      return null
    }
    
    return zcapStorage
  } catch (error) {
    console.error('Error retrieving zCap from localStorage:', error)
    return null
  }
}

/**
 * Clear zCap from localStorage
 */
export function clearStoredZcap(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('zcap')
  console.log('🗑️ ZCap cleared from localStorage')
}

/**
 * Create a ZcapClient instance for WAS file operations
 */
export function createZcapClient(config: ZcapClientConfig): any {
  try {
    return new ZcapClient({
      SuiteClass: Ed25519Signature2020,
      invocationSigner: config.appDidSigner
    })
  } catch (error) {
    console.error('Error creating ZcapClient:', error)
    return null
  }
}

/**
 * Upload a file to WAS using zCap
 */
export async function uploadFileToWAS(
  file: File,
  zcapClient: any,
  capability: any,
  url: string
): Promise<{ success: boolean; fileId?: string; error?: string }> {
  try {
    console.log('🚀 Uploading file to WAS:', file.name)
    
    const response = await zcapClient.request({
      url,
      capability,
      method: 'PUT',
      action: 'PUT',
      blob: file
    })
    
    console.log('✅ File uploaded to WAS successfully:', response)
    
    // Extract file ID from response or URL
    // This might need adjustment based on the actual WAS response format
    const fileId = response?.id || response?.fileId || 'unknown'
    
    return {
      success: true,
      fileId
    }
  } catch (error) {
    console.error('❌ Error uploading file to WAS:', error)
    // details log
    console.error('❌ Error uploading file to WAS:', JSON.stringify(error, null, 2))
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

