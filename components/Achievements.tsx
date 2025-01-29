import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { translations } from "../utils/translations"

interface AchievementsProps {
  completedDays: number[]
  allTasksCompleted: boolean
  perfectTests: number[]
  fastLearner: boolean
}

export function Achievements({ completedDays, allTasksCompleted, perfectTests, fastLearner }: AchievementsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.onboarding.achievements.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {completedDays.map((day) => (
            <Badge key={day} variant="secondary">
              {translations.onboarding.achievements.dayCompleted.replace("{day}", day.toString())}
            </Badge>
          ))}
          {allTasksCompleted && (
            <Badge variant="default">{translations.onboarding.achievements.allTasksCompleted}</Badge>
          )}
          {perfectTests.map((day) => (
            <Badge key={day} variant="default">
              {translations.onboarding.achievements.perfectTest} (День {day})
            </Badge>
          ))}
          {fastLearner && <Badge variant="default">{translations.onboarding.achievements.fastLearner}</Badge>}
        </div>
      </CardContent>
    </Card>
  )
}

