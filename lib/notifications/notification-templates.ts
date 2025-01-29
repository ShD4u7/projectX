import { Timestamp } from 'firebase/firestore';
import { UserRoles } from '@/lib/firebase/firestore-schema';

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  SMS = 'SMS',
  IN_APP = 'IN_APP'
}

export enum NotificationEvent {
  // Системные события
  USER_REGISTERED = 'USER_REGISTERED',
  USER_APPROVED = 'USER_APPROVED',
  USER_REJECTED = 'USER_REJECTED',
  
  // Обучение
  COURSE_ASSIGNED = 'COURSE_ASSIGNED',
  COURSE_COMPLETED = 'COURSE_COMPLETED',
  EXAM_SCHEDULED = 'EXAM_SCHEDULED',
  EXAM_PASSED = 'EXAM_PASSED',
  EXAM_FAILED = 'EXAM_FAILED',
  
  // Задачи
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_OVERDUE = 'TASK_OVERDUE',
  
  // Сертификация
  CERTIFICATION_EARNED = 'CERTIFICATION_EARNED',
  CERTIFICATION_EXPIRED = 'CERTIFICATION_EXPIRED'
}

export interface NotificationTemplate {
  id?: string;
  event: NotificationEvent;
  title: string;
  bodyTemplate: string;
  channels: NotificationChannel[];
  targetRoles?: UserRoles[];
  priority: number;
}

export class NotificationTemplateService {
  private static TEMPLATES_COLLECTION = 'notification_templates';

  // Создание шаблона уведомления
  static async createTemplate(template: Omit<NotificationTemplate, 'id'>): Promise<string> {
    const docRef = await addDoc(
      collection(firestore, this.TEMPLATES_COLLECTION), 
      template
    );
    return docRef.id;
  }

  // Получение шаблона по событию
  static async getTemplateByEvent(
    event: NotificationEvent, 
    role?: UserRoles
  ): Promise<NotificationTemplate | null> {
    const q = query(
      collection(firestore, this.TEMPLATES_COLLECTION),
      where('event', '==', event),
      role ? where('targetRoles', 'array-contains', role) : undefined
    );

    const snapshot = await getDocs(q);
    return snapshot.empty 
      ? null 
      : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as NotificationTemplate;
  }

  // Рендеринг шаблона
  static renderTemplate(
    template: NotificationTemplate, 
    context: Record<string, any>
  ): string {
    return template.bodyTemplate.replace(/\{\{(\w+)\}\}/g, (_, key) => 
      context[key] || ''
    );
  }

  // Инициализация базовых шаблонов
  static async initializeDefaultTemplates() {
    const defaultTemplates: Omit<NotificationTemplate, 'id'>[] = [
      {
        event: NotificationEvent.USER_REGISTERED,
        title: 'Новый пользователь',
        bodyTemplate: 'Пользователь {{userName}} зарегистрирован',
        channels: [
          NotificationChannel.IN_APP, 
          NotificationChannel.EMAIL
        ],
        targetRoles: [UserRoles.ADMIN, UserRoles.MANAGER],
        priority: 2
      },
      {
        event: NotificationEvent.COURSE_ASSIGNED,
        title: 'Новый курс',
        bodyTemplate: 'Вам назначен курс: {{courseName}}',
        channels: [
          NotificationChannel.IN_APP, 
          NotificationChannel.PUSH
        ],
        targetRoles: [
          UserRoles.TRAINEE, 
          UserRoles.EMPLOYEE
        ],
        priority: 1
      }
      // Другие шаблоны...
    ];

    for (const template of defaultTemplates) {
      await this.createTemplate(template);
    }
  }
}
