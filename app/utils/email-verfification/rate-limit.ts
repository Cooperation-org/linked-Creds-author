import { LRUCache } from 'lru-cache'

type RateLimitOptions = {
  interval: number
  uniqueTokenPerInterval: number
}

type RateLimitItem = {
  count: number
  lastReset: number
}

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache<string, RateLimitItem>({
    max: options.uniqueTokenPerInterval,
    ttl: options.interval
  })

  return {
    check: (limit: number, token: string): Promise<void> => {
      const now = Date.now()
      const tokenKey = `${token}`

      let tokenEntry = tokenCache.get(tokenKey)

      if (!tokenEntry || now - tokenEntry.lastReset > options.interval) {
        tokenEntry = {
          count: 0,
          lastReset: now
        }
      }

      tokenEntry.count += 1
      tokenCache.set(tokenKey, tokenEntry)

      if (tokenEntry.count > limit) {
        return Promise.reject(new Error('Rate limit exceeded'))
      }

      return Promise.resolve()
    }
  }
}
