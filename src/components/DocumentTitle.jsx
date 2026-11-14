import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getProject } from '../data/projects'

const BRAND = 'BlueHawk'

/** Sets document.title from the current route. */
const DocumentTitle = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const projectMatch = pathname.match(/^\/projects\/([^/]+)\/?$/)
    if (projectMatch) {
      const project = getProject(projectMatch[1])
      document.title = project ? `${project.title} - ${BRAND}` : BRAND
      return
    }
    if (pathname === '/contact') {
      document.title = `Contact - ${BRAND}`
      return
    }
    if (pathname === '/privacy') {
      document.title = `Privacy Policy - ${BRAND}`
      return
    }
    if (pathname === '/terms-&-conditions') {
      document.title = `Terms & Conditions - ${BRAND}`
      return
    }
    document.title = BRAND
  }, [pathname])

  return null
}

export default DocumentTitle
