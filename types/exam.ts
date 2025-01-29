export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
}

export interface Exam {
  id: string
  name: string
  description: string
  passingScore: number
  timeLimit: number
  questions: Question[]
}

