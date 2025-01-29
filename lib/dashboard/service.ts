import { firestore } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp
} from 'firebase/firestore';
import { UserRole } from '@/lib/user/profile';

// Типы активностей
export enum ActivityType {
  TASK_COMPLETED = 'task_completed',
  EXAM_PASSED = 'exam_passed',
  COURSE_STARTED = 'course_started',
  CERTIFICATION_EARNED = 'certification_earned'
}

// Интерфейс активности
export interface UserActivity {
  id?: string;
  userId: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Статистика прогресса
export interface ProgressStats {
  tasksCompleted: number;
  examsPassed: number;
  certificationsEarned: number;
  coursesInProgress: number;
}

// Последние достижения
export interface RecentAchievements {
  latestCertification?: {
    name: string;
    date: Date;
  };
  topPerformingCourse?: {
    name: string;
    progress: number;
  };
}

export class DashboardService {
  private static ACTIVITY_COLLECTION = 'user_activities';
  private static TASKS_COLLECTION = 'tasks';
  private static EXAMS_COLLECTION = 'exams';
  private static CERTIFICATIONS_COLLECTION = 'certifications';

  // Получение последних активностей пользователя
  static async getUserActivities(
    userId: string, 
    limit = 10
  ): Promise<UserActivity[]> {
    const q = query(
      collection(firestore, this.ACTIVITY_COLLECTION),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UserActivity));
  }

  // Получение статистики прогресса
  static async getProgressStats(userId: string): Promise<ProgressStats> {
    const [tasksSnapshot, examsSnapshot, certificationsSnapshot] = await Promise.all([
      getDocs(query(
        collection(firestore, this.TASKS_COLLECTION),
        where('userId', '==', userId),
        where('status', '==', 'completed')
      )),
      getDocs(query(
        collection(firestore, this.EXAMS_COLLECTION),
        where('userId', '==', userId),
        where('status', '==', 'passed')
      )),
      getDocs(query(
        collection(firestore, this.CERTIFICATIONS_COLLECTION),
        where('userId', '==', userId)
      ))
    ]);

    return {
      tasksCompleted: tasksSnapshot.size,
      examsPassed: examsSnapshot.size,
      certificationsEarned: certificationsSnapshot.size,
      coursesInProgress: 0 // Реализуйте подсчет активных курсов
    };
  }

  // Получение последних достижений
  static async getRecentAchievements(userId: string): Promise<RecentAchievements> {
    const certificationsSnapshot = await getDocs(query(
      collection(firestore, this.CERTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('earnedAt', 'desc'),
      limit(1)
    ));

    const coursesSnapshot = await getDocs(query(
      collection(firestore, 'courses'),
      where('userId', '==', userId),
      orderBy('progress', 'desc'),
      limit(1)
    ));

    const achievements: RecentAchievements = {};

    if (!certificationsSnapshot.empty) {
      const latestCert = certificationsSnapshot.docs[0].data();
      achievements.latestCertification = {
        name: latestCert.name,
        date: latestCert.earnedAt.toDate()
      };
    }

    if (!coursesSnapshot.empty) {
      const topCourse = coursesSnapshot.docs[0].data();
      achievements.topPerformingCourse = {
        name: topCourse.name,
        progress: topCourse.progress
      };
    }

    return achievements;
  }

  // Логирование активности
  static async logActivity(
    activity: Omit<UserActivity, 'id' | 'timestamp'>
  ): Promise<string> {
    const docRef = await firestore
      .collection(this.ACTIVITY_COLLECTION)
      .add({
        ...activity,
        timestamp: Timestamp.now()
      });

    return docRef.id;
  }

  // Аналитика для администраторов
  static async getAdminDashboardData(role: UserRole): Promise<any> {
    if (role !== UserRole.ADMIN) {
      throw new Error('Недостаточно прав');
    }

    // Реализуйте сбор глобальной статистики
    return {
      totalUsers: 0,
      activeUsers: 0,
      completedCourses: 0,
      newRegistrations: 0
    };
  }
}
