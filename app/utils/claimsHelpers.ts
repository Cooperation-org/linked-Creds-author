// Helper functions for claims management

// Border colors for mobile cards
export const borderColors = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f97316',
  '#22c55e',
  '#6366f1'
]

export const getRandomBorderColor = (): string => {
  return borderColors[Math.floor(Math.random() * borderColors.length)]
}

// Date formatting functions
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const getTimeAgo = (isoDateString: string): string => {
  const date = new Date(isoDateString)
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }
  return formatDate(date)
}

export const getTimeDifference = (isoDateString: string): string => {
  const date = new Date(isoDateString)
  if (isNaN(date.getTime())) {
    return '0 seconds'
  }

  const now = new Date()
  const diffInMilliseconds = now.getTime() - date.getTime()
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const months =
    (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())

  if (months > 0) return `${months} ${months === 1 ? 'month' : 'months'}`
  if (diffInDays >= 30) return `${diffInDays} days`
  if (diffInDays > 0) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'}`
  if (diffInHours > 0) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'}`
  if (diffInMinutes > 0)
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'}`
  return `${diffInSeconds} ${diffInSeconds === 1 ? 'second' : 'seconds'}`
}

// Credential helper functions
export const getCredentialName = (claim: any): string => {
  try {
    // Safety check for claim object
    if (!claim || typeof claim !== 'object') {
      console.warn('Invalid claim object:', claim)
      return 'Invalid Credential'
    }

    // Try top-level name fields first (common in many schemas)
    if (claim.name && typeof claim.name === 'string') {
      return claim.name.trim()
    }
    if (claim.title && typeof claim.title === 'string') {
      return claim.title.trim()
    }

    // Safety check for credentialSubject
    if (!claim.credentialSubject || typeof claim.credentialSubject !== 'object') {
      console.warn('Invalid credentialSubject:', claim.credentialSubject)
      return 'Unknown Credential'
    }

    const { credentialSubject } = claim

    // Handle new credential format (direct access)
    if (credentialSubject.employeeName) {
      return `Performance Review: ${credentialSubject.employeeJobTitle || 'Unknown Position'}`
    }
    if (credentialSubject.volunteerWork) {
      return `Volunteer: ${credentialSubject.volunteerWork}`
    }
    if (credentialSubject.role) {
      return `Employment: ${credentialSubject.role}`
    }
    if (credentialSubject.credentialName) {
      return credentialSubject.credentialName
    }
    if (credentialSubject.name && typeof credentialSubject.name === 'string') {
      return credentialSubject.name.trim()
    }

    // Handle achievement-based schemas (OpenBadges, BlockCerts, etc.)
    if (credentialSubject.achievement) {
      // Single achievement object (OpenBadges format)
      if (
        credentialSubject.achievement.name &&
        typeof credentialSubject.achievement.name === 'string'
      ) {
        return credentialSubject.achievement.name.trim()
      }

      // Array of achievements (our native format)
      if (
        Array.isArray(credentialSubject.achievement) &&
        credentialSubject.achievement.length > 0 &&
        credentialSubject.achievement[0] &&
        credentialSubject.achievement[0].name
      ) {
        return credentialSubject.achievement[0].name.trim()
      }
    }

    // Fallback to credential ID or type
    if (claim.id && typeof claim.id === 'string') {
      return `Credential ${claim.id.slice(-8)}`
    }

    const types = Array.isArray(claim.type) ? claim.type : [claim.type]
    if (types.length > 0 && types[0] !== 'VerifiableCredential') {
      return `${types[0]} Credential`
    }

    return 'Unknown Credential'
  } catch (error) {
    console.error('Error in getCredentialName:', error, claim)
    return 'Error Loading Credential'
  }
}

export const getCredentialType = (claim: any): string => {
  try {
    if (!claim || typeof claim !== 'object') {
      return 'Unknown'
    }

    const types: string[] = Array.isArray(claim.type) ? claim.type : [claim.type]

    // Check for specific credential types
    if (types.includes('EmploymentCredential')) return 'Employment'
    if (types.includes('VolunteeringCredential')) return 'Volunteer'
    if (types.includes('PerformanceReviewCredential')) return 'Performance Review'
    if (types.includes('OpenBadgeCredential')) return 'Open Badge'
    if (types.includes('BlockchainCredential')) return 'Blockchain'
    if (types.includes('LearningCredential')) return 'Learning'
    if (types.includes('SkillCredential')) return 'Skill'

    // Check credentialSubject for type hints
    if (claim.credentialSubject) {
      if (claim.credentialSubject.employeeName) return 'Performance Review'
      if (claim.credentialSubject.volunteerWork) return 'Volunteer'
      if (claim.credentialSubject.role) return 'Employment'
      if (claim.credentialSubject.achievement) return 'Achievement'
    }

    // Fallback to first non-VerifiableCredential type
    const nonVcTypes = types.filter((type: string) => type !== 'VerifiableCredential')
    if (nonVcTypes.length > 0) {
      return nonVcTypes[0]
        .replace('Credential', '')
        .replace(/([A-Z])/g, ' $1')
        .trim()
    }

    return 'Verifiable Credential'
  } catch (error) {
    console.error('Error in getCredentialType:', error, claim)
    return 'Unknown'
  }
}

// Helper function to validate claim object (schema-agnostic)
export const isValidClaim = (claim: any): boolean => {
  try {
    // Basic structure validation
    if (!claim || typeof claim !== 'object') {
      return false
    }

    // Must have @context (W3C VC requirement)
    if (!claim['@context']) {
      return false
    }

    // Must have type (W3C VC requirement)
    if (!claim.type) {
      return false
    }

    // Must have credentialSubject (W3C VC requirement)
    if (!claim.credentialSubject || typeof claim.credentialSubject !== 'object') {
      return false
    }

    // Must have either id or be identifiable
    if (!claim.id && !claim.credentialSubject.id) {
      return false
    }

    return true
  } catch (error) {
    console.error('Error validating claim:', error, claim)
    return false
  }
}

// Safe helper to get claim ID
export const getClaimId = (claim: any): string => {
  try {
    if (claim?.id?.id) return claim.id.id
    if (claim?.id) return claim.id
    return 'unknown-id'
  } catch (error) {
    console.error('Error getting claim ID:', error, claim)
    return 'error-id'
  }
}

// Helper function to check if a credential is a skill credential (legacy - kept for backward compatibility)
export const isSkillCredential = (claim: any): boolean => {
  try {
    // First validate the claim is valid
    if (!isValidClaim(claim)) {
      return false
    }

    // Check if it has the achievement array structure (skill credentials)
    return (
      claim.credentialSubject?.achievement &&
      Array.isArray(claim.credentialSubject.achievement) &&
      claim.credentialSubject.achievement.length > 0
    )
  } catch (error) {
    console.error('Error in isSkillCredential:', error, claim)
    return false
  }
}

// New schema-agnostic helper to get credential description
export const getCredentialDescription = (claim: any): string => {
  try {
    if (!claim || typeof claim !== 'object') {
      return ''
    }

    // Try top-level description first
    if (claim.description && typeof claim.description === 'string') {
      return claim.description.trim()
    }

    // Try credentialSubject description
    if (
      claim.credentialSubject?.description &&
      typeof claim.credentialSubject.description === 'string'
    ) {
      return claim.credentialSubject.description.trim()
    }

    // Try achievement description (OpenBadges format)
    if (
      claim.credentialSubject?.achievement?.description &&
      typeof claim.credentialSubject.achievement.description === 'string'
    ) {
      return claim.credentialSubject.achievement.description.trim()
    }

    // Try achievement array description (our native format)
    if (
      claim.credentialSubject?.achievement &&
      Array.isArray(claim.credentialSubject.achievement) &&
      claim.credentialSubject.achievement.length > 0 &&
      claim.credentialSubject.achievement[0]?.description
    ) {
      return claim.credentialSubject.achievement[0].description.trim()
    }

    return ''
  } catch (error) {
    console.error('Error in getCredentialDescription:', error, claim)
    return ''
  }
}

// Schema-agnostic helper to get issuer name
export const getIssuerName = (claim: any): string => {
  try {
    if (!claim || typeof claim !== 'object') {
      return 'Unknown Issuer'
    }

    // Handle string issuer
    if (typeof claim.issuer === 'string') {
      return claim.issuer
    }

    // Handle object issuer
    if (claim.issuer && typeof claim.issuer === 'object') {
      if (claim.issuer.name && typeof claim.issuer.name === 'string') {
        return claim.issuer.name.trim()
      }
      if (claim.issuer.id && typeof claim.issuer.id === 'string') {
        return claim.issuer.id
      }
    }

    return 'Unknown Issuer'
  } catch (error) {
    console.error('Error in getIssuerName:', error, claim)
    return 'Unknown Issuer'
  }
}

// LinkedIn URL generation
export const generateLinkedInUrl = (claim: any): string => {
  try {
    const claimId = getClaimId(claim)
    const credentialName = getCredentialName(claim)
    const issuanceDate = new Date(claim.issuanceDate || new Date())
    const expirationDate = new Date(claim.expirationDate || new Date())
    const baseLinkedInUrl = 'https://www.linkedin.com/profile/add'
    const params = new URLSearchParams({
      startTask: 'CERTIFICATION_NAME',
      name: credentialName,
      organizationName: 'LinkedTrust',
      issueYear: issuanceDate.getFullYear().toString(),
      issueMonth: (issuanceDate.getMonth() + 1).toString(),
      expirationYear: expirationDate.getFullYear().toString(),
      expirationMonth: (expirationDate.getMonth() + 1).toString(),
      certUrl: `https://linkedcreds.allskillscount.org/view/${claimId}`,
      certId: claimId
    })
    return `${baseLinkedInUrl}?${params.toString()}`
  } catch (error) {
    console.error('Error generating LinkedIn URL:', error, claim)
    return 'https://www.linkedin.com/profile/add'
  }
}
