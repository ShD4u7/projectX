import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const topPerformers = [
  { name: "Айгуль Нурланова", sales: "₸123,456,700", avatar: "/avatars/01.png" },
  { name: "Ерлан Сатыбалдиев", sales: "₸98,765,400", avatar: "/avatars/02.png" },
  { name: "Динара Жумабаева", sales: "₸87,654,300", avatar: "/avatars/03.png" },
  { name: "Арман Сериков", sales: "₸76,543,200", avatar: "/avatars/04.png" },
  { name: "Гульнара Ахметова", sales: "₸65,432,100", avatar: "/avatars/05.png" },
]

export function TopPerformers() {
  return (
    <div className="space-y-8">
      {topPerformers.map((performer, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={performer.avatar} alt={performer.name} />
            <AvatarFallback>
              {performer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{performer.name}</p>
            <p className="text-sm text-muted-foreground">{performer.sales}</p>
          </div>
          <div className="ml-auto font-medium">#{index + 1}</div>
        </div>
      ))}
    </div>
  )
}

