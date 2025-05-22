import { LRUCache } from 'lru-cache'

interface RateLimitOptions {
  interval: number
  uniqueTokenPerInterval: number
}

interface RateLimitItem {
  count: number
  resetTime: number
}

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache<string, RateLimitItem>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000
  })

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const now = Date.now()
        const tokenCount = tokenCache.get(token) || { count: 0, resetTime: now + options.interval }

        if (now > tokenCount.resetTime) {
          tokenCache.set(token, { count: 1, resetTime: now + options.interval })
          resolve()
        } else if (tokenCount.count < limit) {
          tokenCount.count++
          tokenCache.set(token, tokenCount)
          resolve()
        } else {
          reject(new Error('Rate limit exceeded'))
        }
      })
  }
} 