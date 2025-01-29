import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { translations } from "../utils/translations"
import { Pencil, Trash2, Eye } from "lucide-react"

interface Exam {
  id: string
  name: string
  description: string
  passingScore: number
  timeLimit: number
}

interface ExamListProps {
  exams: Exam[]
  onEdit: (exam: Exam) => void
  onDelete: (examId: string) => void
  onView: (exam: Exam) => void
}

export function ExamList({ exams, onEdit, onDelete, onView }: ExamListProps) {
  return (
    <div className="space-y-4">
      {exams.length === 0 ? (
        <p className="text-muted-foreground">{translations.examManagement.noExams}</p>
      ) : (
        exams.map((exam) => (
          <Card key={exam.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{exam.name}</span>
                <div className="space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onView(exam)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onEdit(exam)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onDelete(exam.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{exam.description}</p>
              <p className="mt-2">
                {translations.examManagement.passingScore}: {exam.passingScore}%
              </p>
              <p>
                {translations.examManagement.timeLimit}: {exam.timeLimit} {translations.examManagement.timeLimit}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

