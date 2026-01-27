import { Link, useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import { Home, Menu, X, Settings, Building2 } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // Hide header on onboarding pages
  if (location.pathname.startsWith('/onboarding')) {
    return null
  }

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="ml-4 flex items-center gap-2 font-semibold text-lg">
            <Building2 className="w-6 h-6 text-primary" />
            <span>Wareflow</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/settings"
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-background border-r shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            activeProps={{
              className: 'flex items-center gap-3 p-3 rounded-lg bg-accent font-medium',
            }}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          {/* More navigation items will be added here */}
        </nav>

        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            Wareflow v1.0.0
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
