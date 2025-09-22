/**
 * Normalizes external credentials (W3C VC, OpenBadge, BlockCerts) to our native SkillCredential schema
 */

export interface NormalizedSkillVC {
  '@context': string[]
  type: string[] // must include "VerifiableCredential" and "SkillCredential"
  id?: string
  issuer?: any
  issuanceDate?: string
  credentialSubject: {
    id?: string
    achievement: {
      id?: string
      name: string
      description?: string
      criteria?: string
      grade?: string | number
    }[]
    metadata?: Record<string, any>
  }
  proof?: any
}

/**
 * Normalizes arbitrary credential formats to our native SkillCredential schema
 * @param vc - The incoming credential (W3C VC, OpenBadge, BlockCerts, etc.)
 * @returns Normalized credential conforming to SkillCredential schema
 */
export function normalizeCredential(vc: any): NormalizedSkillVC {
  if (!vc || typeof vc !== 'object') {
    throw new Error('Invalid credential: must be a valid object')
  }

  // Extract the actual credential if it's wrapped in a VerifiablePresentation
  let credential = vc
  if (vc.type?.includes('VerifiablePresentation') && vc.verifiableCredential?.[0]) {
    credential = vc.verifiableCredential[0]
  }

  // Ensure we have required W3C VC structure
  if (!credential['@context'] || !credential.type) {
    throw new Error('Invalid credential: missing required @context or type fields')
  }

  const credentialSubject = credential.credentialSubject || {}

  // Extract achievement information based on credential format
  let achievement: any = null
  let achievementName = ''
  let achievementDescription = ''
  let achievementCriteria = ''
  let achievementGrade = ''

  // Handle OpenBadge format (like ASU example)
  if (credential.type?.includes('OpenBadgeCredential') || credentialSubject.achievement) {
    if (credentialSubject.achievement && !Array.isArray(credentialSubject.achievement)) {
      // OpenBadge format - single achievement object
      achievement = credentialSubject.achievement
      achievementName = achievement.name || ''
      achievementDescription = achievement.description || ''

      // Extract criteria narrative
      if (achievement.criteria?.narrative) {
        achievementCriteria = achievement.criteria.narrative
      } else if (achievement.criteria) {
        achievementCriteria =
          typeof achievement.criteria === 'string'
            ? achievement.criteria
            : JSON.stringify(achievement.criteria)
      }

      // Extract grade if present in criteria
      if (achievementCriteria.includes('Grade Point Result')) {
        const gradeMatch = achievementCriteria.match(/(\d+\.?\d*)/)
        if (gradeMatch) {
          achievementGrade = gradeMatch[1]
        }
      }
    }
  }

  // Handle our native format (array of achievements)
  if (credentialSubject.achievement && Array.isArray(credentialSubject.achievement)) {
    achievement = credentialSubject.achievement[0]
    achievementName = achievement?.name || ''
    achievementDescription = achievement?.description || ''
    achievementCriteria = achievement?.criteria?.narrative || achievement?.criteria || ''
  }

  // Handle generic W3C VC format
  if (!achievement && credentialSubject.name) {
    achievementName = credentialSubject.name
    achievementDescription = credentialSubject.description || ''
  }

  // Fallback to credential name if no achievement name found
  if (!achievementName && credential.name) {
    achievementName = credential.name
  }

  // Clean up achievement name (trim whitespace, normalize spacing)
  achievementName = achievementName.trim().replace(/\s+/g, ' ')

  if (!achievementName) {
    throw new Error('Could not extract achievement name from credential')
  }

  // Preserve unknown fields in metadata
  const metadata: Record<string, any> = {}
  const knownFields = ['id', 'achievement', 'name', 'description', 'type']

  Object.keys(credentialSubject).forEach(key => {
    if (!knownFields.includes(key)) {
      metadata[key] = credentialSubject[key]
    }
  })

  // Build normalized credential
  const normalized: NormalizedSkillVC = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://schema.org/',
      'https://linkedcreds.allskillscount.org/contexts/skill-credential-v1'
    ],
    type: ['VerifiableCredential', 'SkillCredential'],
    id: credential.id,
    issuer: credential.issuer,
    issuanceDate: credential.issuanceDate,
    credentialSubject: {
      id: credentialSubject.id,
      achievement: [
        {
          id: achievement?.id,
          name: achievementName,
          description: achievementDescription || undefined,
          criteria: achievementCriteria || undefined,
          grade: achievementGrade || undefined
        }
      ],
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined
    },
    proof: credential.proof
  }

  return normalized
}

/**
 * Validates that a normalized credential conforms to our schema
 * @param normalized - The normalized credential to validate
 * @returns true if valid, throws error if invalid
 */
export function validateNormalizedCredential(normalized: NormalizedSkillVC): boolean {
  if (!normalized['@context'] || !Array.isArray(normalized['@context'])) {
    throw new Error('Missing or invalid @context')
  }

  if (!normalized.type || !Array.isArray(normalized.type)) {
    throw new Error('Missing or invalid type')
  }

  if (!normalized.type.includes('VerifiableCredential')) {
    throw new Error('Type must include VerifiableCredential')
  }

  if (!normalized.type.includes('SkillCredential')) {
    throw new Error('Type must include SkillCredential')
  }

  if (!normalized.credentialSubject || !normalized.credentialSubject.achievement) {
    throw new Error('Missing credentialSubject.achievement')
  }

  if (!Array.isArray(normalized.credentialSubject.achievement)) {
    throw new Error('credentialSubject.achievement must be an array')
  }

  if (normalized.credentialSubject.achievement.length === 0) {
    throw new Error('credentialSubject.achievement array cannot be empty')
  }

  const firstAchievement = normalized.credentialSubject.achievement[0]
  if (!firstAchievement.name || typeof firstAchievement.name !== 'string') {
    throw new Error('First achievement must have a valid name')
  }

  return true
}
