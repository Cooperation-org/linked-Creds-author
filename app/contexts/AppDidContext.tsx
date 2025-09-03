'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getStoredZcap } from '../utils/zcapStorage'

interface AppDidContextType {
  appDidSigner: any
  setAppDidSigner: (signer: any) => void
  hasZcap: boolean
  zcapInfo: any
}

const AppDidContext = createContext<AppDidContextType | undefined>(undefined)

interface AppDidProviderProps {
  children: ReactNode
}

export function AppDidProvider({ children }: AppDidProviderProps) {
  const [appDidSigner, setAppDidSigner] = useState<any>(null)
  const [zcapInfo, setZcapInfo] = useState<any>(null)

  useEffect(() => {
    // Check for stored zCap on mount
    const storedZcap = getStoredZcap()
    if (storedZcap) {
      setZcapInfo(storedZcap)
    }
  }, [])

  const hasZcap = !!zcapInfo

  const value: AppDidContextType = {
    appDidSigner,
    setAppDidSigner,
    hasZcap,
    zcapInfo
  }

  return (
    <AppDidContext.Provider value={value}>
      {children}
    </AppDidContext.Provider>
  )
}

export function useAppDid() {
  const context = useContext(AppDidContext)
  if (context === undefined) {
    throw new Error('useAppDid must be used within an AppDidProvider')
  }
  return context
}
