"use client"

import { useMediaQuery } from "react-responsive"
import { Certification } from "../../components/Certification"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { Sidebar } from "../../components/sidebar"

export default function CertificationPage() {
  const isMobile = useMediaQuery({ maxWidth: 768 })

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
      <div className="flex min-h-screen bg-background">
        {!isMobile && <Sidebar />}
        <main className="flex-1">
          <Certification />
        </main>
      </div>
    </ProtectedRoute>
  )
}

