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
        p: 3,
        border: '1px solid #003FE0',
        borderRadius: '10px',
        position: 'relative'
      }}
    >
      {/* QR Code and View Source */}
      {fileID && qrCodeDataUrl && (
        <Box
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Link
            href={`/api/credential-raw/${fileID}`}
            target='_blank'
            sx={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#003FE0',
              textDecoration: 'underline'
            }}
          >
            View Source
          </Link>
          <Image
            src={qrCodeDataUrl}
            alt='QR Code for credential source'
            width={120}
            height={120}
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
            size='small'
            sx={{ mr: 1, mb: 1 }}
            color={type === 'VerifiableCredential' ? 'primary' : 'default'}
          />
        ))}
      </Box>

      {/* Main Credential Info (schema-agnostic) */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mb: 2 }}>
          <SVGBadge />
          <Typography variant='h5' sx={{ fontWeight: 700 }}>
            {getPreferredTitle()}
          </Typography>
        </Box>

        {getPreferredDescription() && (
          <Typography sx={{ mb: 2 }}>{getPreferredDescription()}</Typography>
        )}
      </Box>

      {fileID && (
        <Button
          variant='outlined'
          onClick={handleViewOriginal}
          sx={{ textTransform: 'none', borderRadius: '100px' }}
        >
          View Original
        </Button>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Issuer Information */}
      {issuer.name && (
        <Box sx={{ mb: 3 }}>
          <Typography variant='h6' sx={{ mb: 1, fontWeight: 600 }}>
          <Typography variant='h6' sx={{ mb: 1, fontWeight: 600 }}>
            Issued By
          </Typography>
          <Typography>{issuer.name}</Typography>
          {issuer.url && (
            <Link href={issuer.url} target='_blank' sx={{ fontSize: '14px' }}>
            <Link href={issuer.url} target='_blank' sx={{ fontSize: '14px' }}>
              {issuer.url}
            </Link>
          )}
          {issuer.email && (
            <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
              {issuer.email}
            </Typography>
          )}
        </Box>
      )}

      {/* Subject/Achievement Information (handles array or object) */}
      {subject?.achievement && (
        <Box sx={{ mb: 3 }}>
          <Typography variant='h6' sx={{ mb: 1, fontWeight: 600 }}>
          <Typography variant='h6' sx={{ mb: 1, fontWeight: 600 }}>
            Achievement Details
          </Typography>

          {subject?.achievement?.name && (
            <Typography sx={{ fontWeight: 500, mb: 1 }}>
              {subject.achievement.name}
            </Typography>
          )}

          {subject?.achievement?.description && (
            <Typography sx={{ mb: 1 }}>{subject.achievement.description}</Typography>
          )}

          {getCriteriaText() && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontWeight: 500 }}>Criteria:</Typography>
              <Typography>{getCriteriaText()}</Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Additional info (issuer/subject IDs) */}
      {(issuerId || subjectId) && (
        <Box sx={{ mb: 2 }}>
          <Typography variant='h6' sx={{ mb: 1, fontWeight: 600 }}>
            Identifiers
          </Typography>
          {issuerId && (
            <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
              Issuer ID: {issuerId}
            </Typography>
          )}
          {subjectId && (
            <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
              Subject ID: {subjectId}
            </Typography>
          )}
        </Box>
      )}

      {/* Dates */}
      <Box sx={{ mb: 3 }}>
        {credential.issuanceDate && (
          <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
            Issued: {new Date(credential.issuanceDate).toLocaleDateString()}
          </Typography>
        )}
        {credential.expirationDate && (
          <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
            Expires: {new Date(credential.expirationDate).toLocaleDateString()}
          </Typography>
        )}
      </Box>

      {/* Credential Status */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#000E40' }}>
          Credential Status
        </Typography>


        <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <Box sx={{ borderRadius: '4px', bgcolor: '#C2F1BE', p: '4px' }}>
            <CheckMarkSVG />
          </Box>
          <Typography>Has a valid digital signature</Typography>
        </Box>


        {credential.credentialStatus && (
          <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <Box sx={{ borderRadius: '4px', bgcolor: '#C2F1BE', p: '4px' }}>
              <CheckMarkSVG />
            </Box>
            <Typography>Has credential status information</Typography>
          </Box>
        )}
      </Box>

      {/* Raw JSON Preview (collapsed by default) */}
      <details style={{ marginTop: '20px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>View Raw JSON</summary>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>View Raw JSON</summary>
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: '#f5f5f5',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px'
          }}
        >
          <pre style={{ margin: 0, fontSize: '12px' }}>
            {JSON.stringify(credential, null, 2)}
          </pre>
        </Box>
      </details>
    </Paper>
  )
}

export default GenericCredentialViewer
