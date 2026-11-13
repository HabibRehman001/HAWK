import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BRAND = 'BlueHawk'

/** Sets document.title from the current route. */
const DocumentTitle = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = pathname === '/' ? BRAND : `${BRAND}`
  }, [pathname])

  return null
}

export default DocumentTitle
