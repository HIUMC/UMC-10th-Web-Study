interface CacheEntry {
  data: unknown
  timestamp: number
}

const cache: Record<string, CacheEntry> = {}

export default cache