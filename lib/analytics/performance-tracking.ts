import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { UserRoles } from '@/lib/firebase/firestore-schema';

export enum AnalyticsEventType {
  // Пользователь
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  
  // Обучение
  COURSE_START = 'COURSE_START',
  COURSE_COMPLETE = 'COURSE_COMPLETE',
  EXAM_PASSED = 'EXAM_PASSED',
  EXAM_FAILED = 'EXAM_FAILED',
  
  // Задачи
  TASK_CREATED = 'TASK_CREATED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  
  // Система
  FEATURE_USE = 'FEATURE_USE'
}

export interface AnalyticsEvent {
  id?: string;
  userId: string;
  userRole: UserRoles;
  eventType: AnalyticsEventType;
  timestamp: Timestamp;
  metadata?: Record<string, any>;
}

export class PerformanceTrackingService {
  private static ANALYTICS_COLLECTION = 'analytics_events';

  // Запись события
  static async trackEvent(
    userId: string, 
    userRole: UserRoles,
    eventType: AnalyticsEventType,
    metadata?: Record<string, any>
  ): Promise<string> {
    const event: AnalyticsEvent = {
      userId,
      userRole,
      eventType,
      timestamp: Timestamp.now(),
      metadata
    };

    const docRef = await addDoc(
      collection(firestore, this.ANALYTICS_COLLECTION), 
      event
    );

    return docRef.id;
  }

  // Аналитика по пользователю
  static async getUserPerformanceAnalytics(
    userId: string, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<{
    totalCourses: number;
    completedCourses: number;
    passedExams: number;
    completedTasks: number;
  }> {
    const baseQuery = query(
      collection(firestore, this.ANALYTICS_COLLECTION),
      where('userId', '==', userId),
      ...(startDate ? [where('timestamp', '>=', Timestamp.fromDate(startDate))] : []),
      ...(endDate ? [where('timestamp', '<=', Timestamp.fromDate(endDate))] : [])
    );

    const snapshot = await getDocs(baseQuery);
    const events = snapshot.docs.map(doc => doc.data() as AnalyticsEvent);

    return {
      totalCourses: events.filter(e => 
        e.eventType === AnalyticsEventType.COURSE_START
      ).length,
      completedCourses: events.filter(e => 
        e.eventType === AnalyticsEventType.COURSE_COMPLETE
      ).length,
      passedExams: events.filter(e => 
        e.eventType === AnalyticsEventType.EXAM_PASSED
      ).length,
      completedTasks: events.filter(e => 
        e.eventType === AnalyticsEventType.TASK_COMPLETED
      ).length
    };
  }

  // Топ-performers по ролям
  static async getTopPerformers(
    role: UserRoles, 
    limit = 10
  ): Promise<Array<{
    userId: string;
    completedCourses: number;
    passedExams: number;
  }>> {
    const q = query(
      collection(firestore, this.ANALYTICS_COLLECTION),
      where('userRole', '==', role),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    const events = snapshot.docs.map(doc => doc.data() as AnalyticsEvent);

    // Группировка и подсчет
    const performanceMap = new Map<string, {
      completedCourses: number;
      passedExams: number;
    }>();

    events.forEach(event => {
      if (!performanceMap.has(event.userId)) {
        performanceMap.set(event.userId, {
          completedCourses: 0,
          passedExams: 0
        });
      }

      const performance = performanceMap.get(event.userId)!;
      
      switch (event.eventType) {
        case AnalyticsEventType.COURSE_COMPLETE:
          performance.completedCourses++;
          break;
        case AnalyticsEventType.EXAM_PASSED:
          performance.passedExams++;
          break;
      }
    });

    return Array.from(performanceMap.entries())
      .map(([userId, stats]) => ({
        userId,
        ...stats
      }))
      .sort((a, b) => 
        (b.completedCourses + b.passedExams) - 
        (a.completedCourses + a.passedExams)
      )
      .slice(0, limit);
  }

  // Общая статистика системы
  static async getSystemOverview(): Promise<{
    totalUsers: number;
    activeUsers: number;
    courseCompletions: number;
    examPassRate: number;
  }> {
    const q = query(
      collection(firestore, this.ANALYTICS_COLLECTION),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    const events = snapshot.docs.map(doc => doc.data() as AnalyticsEvent);

    const uniqueUsers = new Set(events.map(e => e.userId));
    const activeUsers = new Set(
      events
        .filter(e => 
          e.timestamp.toDate() > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        )
        .map(e => e.userId)
    );

    const courseCompletions = events.filter(e => 
      e.eventType === AnalyticsEventType.COURSE_COMPLETE
    ).length;

    const exams = events.filter(e => 
      e.eventType === AnalyticsEventType.EXAM_PASSED || 
      e.eventType === AnalyticsEventType.EXAM_FAILED
    );

    const examPassRate = exams.length > 0
      ? (exams.filter(e => e.eventType === AnalyticsEventType.EXAM_PASSED).length / exams.length) * 100
      : 0;

    return {
      totalUsers: uniqueUsers.size,
      activeUsers: activeUsers.size,
      courseCompletions,
      examPassRate
    };
  }
}

// Пример использования
export async function exampleAnalytics() {
  // Трекинг события
  await PerformanceTrackingService.trackEvent(
    'user123', 
    UserRoles.TRAINEE,
    AnalyticsEventType.COURSE_COMPLETE,
    { courseId: 'react-basics' }
  );

  // Получение аналитики пользователя
  const userAnalytics = await PerformanceTrackingService.getUserPerformanceAnalytics(
    'user123',
    new Date(2024, 0, 1),
    new Date(2024, 11, 31)
  );

  // Топ performers
  const topTrainees = await PerformanceTrackingService.getTopPerformers(
    UserRoles.TRAINEE
  );

  // Обзор системы
  const systemOverview = await PerformanceTrackingService.getSystemOverview();
}
