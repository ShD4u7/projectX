"use client"

import { useMediaQuery } from "react-responsive"
import { Notifications } from "../../components/Notifications"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { Sidebar } from "../../components/sidebar"

export default function NotificationsPage() {
  const isMobile = useMediaQuery({ maxWidth: 768 })

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "MENTOR", "EMPLOYEE"]}>
      <div className="flex min-h-screen bg-background">
        {!isMobile && <Sidebar />}
        <main className="flex-1">
          <Notifications />
        </main>
      </div>
    </ProtectedRoute>
  )
}

