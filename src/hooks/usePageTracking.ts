import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { logEvent } from 'firebase/analytics'
import { analytics } from '../firebase/index'

export const usePageTracking = () => {
  const location = useLocation()

  useEffect(() => {
    if (!analytics) return
    const track = async () => {
      const a = await analytics
      if (a) logEvent(a, 'page_view', { page_path: location.pathname })
    }
    track()
  }, [location.pathname])
}
