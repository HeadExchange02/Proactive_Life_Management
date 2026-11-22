import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import DashboardFooter from '../components/layout/DashboardFooter'

export default function DashboardLayout() {
  const { pathname } = useLocation()
  // Keyed by module (first two segments) so switching tabs inside a hub keeps its state.
  const moduleKey = pathname.split('/').slice(0, 3).join('/')

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-main)]">
      <Navbar />
      <main key={moduleKey} className="flex-1 animate-page-in">
        <Outlet />
      </main>
      <DashboardFooter />
    </div>
  )
}
