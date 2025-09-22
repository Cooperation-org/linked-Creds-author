import { LRUCache } from 'lru-cache'

declare global {
  var exchanges: any | undefined
}

export async function pollExchange({
  exchangeUrl,
  onFetchVP,
  stopPolling // Add stopPolling callback
}: {
  exchangeUrl: string
  onFetchVP: (vp: any) => void
  stopPolling: () => void // Stop polling when credential is fetched
}): Promise<void> {
  const result = await fetch(exchangeUrl, {})
  if (result.ok && result.status === 200) {
    const vp = (await result.json()) as any
    
    if (vp.zcap && vp.appInstanceDid) {
      try {
        const zcapStorage = {
          zcap: vp.zcap,
          timestamp: Date.now()
        };
        localStorage.setItem('zcap', JSON.stringify(zcapStorage));
        onFetchVP(vp)
        stopPolling()
      } catch (error) {
        console.error('Error storing zCap in localStorage:', error);
      }
    }
  }
}

export const exchanges =
  globalThis.exchanges || new LRUCache({ ttl: 5 * 60 * 1000, ttlAutopurge: true })

globalThis.exchanges = exchanges
