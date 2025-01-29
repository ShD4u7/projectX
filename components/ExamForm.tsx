import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { translations } from "../utils/translations"
import { QuestionForm } from "./QuestionForm"
import type { Exam, Question } from "../types/exam"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface ExamFormProps {
  exam?: Exam
  onSubmit: (examData: Omit<Exam, "id">) => void
  onCancel: () => void
}

export function ExamForm({ exam, onSubmit, onCancel }: ExamFormProps) {
  const [name, setName] = useState(exam?.name || "")
  const [description, setDescription] = useState(exam?.description || "")
  const [passingScore, setPassingScore] = useState(exam?.passingScore || 70)
  const [timeLimit, setTimeLimit] = useState(exam?.timeLimit || 30)
  const [questions, setQuestions] = useState<Question[]>(exam?.questions || [])
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, description, passingScore, timeLimit, questions })
  }

  const handleAddQuestion = (questionData: Omit<Question, "id">) => {
    const newQuestion = { ...questionData, id: Date.now().toString() }
    setQuestions([...questions, newQuestion])
    setIsQuestionFormOpen(false)
  }

  const handleEditQuestion = (questionData: Omit<Question, "id">) => {
    if (editingQuestion) {
      const updatedQuestions = questions.map((q) => (q.id === editingQuestion.id ? { ...q, ...questionData } : q))
      setQuestions(updatedQuestions)
      setEditingQuestion(null)
      setIsQuestionFormOpen(false)
    }
  }

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">{translations.examManagement.examName}</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">{translations.examManagement.examDescription}</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="passingScore">{translations.examManagement.passingScore}</Label>
        <Input
          id="passingScore"
          type="number"
          min="0"
          max="100"
          value={passingScore}
          onChange={(e) => setPassingScore(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <Label htmlFor="timeLimit">{translations.examManagement.timeLimit}</Label>
        <Input
          id="timeLimit"
          type="number"
          min="1"
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <Label>{translations.examManagement.questions}</Label>
        <ul className="space-y-2 mt-2">
          {questions.map((question) => (
            <li key={question.id} className="flex justify-between items-center">
              <span>{question.text}</span>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditingQuestion(question)
                    setIsQuestionFormOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDeleteQuestion(question.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Dialog open={isQuestionFormOpen} onOpenChange={setIsQuestionFormOpen}>
          <DialogTrigger asChild>
            <Button className="mt-2" onClick={() => setEditingQuestion(null)}>
              <Plus className="h-4 w-4 mr-2" />
              {translations.examManagement.addQuestion}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? translations.examManagement.editQuestion : translations.examManagement.addQuestion}
              </DialogTitle>
            </DialogHeader>
            <QuestionForm
              question={editingQuestion || undefined}
              onSubmit={editingQuestion ? handleEditQuestion : handleAddQuestion}
              onCancel={() => {
                setEditingQuestion(null)
                setIsQuestionFormOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {translations.examManagement.cancel}
        </Button>
        <Button type="submit">{translations.examManagement.save}</Button>
      </div>
    </form>
  )
}

