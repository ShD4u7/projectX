import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../lib/firebase"
import type { UserProfile } from "../types/user"

interface UserProgress {
  completedTasks: { [key: string]: boolean[] }
  completedTests: { [key: string]: boolean }
  achievements: {
    completedDays: number[]
    allTasksCompleted: boolean
    perfectTests: number[]
    fastLearner: boolean
  }
}

export async function saveUserProgress(userId: string, progress: UserProgress): Promise<void> {
  const userRef = doc(db, "userProgress", userId)
  await setDoc(userRef, progress, { merge: true })
}

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  const userRef = doc(db, "userProgress", userId)
  const docSnap = await getDoc(userRef)

  if (docSnap.exists()) {
    return docSnap.data() as UserProgress
  } else {
    return null
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, "userProfiles", userId)
  const docSnap = await getDoc(userRef)

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile
  } else {
    return null
  }
}

export async function updateUserProfile(userId: string, profile: UserProfile): Promise<void> {
  const userRef = doc(db, "userProfiles", userId)
  await setDoc(userRef, profile, { merge: true })
}

