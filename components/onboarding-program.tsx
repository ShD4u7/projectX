import React, { useState, useEffect } from "react"
import { translations } from "../utils/translations"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OnboardingDay } from "./OnboardingDay"
import { Achievements } from "./Achievements"
import { saveUserProgress, getUserProgress } from "../services/firebaseService"
import { useAuth } from "../components/auth/AuthProvider"

interface OnboardingData {
  [key: string]: {
    title: string
    description: string
    tasks: string[]
    test: {
      title: string
      questions: Array<{
        question: string
        options: string[]
        correctAnswer: number
      }>
    }
    additionalMaterials: Array<{
      type: "video" | "document" | "link"
      title: string
      url: string
    }>
  }
}

export function OnboardingProgram() {
  const { user } = useAuth()
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean[] }>({})
  const [completedTests, setCompletedTests] = useState<{ [key: string]: boolean }>({})
  const [achievements, setAchievements] = useState({
    completedDays: [],
    allTasksCompleted: false,
    perfectTests: [],
    fastLearner: false,
  })

  const onboardingData: OnboardingData = translations.onboarding.days

  useEffect(() => {
    if (user) {
      getUserProgress(user.uid)
        .then((progress) => {
          if (progress) {
            setCompletedTasks(progress.completedTasks || {})
            setCompletedTests(progress.completedTests || {})
            setAchievements(
              progress.achievements || {
                completedDays: [],
                allTasksCompleted: false,
                perfectTests: [],
                fastLearner: false,
              },
            )
          } else {
            const initialCompletedTasks = Object.fromEntries(
              Object.entries(onboardingData).map(([day, data]) => [day, Array(data.tasks.length).fill(false)]),
            )
            setCompletedTasks(initialCompletedTasks)
            setCompletedTests(Object.fromEntries(Object.keys(onboardingData).map((day) => [day, false])))
          }
        })
        .catch((error) => {
          console.error("Error fetching user progress:", error)
          // Set default values in case of error
          const initialCompletedTasks = Object.fromEntries(
            Object.entries(onboardingData).map(([day, data]) => [day, Array(data.tasks.length).fill(false)]),
          )
          setCompletedTasks(initialCompletedTasks)
          setCompletedTests(Object.fromEntries(Object.keys(onboardingData).map((day) => [day, false])))
        })
    }
  }, [user, onboardingData])

  const calculateDayProgress = (day: string) => {
    if (!completedTasks[day]) return 0
    const completedCount = completedTasks[day].filter(Boolean).length
    const totalTasks = completedTasks[day].length
    return (completedCount / totalTasks) * 100
  }

  const calculateTotalProgress = () => {
    const totalCompleted = Object.values(completedTasks).flat().filter(Boolean).length
    const totalTasks = Object.values(completedTasks).flat().length
    return (totalCompleted / totalTasks) * 100
  }

  const handleTaskToggle = (day: string, taskIndex: number) => {
    setCompletedTasks((prev) => {
      const updatedTasks = {
        ...prev,
        [day]: prev[day]
          ? prev[day].map((task, index) => (index === taskIndex ? !task : task))
          : Array(onboardingData[day].tasks.length).fill(false),
      }
      updateAchievements(updatedTasks, completedTests)
      if (user) {
        saveUserProgress(user.uid, { completedTasks: updatedTasks, completedTests, achievements })
      }
      return updatedTasks
    })
  }

  const handleTestComplete = (day: string, score: number) => {
    const totalQuestions = onboardingData[day].test.questions.length
    const passed = score >= Math.ceil(totalQuestions * 0.7)

    setCompletedTests((prev) => {
      const updatedTests = { ...prev, [day]: passed }
      updateAchievements(completedTasks, updatedTests)
      if (user) {
        saveUserProgress(user.uid, { completedTasks, completedTests: updatedTests, achievements })
      }
      return updatedTests
    })
  }

  const updateAchievements = (tasks: typeof completedTasks, tests: typeof completedTests) => {
    const completedDays = Object.keys(tests)
      .filter((day) => tests[day])
      .map((day) => Number.parseInt(day.replace("day", "")))
    const allTasksCompleted = Object.values(tasks).every((dayTasks) => dayTasks.every(Boolean))
    const perfectTests = Object.keys(tests)
      .filter((day) => tests[day])
      .map((day) => Number.parseInt(day.replace("day", "")))
    const fastLearner = calculateTotalProgress() === 100 && Object.keys(onboardingData).length === completedDays.length

    setAchievements({
      completedDays,
      allTasksCompleted,
      perfectTests,
      fastLearner,
    })
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{translations.onboarding.title}</h1>
        <p className="text-muted-foreground mt-2">{translations.onboarding.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{translations.onboarding.progress}</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={calculateTotalProgress()} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            {calculateTotalProgress().toFixed(0)}% {translations.onboarding.progress.toLowerCase()}
          </p>
        </CardContent>
      </Card>

      <Achievements {...achievements} />

      <div className="space-y-6">
        {Object.entries(onboardingData).map(([day, data], index) => (
          <OnboardingDay
            key={day}
            day={index + 1}
            title={data.title}
            description={data.description}
            tasks={data.tasks}
            completedTasks={completedTasks[day] || []}
            onTaskToggle={(taskIndex) => handleTaskToggle(day, taskIndex)}
            progress={calculateDayProgress(day)}
            isLocked={index > 0 && !completedTests[`day${index}`]}
            test={data.test}
            onTestComplete={(score) => handleTestComplete(day, score)}
            additionalMaterials={data.additionalMaterials}
            deadline={new Date(Date.now() + 24 * 60 * 60 * 1000)} // Set deadline to 24 hours from now
          />
        ))}
      </div>
    </div>
  )
}

