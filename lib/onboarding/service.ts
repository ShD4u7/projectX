import { firestore } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

// Статусы онбординга
export enum OnboardingStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

// Этапы онбординга
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

// Профиль онбординга
export interface OnboardingProfile {
  userId: string;
  status: OnboardingStatus;
  currentStep: number;
  steps: OnboardingStep[];
  completedAt?: Date;
}

export class OnboardingService {
  private static COLLECTION = 'onboarding';

  // Начальные этапы онбординга
  private static DEFAULT_STEPS: OnboardingStep[] = [
    {
      id: 'profile_setup',
      title: 'Настройка профиля',
      description: 'Заполните основную информацию о себе',
      completed: false
    },
    {
      id: 'skills_assessment',
      title: 'Оценка навыков',
      description: 'Пройдите первичную оценку ваших навыков',
      completed: false
    },
    {
      id: 'team_introduction',
      title: 'Знакомство с командой',
      description: 'Изучите структуру и участников команды',
      completed: false
    },
    {
      id: 'first_task',
      title: 'Первое задание',
      description: 'Получите и выполните первое тестовое задание',
      completed: false
    }
  ];

  // Создание профиля онбординга
  static async createOnboardingProfile(userId: string): Promise<OnboardingProfile> {
    const profile: OnboardingProfile = {
      userId,
      status: OnboardingStatus.NOT_STARTED,
      currentStep: 0,
      steps: this.DEFAULT_STEPS
    };

    await setDoc(
      doc(firestore, this.COLLECTION, userId), 
      profile
    );

    return profile;
  }

  // Получение профиля онбординга
  static async getOnboardingProfile(userId: string): Promise<OnboardingProfile | null> {
    const docRef = doc(firestore, this.COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as OnboardingProfile;
    }

    return null;
  }

  // Обновление статуса этапа
  static async updateStepStatus(
    userId: string, 
    stepId: string, 
    completed: boolean
  ): Promise<void> {
    const docRef = doc(firestore, this.COLLECTION, userId);
    const profile = await this.getOnboardingProfile(userId);

    if (profile) {
      const updatedSteps = profile.steps.map(step => 
        step.id === stepId 
          ? { ...step, completed } 
          : step
      );

      const allStepsCompleted = updatedSteps.every(step => step.completed);

      await updateDoc(docRef, {
        steps: updatedSteps,
        status: allStepsCompleted 
          ? OnboardingStatus.COMPLETED 
          : OnboardingStatus.IN_PROGRESS,
        currentStep: allStepsCompleted 
          ? profile.steps.length 
          : updatedSteps.findIndex(step => !step.completed)
      });
    }
  }

  // Получение незавершенных профилей онбординга
  static async getIncompleteOnboardings(): Promise<OnboardingProfile[]> {
    const q = query(
      collection(firestore, this.COLLECTION),
      where('status', '!=', OnboardingStatus.COMPLETED)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as OnboardingProfile);
  }
}
