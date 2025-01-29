"use client"

import { useAuth } from "../components/auth/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loading } from "../components/ui/loading"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/signin")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return <Loading />
  }

  return null
}

