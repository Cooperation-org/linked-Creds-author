import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const CACHE_DIR = path.join(process.cwd(), '.verification-cache')
const CACHE_FILE = path.join(CACHE_DIR, 'verification-codes.json')

interface CacheEntry {
  code: string
  email: string
  expiresAt: number
}

interface Cache {
  [key: string]: CacheEntry
}

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
}

// Initialize cache file if it doesn't exist
if (!fs.existsSync(CACHE_FILE)) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify({}))
}

function readCache(): Cache {
  try {
    const data = fs.readFileSync(CACHE_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading cache:', error)
    return {}
  }
}

function writeCache(cache: Cache) {
  try {
    // Write to a temporary file first
    const tempFile = `${CACHE_FILE}.tmp`
    fs.writeFileSync(tempFile, JSON.stringify(cache, null, 2))
    // Then rename to the actual file (atomic operation)
    fs.renameSync(tempFile, CACHE_FILE)
  } catch (error) {
    console.error('Error writing cache:', error)
    // Clean up temp file if it exists
    if (fs.existsSync(`${CACHE_FILE}.tmp`)) {
      fs.unlinkSync(`${CACHE_FILE}.tmp`)
    }
  }
}

function hashEmail(email: string): string {
  return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex')
}

export function storeVerificationCode(email: string, code: string, expiresInMinutes = 10) {
  const cache = readCache()
  const hashedEmail = hashEmail(email)
  
  cache[hashedEmail] = {
    code,
    email: email.toLowerCase(),
    expiresAt: Date.now() + expiresInMinutes * 60 * 1000
  }
  
  writeCache(cache)
}

export function getVerificationCode(email: string): string | null {
  const cache = readCache()
  const hashedEmail = hashEmail(email)
  const entry = cache[hashedEmail]
  
  if (!entry) return null
  
  if (Date.now() > entry.expiresAt) {
    delete cache[hashedEmail]
    writeCache(cache)
    return null
  }
  
  return entry.code
}

export function deleteVerificationCode(email: string) {
  const cache = readCache()
  const hashedEmail = hashEmail(email)
  
  if (cache[hashedEmail]) {
    delete cache[hashedEmail]
    writeCache(cache)
  }
}

export function getCacheSize(): number {
  return Object.keys(readCache()).length
}

export function getCacheKeys(): string[] {
  return Object.keys(readCache())
} 