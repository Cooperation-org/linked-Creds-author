import { getStoredZcap } from './zcapStorage'
import { FileItem } from '../credentialForm/form/types/Types'
import { Ed25519VerificationKey2020 } from '@digitalcredentials/ed25519-verification-key-2020'
import { Ed25519Signature2020 } from '@digitalcredentials/ed25519-signature-2020'
import { ZcapClient } from '@digitalcredentials/ezcap'

interface PortfolioItem {
  name: string
  url: string
  wasId?: string
  googleId?: string
}

async function makeInvocationSigner(appInstance: any) {
  const key = await Ed25519VerificationKey2020.from({
    id: appInstance.id,
    controller: appInstance.controller,
    publicKeyMultibase: appInstance.publicKeyMultibase,
    privateKeyMultibase: appInstance.privateKeyMultibase,
  })
  return key.signer()
}

/**
 * Upload files to WAS using zCap delegation
 */
export async function uploadFilesToWAS(
  selectedFiles: FileItem[],
  watch: <T>(name: string) => T,
  appInstance: any,
  setValue: (field: string, value: any, options?: any) => void,
  setSelectedFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
): Promise<void> {
  try {
    const storedZcap = getStoredZcap()
    if (!storedZcap?.zcap) {
      throw new Error('No zcap found in localStorage. Please connect to WAS first.')
    }

    const capability =
      typeof storedZcap.zcap === 'string'
        ? JSON.parse(storedZcap.zcap)
        : storedZcap.zcap

    if (!appInstance?.publicKeyMultibase || !appInstance?.privateKeyMultibase) {
      throw new Error(
        'appInstance is missing key material. Ensure getOrCreateAppInstanceDid() returned the full keyPair and you passed it here.'
      )
    }

    const invocationSigner = await makeInvocationSigner(appInstance)

    const zcapClient = new ZcapClient({
      SuiteClass: Ed25519Signature2020,
      invocationSigner,
    })

    const filesToUpload = selectedFiles.filter(
      fileItem => !fileItem.uploaded && fileItem.file && fileItem.name
    )

    if (filesToUpload.length === 0) {
      console.log('No files to upload to WAS')
      return
    }

    console.log(`🚀 Uploading ${filesToUpload.length} files to WAS`)

    const uploadedFiles = await Promise.all(
      filesToUpload.map(async (fileItem, index) => {
        try {
          const baseUrl = capability.invocationTarget

          if (!baseUrl) {
            throw new Error('Capability invocationTarget is missing.')
          }

          const wasUrl = `${baseUrl}/${encodeURIComponent(fileItem.name)}`
          console.log('Zcap target:', baseUrl)
          console.log('Uploading to:', wasUrl)

          console.log('Attempting upload...')
          const response = await zcapClient.request({
            url: wasUrl,
            capability,
            method: 'PUT',
            action: 'PUT',
            blob: fileItem.file,
          })

          console.log('Upload complete!')
          console.log(`✅ File uploaded successfully: ${fileItem.name}`, response)

          const wasId =
            response?.id || response?.result?.id || response?.url || wasUrl

          return {
            ...fileItem,
            wasId,
            uploaded: true,
            isFeatured: index === 0 && !watch<string>('evidenceLink'),
          }
        } catch (error) {
          console.error(`❌ Error uploading file ${fileItem.name}:`, error)
          throw error
        }
      })
    )

    const featuredFile = uploadedFiles.find(file => file.isFeatured)
    if (featuredFile?.wasId) {
      setValue('evidenceLink', featuredFile.wasId)
    }

    const currentPortfolio = watch<PortfolioItem[]>('portfolio') || []
    const newPortfolioEntries: PortfolioItem[] = uploadedFiles.map(file => ({
      name: file.name,
      url: file.wasId || '',
      wasId: file.wasId,
    }))

    setValue('portfolio', [...currentPortfolio, ...newPortfolioEntries])

    setSelectedFiles(prevFiles =>
      prevFiles.map(file => {
        const uploadedFile = uploadedFiles.find(f => f.name === file.name)
        return uploadedFile
          ? { ...file, wasId: uploadedFile.wasId, uploaded: true }
          : file
      })
    )

    console.log('✅ All files uploaded to WAS successfully')
  } catch (error) {
    console.error('❌ Error uploading files to WAS:', error)
    throw error
  }
}
