'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export function useCollection<T>(fetchFn: () => Promise<T[]>) {
  const fetchRef = useRef(fetchFn)
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const data = await fetchRef.current()
    setItems(data)
    setLoading(false)
  }, [])

  useEffect(() => { reload() }, [reload])

  return { items, loading, reload }
}
