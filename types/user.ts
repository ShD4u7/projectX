export type UserRole = "ADMIN" | "MANAGER" | "MENTOR" | "EMPLOYEE"

export interface UserProfile {
  id: string
  displayName: string
  lastName: string
  middleName?: string
  dateOfBirth: string
  position: string
  department: string
  workPhone: string
  personalPhone: string
  email: string
  hireDate: string
  iin: string // Individual Identification Number (IIN) for Kazakhstan
  address: string
  city: string
  region: string
  education: string
  languages: string[]
  skills: string[]
  avatar?: string
}

