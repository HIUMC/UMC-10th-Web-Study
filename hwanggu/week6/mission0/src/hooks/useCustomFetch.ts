import { useState, useEffect } from 'react'
import cache from './cache'

interface UseCustomFetchProps {
  queryKey: unknown[]
  url: string
  retry?: number
  staleTime?: number // 추가 (밀리초 단위)
}

function useCustomFetch({ queryKey, url, retry = 0, staleTime = 0 }: UseCustomFetchProps) {
  const [data, setData] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const cacheKey = JSON.stringify(queryKey)
    const cached = cache[cacheKey]
    const now = Date.now()

    // 캐시 있고 staleTime 안 지났으면 재요청 안 함
    if (cached && now - cached.timestamp < staleTime) {
      console.log('캐시 사용!')
      setTimeout(() => setData(cached.data), 0)
      return
    }

    const fetchData = async (retryCount: number) => {
      setIsLoading(true)
      setIsError(false)

      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`${res.status}`)
        const json = await res.json()
        cache[cacheKey] = { data: json, timestamp: Date.now() } // 캐시 저장
        setData(json)
      } catch {
        if (retryCount > 0) {
          console.log(`재시도... 남은 횟수: ${retryCount}`)
          fetchData(retryCount - 1)
        } else {
          setIsError(true)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData(retry)
  }, [JSON.stringify(queryKey)]) // eslint-disable-line

  return { data, isLoading, isError }
}

export default useCustomFetch