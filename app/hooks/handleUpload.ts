import { useCallback } from 'react'
import { FileItem } from '../credentialForm/form/types/Types'
import { GoogleDriveStorage } from '@cooperation/vc-storage'
import { uploadEvidence } from '../utils/uploadEvidence'

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

      await uploadEvidence({
        selectedFiles: filesToUpload,
        setValue,
        setSelectedFiles,
        watch,
        appInstanceDid,
        hasZcap,
        storage,
        useWas,
      })
    } catch (error) {
      console.error('❌ Error uploading files:', error)
    }
  }, [selectedFiles, setValue, setSelectedFiles, watch, appInstanceDid, hasZcap, storage, useWas])
}
