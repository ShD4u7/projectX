import { firestore } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc,
  orderBy,
  limit
} from 'firebase/firestore';

// Типы уведомлений
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

// Интерфейс уведомления
export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
}

export class NotificationService {
  private static COLLECTION = 'notifications';

  // Создание уведомления
  static async createNotification(
    notification: Omit<Notification, 'id' | 'read' | 'createdAt'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(firestore, this.COLLECTION), 
        {
          ...notification,
          read: false,
          createdAt: new Date()
        }
      );
      return docRef.id;
    } catch (error) {
      console.error('Ошибка создания уведомления:', error);
      throw error;
    }
  }

  // Получение уведомлений пользователя
  static async getUserNotifications(
    userId: string, 
    limit = 10
  ): Promise<Notification[]> {
    try {
      const q = query(
        collection(firestore, this.COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification));
    } catch (error) {
      console.error('Ошибка получения уведомлений:', error);
      return [];
    }
  }

  // Пометить уведомление как прочитанное
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const docRef = doc(firestore, this.COLLECTION, notificationId);
      await updateDoc(docRef, { read: true });
    } catch (error) {
      console.error('Ошибка обновления уведомления:', error);
      throw error;
    }
  }

  // Отправка системного уведомления
  static async sendSystemNotification(
    userId: string, 
    message: string, 
    type: NotificationType = NotificationType.INFO
  ): Promise<void> {
    await this.createNotification({
      userId,
      title: 'Системное уведомление',
      message,
      type
    });
  }
}
