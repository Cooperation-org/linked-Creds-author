import { useMemo } from 'react'
import { getStoredZcap } from '../utils/zcapStorage'
import { useAppDid } from '../contexts/AppDidContext'
import useGoogleDrive from './useGoogleDrive'
import { createStorage } from '@cooperation/vc-storage/dist/models/StorageContext'

type BackendKind = 'was' | 'drive' | 'none'

interface StorageClient {
  kind: BackendKind
  upload: (args: { key: string; file: Blob | File }) => Promise<string>
  raw?: any
}

export function useStorageBackend(): {
  backend: BackendKind
  storageClient?: StorageClient
  error?: string
} {
  const { appInstanceDid, hasZcap } = useAppDid()
  const { storage: drive } = useGoogleDrive()

  return useMemo(() => {
    try {
      const stored = getStoredZcap()
      const capability =
        typeof stored?.zcap === 'string' ? JSON.parse(stored.zcap) : stored?.zcap
      const canUseWas = Boolean(hasZcap && appInstanceDid && capability)

      if (canUseWas) {
        const was = createStorage('wasZcap', { appInstance: appInstanceDid, capability })
        const client: StorageClient = {
          kind: 'was',
          upload: async ({ key, file }) => was.upload({ key, file }),
          raw: was
        }
        return { backend: 'was', storageClient: client }
      }

      if (drive) {
        const client: StorageClient = {
          kind: 'drive',
          upload: async ({ key, file }) => {
            const newFile = new File([file], key, {
              type: (file as File).type || 'application/octet-stream'
            })
            const uploaded = await drive.uploadBinaryFile({ file: newFile })
            if (!uploaded?.id) throw new Error('Drive upload failed: invalid response')
            return uploaded.id
          },
          raw: drive
        }
        return { backend: 'drive', storageClient: client }
      }

      return { backend: 'none', error: 'No storage backend available' }
    } catch (e: any) {
      return {
        backend: 'none',
        error: e?.message || 'Failed to initialize storage backend'
      }
    }
  }, [appInstanceDid, hasZcap, drive])
}
