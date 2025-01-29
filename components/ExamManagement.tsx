import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { translations } from "../utils/translations"
import { ExamList } from "./ExamList"
import { ExamForm } from "./ExamForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Exam } from "../types/exam"

const mockExams: Exam[] = [
  {
    id: "1",
    name: "Основы продаж",
    description: "Базовый экзамен по основам продаж",
    passingScore: 70,
    timeLimit: 30,
    questions: [
      {
        id: "1",
        text: "Что такое воронка продаж?",
        options: [
          "Инструмент для наливания жидкостей",
          "Модель процесса продаж",
          "Тип графика",
          "Метод ценообразования",
        ],
        correctAnswer: 1,
      },
      {
        id: "2",
        text: "Какой этап обычно следует за выявлением потребностей клиента?",
        options: ["Завершение сделки", "Презентация продукта", "Работа с возражениями", "Установление контакта"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "2",
    name: "Продвинутые техники продаж",
    description: "Экзамен для опытных продавцов",
    passingScore: 80,
    timeLimit: 45,
    questions: [
      {
        id: "1",
        text: "Что такое метод SPIN в продажах?",
        options: [
          "Техника быстрого убеждения",
          "Метод ценообразования",
          "Техника задавания вопросов",
          "Способ завершения сделки",
        ],
        correctAnswer: 2,
      },
      {
        id: "2",
        text: "Какой тип вопросов помогает выявить скрытые потребности клиента?",
        options: ["Закрытые вопросы", "Открытые вопросы", "Наводящие вопросы", "Риторические вопросы"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "3",
    name: "Тестирование продукта",
    description: "Экзамен по знанию продукта и его тестированию",
    passingScore: 75,
    timeLimit: 20,
    questions: [
      {
        id: "1",
        text: "Что такое юнит-тестирование?",
        options: [
          "Тестирование всего приложения",
          "Тестирование отдельных компонентов или функций",
          "Тестирование пользовательского интерфейса",
          "Тестирование производительности",
        ],
        correctAnswer: 1,
      },
      {
        id: "2",
        text: "Какой тип тестирования проводится для проверки работы системы под нагрузкой?",
        options: [
          "Функциональное тестирование",
          "Регрессионное тестирование",
          "Нагрузочное тестирование",
          "Интеграционное тестирование",
        ],
        correctAnswer: 2,
      },
    ],
  },
]

export function ExamManagement() {
  const [exams, setExams] = useState<Exam[]>(mockExams)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const handleCreateExam = (examData: Omit<Exam, "id">) => {
    const newExam = { ...examData, id: Date.now().toString() }
    setExams([...exams, newExam])
    setIsFormOpen(false)
  }

  const handleEditExam = (examData: Omit<Exam, "id">) => {
    if (selectedExam) {
      const updatedExams = exams.map((exam) => (exam.id === selectedExam.id ? { ...exam, ...examData } : exam))
      setExams(updatedExams)
      setSelectedExam(null)
      setIsFormOpen(false)
    }
  }

  const handleDeleteExam = (examId: string) => {
    setExams(exams.filter((exam) => exam.id !== examId))
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">{translations.examManagement.title}</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>{translations.examManagement.createExam}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedExam ? translations.examManagement.editExam : translations.examManagement.createExam}
              </DialogTitle>
            </DialogHeader>
            <ExamForm
              exam={selectedExam || undefined}
              onSubmit={selectedExam ? handleEditExam : handleCreateExam}
              onCancel={() => {
                setSelectedExam(null)
                setIsFormOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ExamList
        exams={exams}
        onEdit={(exam) => {
          setSelectedExam(exam)
          setIsFormOpen(true)
        }}
        onDelete={(examId) => {
          handleDeleteExam(examId)
        }}
        onView={(exam) => {
          setSelectedExam(exam)
          setIsViewOpen(true)
        }}
      />

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{translations.examManagement.viewExam}</DialogTitle>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{selectedExam.name}</h2>
              <p>{selectedExam.description}</p>
              <p>
                {translations.examManagement.passingScore}: {selectedExam.passingScore}%
              </p>
              <p>
                {translations.examManagement.timeLimit}: {selectedExam.timeLimit}{" "}
                {translations.examManagement.timeLimit}
              </p>
              <h3 className="text-lg font-semibold">{translations.examManagement.questions}</h3>
              <ul className="space-y-4">
                {selectedExam.questions.map((question, index) => (
                  <li key={question.id}>
                    <p className="font-medium">{`${index + 1}. ${question.text}`}</p>
                    <ul className="ml-4 mt-2">
                      {question.options.map((option, optionIndex) => (
                        <li key={optionIndex} className={optionIndex === question.correctAnswer ? "font-bold" : ""}>
                          {`${String.fromCharCode(97 + optionIndex)}. ${option}`}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button onClick={() => setIsViewOpen(false)}>{translations.examManagement.back}</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

