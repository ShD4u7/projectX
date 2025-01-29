import { translations } from "../utils/translations"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function SalesStrategy() {
  return (
    <Card className="w-full max-w-3xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{translations.salesStrategy.title}</h2>
            <p className="text-muted-foreground">{translations.salesStrategy.subtitle}</p>
          </div>
          <Button variant="outline" size="icon">
            <span className="sr-only">Меню</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>{translations.salesStrategy.passingScore}</span>
            <span>80%</span>
          </div>
          <div className="flex justify-between">
            <span>{translations.salesStrategy.startDate}</span>
            <span>07 Сен 2022 10:30 AM</span>
          </div>
          <div className="flex justify-between">
            <span>{translations.salesStrategy.endDate}</span>
            <span>28 Окт 2022 11:30 PM</span>
          </div>
          <div className="flex justify-between">
            <span>{translations.salesStrategy.assigned}</span>
            <span>100 Учащихся, 20 Команд</span>
          </div>
          <div className="flex justify-between items-center">
            <span>{translations.salesStrategy.published}</span>
            <Switch />
          </div>
        </div>
        <Button className="mt-6 w-full">{translations.salesStrategy.open}</Button>
      </CardContent>
    </Card>
  )
}

