import { useCallback } from 'react'
import { FileItem } from '../credentialForm/form/types/Types'
import { GoogleDriveStorage } from '@cooperation/vc-storage'
import { uploadFilesToWAS } from '../utils/wasUpload'
import { PortfolioItem } from '../credentialForm/form/Steps/Step3_uploadEvidence'

interface HandleUploadOptions {
  selectedFiles: FileItem[]
  setValue: (field: string, value: any, options?: any) => void
  setSelectedFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
  watch: <T>(name: string) => T
  appInstanceDid?: any
  hasZcap?: boolean
  storage?: GoogleDriveStorage
  useWas?: boolean
}

export function useHandleUpload({
  selectedFiles,
  setValue,
  setSelectedFiles,
  watch,
  appInstanceDid,
  hasZcap,
  storage,
  useWas = true,
}: HandleUploadOptions) {
  return useCallback(async () => {
    try {
      if (selectedFiles.length === 0) return

      const filesToUpload = selectedFiles.filter(
        f => !f.uploaded && f.file && f.name
      )
      if (filesToUpload.length === 0) return

      if (
        useWas &&
        appInstanceDid &&
        hasZcap &&
        (appInstanceDid.keyPair || appInstanceDid.privateKeyMultibase)
      ) {
        try {
          console.log('🚀 Uploading files to WAS')
          await uploadFilesToWAS(
            filesToUpload,
            watch,
            appInstanceDid,
            setValue,
            setSelectedFiles
          )
          console.log('✅ Files uploaded to WAS successfully')
          return
        } catch (err) {
          console.warn('⚠️ WAS upload failed, falling back to Google Drive:', err)
          throw err
        }
      } else {
        console.log('⚠️ WAS upload skipped, using Google Drive')
      }

      // fallback: Google Drive upload
      if (!storage) {
        throw new Error(
          'Google Drive storage is not available. Please log in to Google Drive first by clicking the Google Drive login button.'
        )
      }

      const uploadedFiles = await Promise.all(
        filesToUpload.map(async (fileItem, index) => {
          const newFile = new File([fileItem.file], fileItem.name, {
            type: fileItem.file.type,
          })

          const uploadedFile = await storage.uploadBinaryFile({
            file: newFile,
          })

          if (!uploadedFile?.id) {
            throw new Error(
              `Failed to upload file ${fileItem.name} to Google Drive. Upload response was invalid.`
            )
          }

          return {
            ...fileItem,
            googleId: uploadedFile.id,
            uploaded: true,
            isFeatured: index === 0 && !watch<string>('evidenceLink'),
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
        googleId: f.googleId,
      }))

      setValue('portfolio', [...currentPortfolio, ...newPortfolioEntries])

      setSelectedFiles(prevFiles =>
        prevFiles.map(file => {
          const uploaded = uploadedFiles.find(f => f.name === file.name)
          return uploaded ? { ...file, ...uploaded } : file
        })
      )

      console.log('✅ Files uploaded to Google Drive successfully')
    } catch (error) {
      console.error('❌ Error uploading files:', error)
    }
  }, [selectedFiles, setValue, setSelectedFiles, watch, appInstanceDid, hasZcap, storage, useWas])
}
