"use client"

import { useMediaQuery } from "react-responsive"
import { TaskReview } from "../../components/TaskReview"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { Sidebar } from "../../components/sidebar"

export default function TasksPage() {
  const isMobile = useMediaQuery({ maxWidth: 768 })

  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "MENTOR"]}>
      <div className="flex min-h-screen bg-background">
        {!isMobile && <Sidebar />}
        <main className="flex-1">
          <TaskReview />
        </main>
      </div>
    </ProtectedRoute>
  )
}

