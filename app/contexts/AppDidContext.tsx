'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AppDidContextType {
  appInstanceDid: any
  hasZcap: boolean
  zcapInfo: any
}

const AppDidContext = createContext<AppDidContextType | undefined>(undefined)

interface AppDidProviderProps {
  children: ReactNode
}

export function AppDidProvider({ children }: AppDidProviderProps) {
  const [zcapInfo, setZcapInfo] = useState<any>(null)
  const [appInstanceDid, setAppInstanceDid] = useState<any>(null)

  useEffect(() => {
    // Check for stored zCap on mount
    const storedZcap = localStorage.getItem('delegatedWasZcap')
    const storedAppInstanceDid = localStorage.getItem('AppInstanceDID')
    if (storedZcap) {
      setZcapInfo(storedZcap)
    }
    if (storedAppInstanceDid) {
      try {
        const appInstanceDidObject = JSON.parse(storedAppInstanceDid)
        setAppInstanceDid(appInstanceDidObject)
      } catch (error) {
        console.error('Error parsing stored AppInstanceDID:', error)
      }
    }
  }, [])

  const hasZcap = !!zcapInfo

  const value: AppDidContextType = {
    appInstanceDid,
    hasZcap,
    zcapInfo,
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
