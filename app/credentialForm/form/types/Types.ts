// Interfaces for the credential data
export interface Address {
  addressCountry: string
  addressRegion: string
  addressLocality: string
  streetAddress: string
  postalCode: string
}

export interface Achievement {
  id: string
  type: string[]
  criteria: { narrative: string }
  description: string
  name: string
  imageUrl: string
}

export interface CredentialSubject {
  type: string[]
  name: string
  address?: Address
  achievement: Achievement[]
}

export interface Issuer {
  id: string
  type: string[]
}

export interface Credential {
  '@context': string[]
  type: string[]
  issuer: Issuer
  issuanceDate: string
  expirationDate?: string
  awardedDate?: string
  name: string
  credentialSubject: CredentialSubject
}

interface Portfolio {
  name: string
  url: string
  googleId?: string
  wasId?: string
}

// Interfaces for the form fields
export interface FormData {
  storageOption: string
  fullName: string
  persons: string
  credentialName: string
  credentialDuration: string
  credentialDescription: string
  portfolio: Portfolio[]
  evidenceLink: string
  evidenceDescription: string
  explainAnswer: string
  howKnow: string
  qualification: string
  [key: string]: string | number | Portfolio[] | undefined
}

// Component Props for the form
export interface FormProps {
  formData: FormData
  // onChange: (data: Partial<FormData>) => void;
  // onSubmit: (data: FormData) => void;
}

// Component Props for the credential display
export interface CredentialDisplayProps {
  credential: Credential
  onCopy: () => void
}

export interface FileItem {
  id: string
  file: File
  name: string
  url: string
  isFeatured: boolean
  uploaded: boolean
  fileExtension: string
  googleId?: string
  wasId?: string
}
