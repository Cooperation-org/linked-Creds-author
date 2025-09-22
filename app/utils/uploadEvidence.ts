import { getStoredZcap } from './zcapStorage'
import { FileItem } from '../credentialForm/form/types/Types'
import { GoogleDriveStorage } from '@cooperation/vc-storage'
import { createStorage } from '@cooperation/vc-storage'

export interface PortfolioItem {
  name: string
  url: string
  wasId?: string
  googleId?: string
}

interface UploadEvidenceOptions {
  selectedFiles: FileItem[]
  setValue: (field: string, value: any, options?: any) => void
  setSelectedFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
  watch: <T>(name: string) => T
  appInstanceDid?: any
  hasZcap?: boolean
  storage?: GoogleDriveStorage
  useWas?: boolean
}

export async function uploadEvidence({
  selectedFiles,
  setValue,
  setSelectedFiles,
  watch,
  appInstanceDid,
  hasZcap,
  storage,
  useWas = true
}: UploadEvidenceOptions): Promise<void> {
  try {
    const filesToUpload = selectedFiles.filter(f => !f.uploaded && f.file && f.name)
    if (filesToUpload.length === 0) return

    if (useWas) {
      if (!appInstanceDid || !hasZcap) {
        throw new Error(
          'WAS upload requested but missing appInstanceDid or zcap delegation.'
        )
      }
      const stored = getStoredZcap()
      const capability =
        typeof stored?.zcap === 'string' ? JSON.parse(stored.zcap) : stored?.zcap
      if (!capability) {
        throw new Error('WAS upload requested but no zcap found in local storage.')
      }

      const was = createStorage('wasZcap', { appInstance: appInstanceDid, capability })
      const uploadedFiles = await Promise.all(
        filesToUpload.map(async (fileItem, index) => {
          const wasId = await was.upload({
            key: fileItem.name,
            file: fileItem.file as any
          })
          return {
            ...fileItem,
            wasId,
            uploaded: true,
            isFeatured: index === 0 && !watch<string>('evidenceLink')
          }
        })
      )

      const featuredFile = uploadedFiles.find(f => f.isFeatured)
      if (featuredFile?.wasId) setValue('evidenceLink', featuredFile.wasId)

      const currentPortfolio = watch<PortfolioItem[]>('portfolio') || []
      const newPortfolioEntries: PortfolioItem[] = uploadedFiles.map(f => ({
        name: f.name,
        url: f.wasId || '',
        wasId: f.wasId
      }))
      setValue('portfolio', [...currentPortfolio, ...newPortfolioEntries])

      setSelectedFiles(prev =>
        prev.map(file => {
          const uploaded = uploadedFiles.find(f => f.name === file.name)
          return uploaded ? { ...file, wasId: uploaded.wasId, uploaded: true } : file
        })
      )
      return
    }

    // Google Drive path (no fallback)
    if (!storage) {
      throw new Error(
        'Google Drive storage is not available. Please log in to Google Drive first by clicking the Google Drive login button.'
      )
    }

    const uploadedFiles = await Promise.all(
      filesToUpload.map(async (fileItem, index) => {
        const newFile = new File([fileItem.file], fileItem.name, {
          type: fileItem.file.type
        })
        const uploadedFile = await storage.uploadBinaryFile({ file: newFile })
        if (!uploadedFile?.id)
          throw new Error(
            `Failed to upload file ${fileItem.name} to Google Drive. Upload response was invalid.`
          )
        return {
          ...fileItem,
          googleId: uploadedFile.id,
          uploaded: true,
          isFeatured: index === 0 && !watch<string>('evidenceLink')
        }
      })
    )

    const featuredFile = uploadedFiles.find(f => f.isFeatured)
    if (featuredFile?.googleId) {
      setValue(
        'evidenceLink',
        `https://drive.google.com/uc?export=view&id=${featuredFile.googleId}`
      )
    }

    const currentPortfolio = watch<PortfolioItem[]>('portfolio') || []
    const newPortfolioEntries: PortfolioItem[] = uploadedFiles.map(f => ({
      name: f.name,
      url: `https://drive.google.com/uc?export=view&id=${f.googleId}`,
      googleId: f.googleId
    }))
    setValue('portfolio', [...currentPortfolio, ...newPortfolioEntries])

    setSelectedFiles(prev =>
      prev.map(file => {
        const uploaded = uploadedFiles.find(f => f.name === file.name)
        return uploaded ? { ...file, ...uploaded } : file
      })
    )
  } catch (error) {
    console.error('❌ Error uploading files:', error)
  }
}

// Facade-based uploader: expects a unified upload() and backend kind
export async function uploadEvidenceWithStorage({
  selectedFiles,
  setValue,
  setSelectedFiles,
  watch,
  backend,
  upload
}: {
  selectedFiles: FileItem[]
  setValue: (field: string, value: any, options?: any) => void
  setSelectedFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
  watch: <T>(name: string) => T
  backend: 'was' | 'drive'
  upload: (args: { key: string; file: Blob | File }) => Promise<string>
}) {
  const filesToUpload = selectedFiles.filter(f => !f.uploaded && f.file && f.name)
  if (filesToUpload.length === 0) return

  const uploadedFiles = await Promise.all(
    filesToUpload.map(async (fileItem, index) => {
      const id = await upload({ key: fileItem.name, file: fileItem.file as any })
      const base = {
        ...fileItem,
        uploaded: true,
        isFeatured: index === 0 && !watch<string>('evidenceLink')
      }
      return backend === 'was' ? { ...base, wasId: id } : { ...base, googleId: id }
    })
  )

  const featured = uploadedFiles.find(f => f.isFeatured)
  if (featured) {
    const url =
      backend === 'was'
        ? featured.wasId || ''
        : `https://drive.google.com/uc?export=view&id=${featured.googleId}`
    setValue('evidenceLink', url)
  }

  const currentPortfolio = watch<PortfolioItem[]>('portfolio') || []
  const newEntries: PortfolioItem[] = uploadedFiles.map(f =>
    backend === 'was'
      ? { name: f.name, url: f.wasId || '', wasId: f.wasId }
      : {
          name: f.name,
          url: `https://drive.google.com/uc?export=view&id=${f.googleId}`,
          googleId: f.googleId
        }
  )
  setValue('portfolio', [...currentPortfolio, ...newEntries])

  setSelectedFiles(prev =>
    prev.map(file => {
      const up = uploadedFiles.find(f => f.name === file.name)
      return up ? { ...file, ...up } : file
    })
  )
}
