import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CertificationExam } from "./CertificationExam"
import { CertificateViewer } from "./CertificateViewer"
import { translations } from "../utils/translations"
import { Award, Book, CheckCircle } from "lucide-react"

interface Certification {
  id: string
  title: string
  description: string
  progress: number
  status: "not_started" | "in_progress" | "completed"
  requiredCourses: string[]
  exam: {
    questions: Array<{
      question: string
      options: string[]
      correctAnswer: number
    }>
  }
}

const mockCertifications: Certification[] = [
  {
    id: "1",
    title: "Основы продаж",
    description: "Сертификация по основам техник продаж и работе с клиентами",
    progress: 75,
    status: "in_progress",
    requiredCourses: ["Введение в продажи", "Работа с возражениями", "Закрытие сделок"],
    exam: {
      questions: [
        {
          question: "Что такое воронка продаж?",
          options: [
            "Инструмент для наливания жидкостей",
            "Модель процесса продаж",
            "Тип графика",
            "Метод ценообразования",
          ],
          correctAnswer: 1,
        },
        {
          question: "Какой этап обычно следует за выявлением потребностей клиента?",
          options: ["Завершение сделки", "Презентация продукта", "Работа с возражениями", "Установление контакта"],
          correctAnswer: 1,
        },
        // Add more questions as needed
      ],
    },
  },
  {
    id: "2",
    title: "Продвинутые техники продаж",
    description: "Сертификация по углубленным стратегиям и методам продаж",
    progress: 30,
    status: "in_progress",
    requiredCourses: ["Психология продаж", "Анализ рынка", "Управление ключевыми клиентами"],
    exam: {
      questions: [
        {
          question: "Что такое метод SPIN в продажах?",
          options: [
            "Техника быстрого убеждения",
            "Метод ценообразования",
            "Техника задавания вопросов",
            "Способ завершения сделки",
          ],
          correctAnswer: 2,
        },
        {
          question: "Какой тип вопросов помогает выявить скрытые потребности клиента?",
          options: ["Закрытые вопросы", "Открытые вопросы", "Наводящие вопросы", "Риторические вопросы"],
          correctAnswer: 1,
        },
        // Add more questions as needed
      ],
    },
  },
  {
    id: "3",
    title: "Управление продажами",
    description: "Сертификация для менеджеров по продажам и руководителей отделов",
    progress: 0,
    status: "not_started",
    requiredCourses: ["Стратегическое планирование продаж", "Управление командой продаж", "Аналитика и отчетность"],
    exam: {
      questions: [
        {
          question: "Какой ключевой показатель эффективности (KPI) наиболее важен для оценки работы отдела продаж?",
          options: ["Количество звонков", "Объем продаж", "Количество встреч", "Размер скидок"],
          correctAnswer: 1,
        },
        {
          question: "Что такое 'воронка найма' в контексте управления продажами?",
          options: [
            "Метод обучения новых сотрудников",
            "Процесс отбора кандидатов на должности в отделе продаж",
            "Способ распределения лидов между менеджерами",
            "Техника проведения собеседований",
          ],
          correctAnswer: 1,
        },
        // Add more questions as needed
      ],
    },
  },
]

export function Certification() {
  const [certifications, setCertifications] = useState<Certification[]>(mockCertifications)
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null)
  const [showExam, setShowExam] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)

  const handleStartExam = (certification: Certification) => {
    setSelectedCertification(certification)
    setShowExam(true)
  }

  const handleExamComplete = (score: number) => {
    if (selectedCertification) {
      const passingScore = Math.ceil(selectedCertification.exam.questions.length * 0.7)
      if (score >= passingScore) {
        const updatedCertifications = certifications.map((cert) =>
          cert.id === selectedCertification.id ? { ...cert, status: "completed" as const, progress: 100 } : cert,
        )
        setCertifications(updatedCertifications)
        setShowCertificate(true)
      }
    }
    setShowExam(false)
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold text-foreground">{translations.certification.title}</h1>
      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">{translations.certification.availableCertifications}</TabsTrigger>
          <TabsTrigger value="completed">{translations.certification.completedCertifications}</TabsTrigger>
        </TabsList>
        <TabsContent value="available">
          <div className="grid gap-6 mt-6">
            {certifications
              .filter((cert) => cert.status !== "completed")
              .map((certification) => (
                <Card key={certification.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{certification.title}</span>
                      <Badge variant={certification.status === "in_progress" ? "default" : "secondary"}>
                        {translations.certification.status[certification.status]}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{certification.description}</p>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">{translations.certification.requiredCourses}</h3>
                        <ul className="list-disc list-inside">
                          {certification.requiredCourses.map((course, index) => (
                            <li key={index}>{course}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{translations.certification.progress}</h3>
                        <Progress value={certification.progress} className="w-full" />
                        <p className="text-sm text-muted-foreground mt-2">
                          {certification.progress}% {translations.certification.completed}
                        </p>
                      </div>
                      <Button onClick={() => handleStartExam(certification)} disabled={certification.progress < 100}>
                        {certification.progress < 100
                          ? translations.certification.completeCoursesFirst
                          : translations.certification.startExam}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="grid gap-6 mt-6">
            {certifications
              .filter((cert) => cert.status === "completed")
              .map((certification) => (
                <Card key={certification.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{certification.title}</span>
                      <Badge variant="success">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {translations.certification.completed}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{certification.description}</p>
                    <Button onClick={() => setShowCertificate(true)}>
                      {translations.certification.viewCertificate}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {showExam && selectedCertification && (
        <Dialog open={showExam} onOpenChange={setShowExam}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{translations.certification.examTitle}</DialogTitle>
            </DialogHeader>
            <CertificationExam exam={selectedCertification.exam} onComplete={handleExamComplete} />
          </DialogContent>
        </Dialog>
      )}

      {showCertificate && selectedCertification && (
        <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{translations.certification.certificateTitle}</DialogTitle>
            </DialogHeader>
            <CertificateViewer certification={selectedCertification} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

