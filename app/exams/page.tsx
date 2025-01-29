"use client"

import { useMediaQuery } from "react-responsive"
import { ExamManagement } from "../../components/ExamManagement"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { Sidebar } from "../../components/sidebar"

export default function ExamsPage() {
  const isMobile = useMediaQuery({ maxWidth: 768 })

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
      <div className="flex min-h-screen bg-background">
        {!isMobile && <Sidebar />}
        <main className="flex-1">
          <ExamManagement />
        </main>
      </div>
    </ProtectedRoute>
  )
}

