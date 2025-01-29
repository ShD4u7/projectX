"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../lib/firebase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "auth/email-already-in-use":
            setError("Этот email уже используется")
            break
          case "auth/invalid-email":
            setError("Некорректный email")
            break
          case "auth/weak-password":
            setError("Слишком слабый пароль. Используйте минимум 6 символов")
            break
          default:
            setError("Произошла ошибка при регистрации. Попробуйте еще раз")
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D0%94%D0%B8%D0%B7%D0%B0%D0%B8%CC%86%D0%BD_%D0%B1%D0%B5%D0%B7_%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-2-removebg-preview-npU5HzyuCUP0TpraKxnX9AZ4t0z3fd.png"
            alt="PRIDE"
            width={180}
            height={60}
            priority
            className="h-12 w-auto"
          />
        </div>
        <form onSubmit={handleSubmit} className="border border-border rounded-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">Регистрация</h2>
          {error && <p className="text-destructive mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-muted-foreground text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input text-foreground"
            />
          </div>
          <div className="mb-6">
            <label className="block text-muted-foreground text-sm font-medium mb-2" htmlFor="password">
              Пароль
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input text-foreground"
            />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading} className={loading ? "opacity-50 cursor-not-allowed" : ""}>
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

