"use client"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../lib/firebase"
import { signOut } from "firebase/auth"
import {
  LogOut,
  LayoutDashboard,
  Star,
  Settings,
  Users,
  CheckSquare,
  MessageSquare,
  Award,
  BarChart2,
  Eye,
  UserCircle,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useMediaQuery } from "react-responsive"

export function Sidebar() {
  const [user, loading] = useAuthState(auth)
  const isMobile = useMediaQuery({ maxWidth: 768 })

  if (isMobile) {
    return null // Мобильное меню будет отображаться отдельно
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Дашборд", href: "/dashboard", roles: ["ADMIN", "MANAGER", "MENTOR", "EMPLOYEE", "TRAINEE"] },
    { icon: GraduationCap, label: "Адаптация", href: "/onboarding", roles: ["ADMIN", "MANAGER", "MENTOR", "EMPLOYEE", "TRAINEE"] },
    { icon: Star, label: "Управление экзаменами", href: "/exams", roles: ["ADMIN", "MANAGER"] },
    { icon: Settings, label: "Системные настройки", href: "/settings", roles: ["ADMIN"] },
    { icon: Users, label: "Управление доступом", href: "/access", roles: ["ADMIN", "MANAGER"] },
    { icon: CheckSquare, label: "Проверка заданий", href: "/tasks", roles: ["ADMIN", "MANAGER", "MENTOR"] },
    {
      icon: MessageSquare,
      label: "Уведомления",
      href: "/notifications",
      roles: ["ADMIN", "MANAGER", "MENTOR", "EMPLOYEE", "TRAINEE"],
    },
    { icon: Award, label: "Сертификация", href: "/certification", roles: ["ADMIN", "MANAGER"] },
    { icon: UserCircle, label: "Профиль", href: "/profile", roles: ["ADMIN", "MANAGER", "MENTOR", "EMPLOYEE", "TRAINEE"] },
    // Новый пункт для администратора
    { icon: Users, label: "Одобрение пользователей", href: "/admin/users", roles: ["ADMIN"] },
  ]

  // Временно отключаем фильтрацию по ролям
  const filteredMenuItems = menuItems

  return (
    <div className="w-[240px] min-h-screen bg-background flex flex-col">
      <div className="p-4">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%CC%86%D0%BD_%D0%B1%D0%B5%D0%B7_%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-2-removebg-preview-npU5HzyuCUP0TpraKxnX9AZ4t0z3fd.png"
          alt="PRIDE"
          width={120}
          height={40}
          className="h-8 w-auto mb-6"
          priority
        />
        <div className="space-y-6">
          <div>
            <h2 className="text-foreground text-base mb-3 font-medium">Стратегия продаж</h2>
            <nav className="grid gap-1">
              {filteredMenuItems.map((item, index) => (
                <Link href={item.href} key={index} passHref>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-foreground/90 h-8 px-0 py-0 font-normal hover:bg-accent hover:text-accent-foreground group"
                  >
                    <item.icon className="mr-3 h-5 w-5 group-hover:text-primary transition-colors" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <div className="flex items-center justify-between text-foreground/90 px-0">
              <span className="text-sm font-medium">Опубликованные</span>
              <Eye className="h-4 w-4" />
            </div>
          </div>
          {user && (
            <Button
              variant="ghost"
              className="w-full justify-start text-foreground/90 h-8 px-0 py-0 font-normal hover:bg-accent hover:text-accent-foreground group"
              onClick={() => signOut(auth)}
            >
              <LogOut className="mr-3 h-5 w-5 group-hover:text-primary transition-colors" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
