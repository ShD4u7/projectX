import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { translations } from "../utils/translations"
import type { Question } from "../types/exam"

interface QuestionFormProps {
  question?: Question
  onSubmit: (question: Omit<Question, "id">) => void
  onCancel: () => void
}

export function QuestionForm({ question, onSubmit, onCancel }: QuestionFormProps) {
  const [text, setText] = useState(question?.text || "")
  const [options, setOptions] = useState<string[]>(question?.options || ["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState<number>(question?.correctAnswer || 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ text, options: options.filter(Boolean), correctAnswer })
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="questionText">{translations.examManagement.questionText}</Label>
        <Input id="questionText" value={text} onChange={(e) => setText(e.target.value)} required />
      </div>
      <div>
        <Label>{translations.examManagement.answerOptions}</Label>
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <Input
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Вариант ${index + 1}`}
              required
            />
          </div>
        ))}
      </div>
      <div>
        <Label>{translations.examManagement.correctAnswer}</Label>
        <RadioGroup value={correctAnswer.toString()} onValueChange={(value) => setCorrectAnswer(Number(value))}>
          {options.map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{`Вариант ${index + 1}`}</Label>
            </div>
          ))}
        </RadioGroup>
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

