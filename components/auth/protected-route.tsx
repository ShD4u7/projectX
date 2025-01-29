"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../lib/firebase"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/signin")
      }
    })

    return () => unsubscribe()
  }, [router])

  return <>{children}</>
}

