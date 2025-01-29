import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Lock } from "lucide-react"
import { translations } from "../utils/translations"
import { OnboardingTest } from "./OnboardingTest"
import { AdditionalMaterials } from "./AdditionalMaterials"
import { OnboardingTimer } from "./OnboardingTimer"

interface OnboardingDayProps {
  day: number
  title: string
  description: string
  tasks: string[]
  completedTasks: boolean[]
  onTaskToggle: (index: number) => void
  progress: number
  isLocked: boolean
  test: {
    title: string
    questions: Array<{
      question: string
      options: string[]
      correctAnswer: number
    }>
  }
  onTestComplete: (score: number) => void
  additionalMaterials: Array<{
    type: "video" | "document" | "link"
    title: string
    url: string
  }>
  deadline: Date
}

export function OnboardingDay({
  day,
  title,
  description,
  tasks,
  completedTasks,
  onTaskToggle,
  progress,
  isLocked,
  test,
  onTestComplete,
  additionalMaterials,
  deadline,
}: OnboardingDayProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTest, setShowTest] = useState(false)

  if (isLocked) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Lock className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{translations.onboarding.moduleBlocked}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            {progress.toFixed(0)}% {translations.onboarding.dayProgress.toLowerCase()}
          </p>
        </div>
        {isExpanded && (
          <>
            <p className="text-muted-foreground mb-4">{description}</p>
            <ul className="space-y-2">
              {tasks.map((task, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`task-${day}-${index}`}
                    checked={completedTasks[index]}
                    onCheckedChange={() => onTaskToggle(index)}
                  />
                  <label
                    htmlFor={`task-${day}-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {task}
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-4">
              <OnboardingTimer deadline={deadline} />
              <AdditionalMaterials materials={additionalMaterials} />
            </div>
            {progress === 100 && !showTest && (
              <Button className="mt-4" onClick={() => setShowTest(true)}>
                Пройти тест
              </Button>
            )}
          </>
        )}
        {showTest && (
          <OnboardingTest
            title={test.title}
            questions={test.questions}
            onTestComplete={(score) => {
              onTestComplete(score)
              setShowTest(false)
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}

