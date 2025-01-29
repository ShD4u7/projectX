"use client"

import { useMediaQuery } from "react-responsive"
import { SystemSettings } from "../../components/SystemSettings"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { Sidebar } from "../../components/sidebar"

export default function SettingsPage() {
  const isMobile = useMediaQuery({ maxWidth: 768 })

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex min-h-screen bg-background">
        {!isMobile && <Sidebar />}
        <main className="flex-1">
          <SystemSettings />
        </main>
      </div>
    </ProtectedRoute>
  )
}

