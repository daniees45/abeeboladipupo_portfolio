import { useRouter } from './lib/router'
import { PortfolioShell } from './features/portfolio/components/PortfolioShell'
import { DedicatedResumePage } from './features/portfolio/pages/DedicatedResumePage'
import { DedicatedProjectsPage } from './features/portfolio/pages/DedicatedProjectsPage'
import { AdminPortalPage } from './features/admin/AdminPortalPage'

function App() {
  const { currentPath, ADMIN_ROUTE } = useRouter()

  // Match secret admin portal path
  if (currentPath === ADMIN_ROUTE || currentPath === ADMIN_ROUTE.replace(/^\//, '')) {
    return <AdminPortalPage />
  }

  // Match dedicated sub-pages
  if (currentPath === '/resume' || currentPath === 'resume') {
    return <DedicatedResumePage />
  }

  if (currentPath === '/projects' || currentPath === 'projects') {
    return <DedicatedProjectsPage />
  }

  // Default to public portfolio landing page
  return <PortfolioShell />
}

export default App
