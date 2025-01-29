import React, { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { translations } from "../utils/translations"

interface TestQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

interface OnboardingTestProps {
  title: string
  questions: TestQuestion[]
  onTestComplete: (score: number) => void
}

export function OnboardingTest({ title, questions, onTestComplete }: OnboardingTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newSelectedAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0)
    }, 0)
  }

  const handleTestComplete = () => {
    const score = calculateScore()
    onTestComplete(score)
  }

  if (showResults) {
    const score = calculateScore()
    const passed = score >= Math.ceil(questions.length * 0.7) // 70% правильных ответов для прохождения

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title} - Результаты</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{passed ? translations.onboarding.testResults.passed : translations.onboarding.testResults.failed}</p>
          <p>
            {translations.onboarding.testResults.score
              .replace("{score}", String(score))
              .replace("{total}", String(questions.length))}
          </p>
        </CardContent>
        <CardFooter>
          {passed ? (
            <Button onClick={handleTestComplete}>{translations.onboarding.testResults.next}</Button>
          ) : (
            <Button
              onClick={() => {
                setCurrentQuestion(0)
                setSelectedAnswers(Array(questions.length).fill(-1))
                setShowResults(false)
              }}
            >
              {translations.onboarding.testResults.retry}
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{questions[currentQuestion].question}</p>
        <RadioGroup
          value={String(selectedAnswers[currentQuestion])}
          onValueChange={(value) => handleAnswerSelect(Number(value))}
        >
          {questions[currentQuestion].options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={String(index)} id={`answer-${index}`} />
              <Label htmlFor={`answer-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button onClick={handleNextQuestion} disabled={selectedAnswers[currentQuestion] === -1}>
          {currentQuestion < questions.length - 1 ? "Следующий вопрос" : "Завершить тест"}
        </Button>
      </CardFooter>
    </Card>
  )
}

