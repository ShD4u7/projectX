import React, { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { translations } from "../utils/translations"

interface ExamQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

interface CertificationExamProps {
  exam: {
    questions: ExamQuestion[]
  }
  onComplete: (score: number) => void
}

export function CertificationExam({ exam, onComplete }: CertificationExamProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(exam.questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newSelectedAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === exam.questions[index].correctAnswer ? 1 : 0)
    }, 0)
  }

  const handleExamComplete = () => {
    const score = calculateScore()
    onComplete(score)
  }

  if (showResults) {
    const score = calculateScore()
    const totalQuestions = exam.questions.length
    const percentage = (score / totalQuestions) * 100
    const passed = percentage >= 70 // 70% правильных ответов для прохождения

    return (
      <Card>
        <CardHeader>
          <CardTitle>{translations.certification.examResults}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold mb-4">
            {passed ? translations.certification.examPassed : translations.certification.examFailed}
          </p>
          <p className="mb-2">
            {translations.certification.scoreMessage
              .replace("{score}", String(score))
              .replace("{total}", String(totalQuestions))}
          </p>
          <Progress value={percentage} className="w-full mb-4" />
          <p className="text-sm text-muted-foreground">
            {percentage.toFixed(0)}% {translations.certification.correct}
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleExamComplete}>{translations.certification.finishExam}</Button>
        </CardFooter>
      </Card>
    )
  }

  const currentQuestionData = exam.questions[currentQuestion]

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {translations.certification.questionNumber
            .replace("{current}", String(currentQuestion + 1))
            .replace("{total}", String(exam.questions.length))}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-lg">{currentQuestionData.question}</p>
        <RadioGroup
          value={String(selectedAnswers[currentQuestion])}
          onValueChange={(value) => handleAnswerSelect(Number(value))}
        >
          {currentQuestionData.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={String(index)} id={`answer-${index}`} />
              <Label htmlFor={`answer-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          {translations.certification.previousQuestion}
        </Button>
        <Button onClick={handleNextQuestion} disabled={selectedAnswers[currentQuestion] === -1}>
          {currentQuestion < exam.questions.length - 1
            ? translations.certification.nextQuestion
            : translations.certification.finishExam}
        </Button>
      </CardFooter>
    </Card>
  )
}

