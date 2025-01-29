import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../lib/firebase"
import { signOut } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import {
  LogOut,
  LayoutDashboard,
  Star,
  Settings,
  Users,
  CheckSquare,
  MessageSquare,
  Award,
  Eye,
  UserCircle,
  GraduationCap,
} from "lucide-react"

export function MobileMenu() {
  const [user] = useAuthState(auth)
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: "Дашборд", href: "/dashboard", roles: ["ADMIN", "MANAGER", "MENTOR", "EMPLOYEE"] },
    { icon: GraduationCap, label: "Адаптация", href: "/onboarding", roles: ["ADMIN", "MANAGER", "MENTOR", "EMPLOYEE"] },
    { icon: Star, label: "Управление экзаменами", href: "/exams", roles: ["ADMIN", "MANAGER"] },
    { icon: Settings, label: "Системные настройки", href: "/settings", roles: ["ADMIN"] },
    { icon: Users, label: "Управление доступом", href: "/access", roles: ["ADMIN", "MANAGER"] },
    { icon: CheckSquare, label: "Проверка заданий", href: "/tasks", roles: ["ADMIN", "MANAGER", "MENTOR"] },
    {
      icon: MessageSquare,
      label: "Уведомления",
      href: "/notifications",
      roles: ["ADMIN", "MANAGER", "MENTOR", "EMPLOYEE"],
    },
    { icon: Award, label: "Сертификация", href: "/certification", roles: ["ADMIN", "MANAGER"] },
    { icon: UserCircle, label: "Профиль", href: "/profile", roles: ["ADMIN", "MANAGER", "MENTOR", "EMPLOYEE"] },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-0 w-9 h-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <nav className="flex flex-col h-full">
          <div className="py-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D0%94%D0%B8%D0%B7%D0%B0%D0%B8%CC%86%D0%BD_%D0%B1%D0%B5%D0%B7_%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-2-removebg-preview-npU5HzyuCUP0TpraKxnX9AZ4t0z3fd.png"
              alt="PRIDE"
              width={120}
              height={40}
              className="h-8 w-auto mb-6"
              priority
            />
          </div>
          <div className="flex-1 py-6">
            <h2 className="text-foreground text-base mb-3 font-medium">Стратегия продаж</h2>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href} passHref>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-foreground/90 h-9 px-2 py-1 font-normal hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <div className="py-6">
            <div className="flex items-center justify-between text-foreground/90 px-2 mb-2">
              <span className="text-sm font-medium">Опубликованные</span>
              <Eye className="h-4 w-4" />
            </div>
            {user && (
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground/90 h-9 px-2 py-1 font-normal hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  signOut(auth)
                  setIsOpen(false)
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </Button>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

