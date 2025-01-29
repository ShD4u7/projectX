import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { UserRoles } from '@/lib/firebase/firestore-schema';

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Timestamp;
  targetRoles?: UserRoles[];
}

export class NotificationService {
  private static NOTIFICATIONS_COLLECTION = 'notifications';

  // Создание уведомления для конкретного пользователя
  static async createNotification(
    notification: Omit<Notification, 'id' | 'read' | 'createdAt'>
  ): Promise<string> {
    const notificationData: Notification = {
      ...notification,
      read: false,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(
      collection(firestore, this.NOTIFICATIONS_COLLECTION), 
      notificationData
    );

    return docRef.id;
  }

  // Создание широковещательного уведомления
  static async createBroadcastNotification(
    notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>,
    targetRoles?: UserRoles[]
  ): Promise<void> {
    const broadcastNotification: Notification = {
      ...notification,
      userId: 'BROADCAST',
      read: false,
      targetRoles,
      createdAt: Timestamp.now()
    };

    await addDoc(
      collection(firestore, this.NOTIFICATIONS_COLLECTION), 
      broadcastNotification
    );
  }

  // Получение уведомлений для пользователя
  static async getUserNotifications(
    userId: string, 
    limit = 20
  ): Promise<Notification[]> {
    const q = query(
      collection(firestore, this.NOTIFICATIONS_COLLECTION),
      where('userId', 'in', [userId, 'BROADCAST']),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Notification));
  }

  // Пометить уведомление как прочитанное
  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const notificationRef = doc(
      firestore, 
      this.NOTIFICATIONS_COLLECTION, 
      notificationId
    );

    await updateDoc(notificationRef, { read: true });
  }

  // Удаление старых уведомлений
  static async deleteOldNotifications(daysOld = 30): Promise<void> {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - daysOld);

    const q = query(
      collection(firestore, this.NOTIFICATIONS_COLLECTION),
      where('createdAt', '<', Timestamp.fromDate(oldDate))
    );

    const snapshot = await getDocs(q);
    
    const batch = snapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );

    await Promise.all(batch);
  }

  // Количество непрочитанных уведомлений
  static async getUnreadNotificationsCount(userId: string): Promise<number> {
    const q = query(
      collection(firestore, this.NOTIFICATIONS_COLLECTION),
      where('userId', 'in', [userId, 'BROADCAST']),
      where('read', '==', false)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
  }
}

// Примеры использования
export async function exampleNotifications() {
  // Создание личного уведомления
  await NotificationService.createNotification({
    userId: 'user123',
    title: 'Новый курс',
    message: 'Доступен курс по TypeScript',
    type: NotificationType.INFO
  });

  // Создание широковещательного уведомления
  await NotificationService.createBroadcastNotification({
    title: 'Системное обновление',
    message: 'Плановое обновление системы 01.02.2025',
    type: NotificationType.WARNING,
    targetRoles: [UserRoles.ADMIN, UserRoles.MANAGER]
  });

  // Получение уведомлений
  const notifications = await NotificationService.getUserNotifications('user123');
  console.log(notifications);
}
