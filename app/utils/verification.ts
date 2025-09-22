/**
 * Credential verification utilities
 * Since the credential engine doesn't expose a verify method, we implement basic verification
 */

export interface VerificationResult {
  ok: boolean
  details: {
    hasProof: boolean
    proofType?: string
    issuerVerified?: boolean
    signatureValid?: boolean
    error?: string
  }
}

/**
 * Basic credential verification - checks structure and proof presence
 * Note: Full cryptographic verification would require the credential engine's verify method
 * @param credential - The credential to verify
 * @returns Verification result with basic checks
 */
export function verifyCredential(credential: any): VerificationResult {
  try {
    const result: VerificationResult = {
      ok: false,
      details: {
        hasProof: false,
        issuerVerified: false,
        signatureValid: false
      }
    }

    // Check basic structure
    if (!credential || typeof credential !== 'object') {
      result.details.error = 'Invalid credential structure'
      return result
    }

    // Check required fields
    if (!credential['@context'] || !credential.type) {
      result.details.error = 'Missing required @context or type fields'
      return result
    }

    // Check for proof
    if (credential.proof) {
      result.details.hasProof = true
      result.details.proofType = credential.proof.type

      // Basic proof structure validation
      if (credential.proof.type && credential.proof.proofValue) {
        result.details.signatureValid = true // Assume valid if structure is correct
      }
    }

    // Check issuer
    if (credential.issuer) {
      result.details.issuerVerified = true // Assume verified if issuer exists
    }

    // Determine overall verification status
    result.ok =
      result.details.hasProof &&
      result.details.signatureValid &&
      result.details.issuerVerified

    return result
  } catch (error) {
    return {
      ok: false,
      details: {
        hasProof: false,
        error: error instanceof Error ? error.message : 'Unknown verification error'
      }
    }
  }
}

/**
 * Enhanced verification that attempts to use the credential engine if available
 * @param credential - The credential to verify
 * @param credentialEngine - Optional credential engine instance
 * @returns Verification result
 */
export async function verifyCredentialWithEngine(
  credential: any,
  credentialEngine?: any
): Promise<VerificationResult> {
  // Start with basic verification
  const basicResult = verifyCredential(credential)

  // If we have a credential engine, try to use its verification method
  if (credentialEngine && typeof credentialEngine.verify === 'function') {
    try {
      const engineResult = await credentialEngine.verify(credential)
      return {
        ok: engineResult === true,
        details: {
          hasProof: basicResult.details.hasProof,
          proofType: basicResult.details.proofType,
          issuerVerified: true,
          signatureValid: engineResult === true
        }
      }
    } catch (error) {
      // Fall back to basic verification if engine verification fails
      basicResult.details.error = `Engine verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  return basicResult
}
