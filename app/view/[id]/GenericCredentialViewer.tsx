'use client'
import React from 'react'
import { Box, Typography, Paper, Divider, Link, Chip, Button } from '@mui/material'
import { SVGBadge, CheckMarkSVG } from '../../Assets/SVGs'
import Image from 'next/image'
import { GoogleDriveStorage } from '@cooperation/vc-storage'
import { getAccessToken, getFileViaFirebase } from '../../firebase/storage'
import { verifyCredentialWithEngine } from '../../utils/verification'

interface GenericCredentialViewerProps {
  credential: any
  qrCodeDataUrl?: string
  fileID?: string
}

const GenericCredentialViewer: React.FC<GenericCredentialViewerProps> = ({
  credential,
  qrCodeDataUrl,
  fileID
}) => {
  // Extract issuer information
  const getIssuerInfo = () => {
    if (typeof credential.issuer === 'string') {
      return { name: credential.issuer }
    }
    return credential.issuer || {}
  }

  // Extract subject information for OpenBadge credentials
  const getSubjectInfo = () => {
    const subject = credential.credentialSubject || {}


    // For OpenBadge credentials
    if (subject.achievement && !Array.isArray(subject.achievement)) {
      return {
        name: subject.id || 'Unknown Subject',
        achievement: subject.achievement,
        type: subject.type
      }
    }


    // For our native format
    if (subject.achievement && Array.isArray(subject.achievement)) {
      return {
        name: subject.name,
        achievement: subject.achievement[0],
        type: subject.type
      }
    }


    return subject
  }

  const issuer = getIssuerInfo()
  const subject = getSubjectInfo()
  const credentialTypes = Array.isArray(credential.type)
    ? credential.type
    : [credential.type]

  // Schema-agnostic helpers
  const getPreferredTitle = (): string => {
    return (
      credential?.name ||
      subject?.achievement?.name ||
      subject?.achievement?.title ||
      subject?.name ||
      credential?.title ||
      'Untitled Credential'
    )
  }

  const getPreferredDescription = (): string | undefined => {
    return (
      credential?.description ||
      subject?.achievement?.description ||
      subject?.description ||
      undefined
    )
  }

  const getCriteriaText = (): string | undefined => {
    const c = subject?.achievement?.criteria
    if (!c) return undefined
    if (typeof c === 'string') return c
    if (typeof c?.narrative === 'string') return c.narrative
    try {
      return JSON.stringify(c)
    } catch {
      return undefined
    }
  }

  const subjectId = credential?.credentialSubject?.id || undefined
  const issuerId =
    typeof credential?.issuer === 'object' ? credential?.issuer?.id : undefined

  // Resolve original via RELATIONS in the same folder
  const findOriginalForNormalized = async (
    normalizedId: string
  ): Promise<string | null> => {
    try {
      const accessToken1 = await getAccessToken(normalizedId)
      const storage = new GoogleDriveStorage(accessToken1)
      const parents = await storage.getFileParents(normalizedId)
      const folderId = Array.isArray(parents) ? parents[0] : parents
      if (!folderId) return null
      const files = await storage.findFolderFiles(folderId)
      const relationsFile = files.find((f: any) => f.name === 'RELATIONS')
      if (!relationsFile) return null
      let relationsData: any = relationsFile?.content
        ? relationsFile.content?.body
          ? JSON.parse(relationsFile.content.body)
          : relationsFile.content
        : null
      if (!relationsData) {
        const relationsContent = await storage.retrieve(relationsFile.id)
        relationsData = relationsContent?.data?.body
          ? JSON.parse(relationsContent.data.body)
          : relationsContent?.data
      }
      const originals = relationsData?.originals
      if (Array.isArray(originals) && originals.length > 0) return originals[0]
      return null
    } catch {
      return null
    }
  }

  const handleViewOriginal = async () => {
    try {
      if (!fileID) return
      const originalId = await findOriginalForNormalized(fileID)
      if (!originalId) {
        window.alert('Original credential not linked.')
        return
      }
      const file = await getFileViaFirebase(originalId)
      const body = file?.body ? file.body : null
      if (!body) {
        window.open(`/api/credential-raw/${originalId}`, '_blank')
        return
      }
      const pretty = JSON.stringify(JSON.parse(body), null, 2)
      const blob = new Blob([pretty], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (err) {
      console.error('View Original failed:', err)
      window.alert('Failed to open original credential.')
    }
  }

  const handleVerifyOriginal = async () => {
    try {
      if (!fileID) return
      const originalId = await findOriginalForNormalized(fileID)
      if (!originalId) {
        window.alert('Original credential not linked.')
        return
      }
      const file = await getFileViaFirebase(originalId)
      const original = file?.body ? JSON.parse(file.body) : null
      if (!original) {
        window.alert('Original credential not found.')
        return
      }
      const result = await verifyCredentialWithEngine(original)
      window.alert(
        result.ok ? 'Original verified successfully.' : 'Original verification failed.'
      )
    } catch (err) {
      console.error('Verify Original failed:', err)
      window.alert('Verification error.')
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        border: '1px solid #003FE0',
        borderRadius: '10px',
        position: 'relative',
        maxWidth: '100%',
        overflow: 'hidden'
      }}
    >
      {/* QR Code and View Source */}
      {fileID && qrCodeDataUrl && (
        <Box
          sx={{
            position: { xs: 'static', sm: 'absolute' },
            top: { sm: '10px' },
            right: { sm: '10px' },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: '8px', sm: '12px' },
            mb: { xs: 2, sm: 0 },
            maxWidth: { xs: '100%', sm: 'auto' }
          }}
        >
          <Link
            href={`/api/credential-raw/${fileID}`}
            target='_blank'
            sx={{
              fontSize: { xs: '14px', sm: '16px' },
              fontWeight: 600,
              color: '#003FE0',
              textDecoration: 'underline',
              wordBreak: 'break-all'
            }}
          >
            View Source
          </Link>
          <Image
            src={qrCodeDataUrl}
            alt='QR Code for credential source'
            width={80}
            height={80}
            style={{
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </Box>
      )}

      {/* Credential Types */}
      <Box sx={{ mb: 2 }}>
        {credentialTypes.map((type: string, index: number) => (
          <Chip
            key={index}
            label={type}
            size='small'
            sx={{ mr: 1, mb: 1 }}
            color={type === 'VerifiableCredential' ? 'primary' : 'default'}
          />
        ))}
      </Box>

      {/* Main Credential Info (schema-agnostic) */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            gap: '5px',
            alignItems: 'flex-start',
            mb: 2,
            flexWrap: 'wrap'
          }}
        >
          <SVGBadge />
          <Typography
            variant='h5'
            sx={{
              fontWeight: 700,
              fontSize: { xs: '18px', sm: '20px', md: '24px' },
              lineHeight: { xs: '22px', sm: '24px', md: '28px' },
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {getPreferredTitle()}
          </Typography>
        </Box>

        {getPreferredDescription() && (
          <Typography
            sx={{
              mb: 2,
              fontSize: { xs: '14px', sm: '16px' },
              lineHeight: { xs: '20px', sm: '22px' },
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {getPreferredDescription()}
          </Typography>
        )}
      </Box>

      {fileID && (
        <Button
          variant='outlined'
          onClick={handleViewOriginal}
          sx={{
            textTransform: 'none',
            borderRadius: '100px',
            fontSize: { xs: '14px', sm: '16px' },
            py: { xs: 1, sm: 1.5 },
            px: { xs: 2, sm: 3 },
            mb: 2
          }}
        >
          View Original
        </Button>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Issuer Information */}
      {issuer.name && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant='h6'
            sx={{
              mb: 1,
              fontWeight: 600,
              fontSize: { xs: '16px', sm: '18px' }
            }}
          >
            Issued By
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '14px', sm: '16px' },
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {issuer.name}
          </Typography>
          {issuer.url && (
            <Link
              href={issuer.url}
              target='_blank'
              sx={{
                fontSize: { xs: '12px', sm: '14px' },
                wordBreak: 'break-all',
                overflowWrap: 'break-word',
                display: 'block',
                mt: 0.5
              }}
            >
              {issuer.url}
            </Link>
          )}
          {issuer.email && (
            <Typography
              sx={{
                fontSize: { xs: '12px', sm: '14px' },
                color: 'text.secondary',
                wordBreak: 'break-all',
                overflowWrap: 'break-word',
                mt: 0.5
              }}
            >
              {issuer.email}
            </Typography>
          )}
        </Box>
      )}

      {/* Subject/Achievement Information (handles array or object) */}
      {subject?.achievement && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant='h6'
            sx={{
              mb: 1,
              fontWeight: 600,
              fontSize: { xs: '16px', sm: '18px' }
            }}
          >
            Achievement Details
          </Typography>

          {subject?.achievement?.name && (
            <Typography
              sx={{
                fontWeight: 500,
                mb: 1,
                fontSize: { xs: '14px', sm: '16px' },
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {subject.achievement.name}
            </Typography>
          )}

          {subject?.achievement?.description && (
            <Typography
              sx={{
                mb: 1,
                fontSize: { xs: '14px', sm: '16px' },
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {subject.achievement.description}
            </Typography>
          )}

          {getCriteriaText() && (
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '14px', sm: '16px' }
                }}
              >
                Criteria:
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '14px', sm: '16px' },
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {getCriteriaText()}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Additional info (issuer/subject IDs) */}
      {(issuerId || subjectId) && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant='h6'
            sx={{
              mb: 1,
              fontWeight: 600,
              fontSize: { xs: '16px', sm: '18px' }
            }}
          >
            Identifiers
          </Typography>
          {issuerId && (
            <Box sx={{ mb: 1 }}>
              <Typography
                sx={{
                  fontSize: { xs: '12px', sm: '14px' },
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                Issuer ID:
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '11px', sm: '12px' },
                  color: 'text.secondary',
                  wordBreak: 'break-all',
                  overflowWrap: 'break-word',
                  fontFamily: 'monospace',
                  backgroundColor: '#f5f5f5',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  mt: 0.5
                }}
              >
                {issuerId}
              </Typography>
            </Box>
          )}
          {subjectId && (
            <Box sx={{ mb: 1 }}>
              <Typography
                sx={{
                  fontSize: { xs: '12px', sm: '14px' },
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                Subject ID:
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '11px', sm: '12px' },
                  color: 'text.secondary',
                  wordBreak: 'break-all',
                  overflowWrap: 'break-word',
                  fontFamily: 'monospace',
                  backgroundColor: '#f5f5f5',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  mt: 0.5
                }}
              >
                {subjectId}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Dates */}
      <Box sx={{ mb: 3 }}>
        {credential.issuanceDate && (
          <Typography
            sx={{
              fontSize: { xs: '12px', sm: '14px' },
              color: 'text.secondary',
              mb: 0.5
            }}
          >
            Issued: {new Date(credential.issuanceDate).toLocaleDateString()}
          </Typography>
        )}
        {credential.expirationDate && (
          <Typography
            sx={{
              fontSize: { xs: '12px', sm: '14px' },
              color: 'text.secondary'
            }}
          >
            Expires: {new Date(credential.expirationDate).toLocaleDateString()}
          </Typography>
        )}
      </Box>

      {/* Credential Status */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
        <Typography
          sx={{
            fontSize: { xs: '14px', sm: '16px' },
            fontWeight: 700,
            color: '#000E40'
          }}
        >
          Credential Status
        </Typography>

        <Box sx={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
          <Box sx={{ borderRadius: '4px', bgcolor: '#C2F1BE', p: '4px', flexShrink: 0 }}>
            <CheckMarkSVG />
          </Box>
          <Typography
            sx={{
              fontSize: { xs: '13px', sm: '14px' },
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            Has a valid digital signature
          </Typography>
        </Box>


        {credential.credentialStatus && (
          <Box sx={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
            <Box
              sx={{ borderRadius: '4px', bgcolor: '#C2F1BE', p: '4px', flexShrink: 0 }}
            >
              <CheckMarkSVG />
            </Box>
            <Typography
              sx={{
                fontSize: { xs: '13px', sm: '14px' },
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              Has credential status information
            </Typography>
          </Box>
        )}
      </Box>

      {/* Raw JSON Preview (collapsed by default) */}
      <details style={{ marginTop: '20px' }}>
        <summary
          style={{
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            padding: '8px 0'
          }}
        >
          View Raw JSON
        </summary>
        <Box
          sx={{
            mt: 2,
            p: { xs: 1, sm: 2 },
            bgcolor: '#f5f5f5',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}
        >
          <pre
            style={{
              margin: 0,
              fontSize: '10px',
              wordBreak: 'break-all',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {JSON.stringify(credential, null, 2)}
          </pre>
        </Box>
      </details>
    </Paper>
  )
}

export default GenericCredentialViewer
