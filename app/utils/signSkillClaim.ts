import {
  CredentialEngine,
  GoogleDriveStorage,
  saveToGoogleDrive
} from '@cooperation/vc-storage'
import type { ISkillClaimCredential } from 'hr-context'
import type { FormData } from '../credentialForm/form/types/Types'
import { normalizeSkillClaimFormData, SkillClaimFormData } from './normalization/hrContextSkillClaim'

/**
 * Sign a SkillClaimCredential using the HR Context data model.
 * Uses the shared storage and engine. Creates a DID if keyPair/issuerId are not provided.
 *
 * @param storage - Shared GoogleDriveStorage instance (e.g. from useGoogleDrive)
 * @param engine - Shared CredentialEngine instance (e.g. from getCredentialEngine)
 * @param input - Form data + skills (or pre-built SkillClaimFormData)
 * @param options - Optional keyPair and issuerId (if already have DID); saveToDrive to persist
 * @returns The signed SkillClaimCredential
 */
export async function signSkillClaim(
  storage: GoogleDriveStorage,
  engine: CredentialEngine,
  formData: FormData,
  options?: {
    keyPair?: any
    issuerId?: string
    saveToDrive?: boolean
  }
): Promise<ISkillClaimCredential | { signedVC: ISkillClaimCredential; file: any }> {
  if (!storage || !engine)
    throw new Error('Storage and CredentialEngine are required.')

  const normalizedData: SkillClaimFormData = normalizeSkillClaimFormData(formData)

  let keyPair = options?.keyPair
  let issuerId = options?.issuerId

  if (!keyPair || !issuerId) {
    const { didDocument, keyPair: kp } = await engine.createDID()
    keyPair = kp
    issuerId = didDocument.id
    normalizedData.personId = normalizedData.personId ?? issuerId
  }

  if (!issuerId) throw new Error('Issuer DID is required.')

  try {
    const signedVC = await engine.signSkillClaimVC(
      normalizedData as unknown as ISkillClaimCredential,
      keyPair,
      issuerId
    )
    if (options?.saveToDrive) {
      const file = await saveToGoogleDrive({
        storage,
        data: signedVC,
        type: 'VC'
      })
      return { signedVC, file }
    }

    return signedVC
  } catch (error) {
    console.error('🚀 ~ signSkillClaim ~ error:', JSON.stringify(error, null, 2))
    throw error
  }
}
