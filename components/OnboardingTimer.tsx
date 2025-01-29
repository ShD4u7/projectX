import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { translations } from "../utils/translations"

interface OnboardingTimerProps {
  deadline: Date
}

export function OnboardingTimer({ deadline }: OnboardingTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const difference = deadline.getTime() - now.getTime()
      setTimeLeft(Math.max(0, difference))
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  const hours = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  const progress = 100 - (timeLeft / (24 * 60 * 60 * 1000)) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.onboarding.timer.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">
          {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2">{translations.onboarding.timer.dayDeadline}</p>
      </CardContent>
    </Card>
  )
}

