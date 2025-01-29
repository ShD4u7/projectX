"use client"

import { useMediaQuery } from "react-responsive"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { Sidebar } from "../../components/sidebar"
import { OnboardingProgram } from "../../components/onboarding-program"

export default function OnboardingPage() {
  const isMobile = useMediaQuery({ maxWidth: 768 })

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        {!isMobile && <Sidebar />}
        <main className="flex-1 overflow-y-auto">
          <OnboardingProgram />
        </main>
      </div>
    </ProtectedRoute>
  )
}

