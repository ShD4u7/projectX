"use client"

import { useMediaQuery } from "react-responsive"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { Sidebar } from "../../components/sidebar"
import { Dashboard } from "../../components/Dashboard"

export default function DashboardPage() {
  const isMobile = useMediaQuery({ maxWidth: 768 })

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        {!isMobile && <Sidebar />}
        <main className="flex-1">
          <Dashboard />
        </main>
      </div>
    </ProtectedRoute>
  )
}

