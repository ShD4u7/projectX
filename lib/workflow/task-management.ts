import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { UserRoles } from '@/lib/firebase/firestore-schema';
import { NotificationService } from '@/lib/notifications/notification-service';
import { NotificationEvent } from '@/lib/notifications/notification-templates';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Task {
  id?: string;
  title: string;
  description: string;
  assignedTo: string; // User ID
  assignedBy: string; // User ID
  status: TaskStatus;
  priority: TaskPriority;
  startDate: Timestamp;
  dueDate: Timestamp;
  completedDate?: Timestamp;
  tags?: string[];
  relatedCourseId?: string;
  attachments?: string[];
  comments?: TaskComment[];
}

export interface TaskComment {
  userId: string;
  text: string;
  timestamp: Timestamp;
}

export class TaskManagementService {
  private static TASKS_COLLECTION = 'tasks';

  // Создание задачи
  static async createTask(taskData: Omit<Task, 'id'>): Promise<string> {
    const taskRef = await addDoc(
      collection(firestore, this.TASKS_COLLECTION), 
      taskData
    );

    // Уведомление о назначении задачи
    await NotificationService.createNotification({
      userId: taskData.assignedTo,
      title: 'Новая задача',
      message: `Вам назначена задача: ${taskData.title}`,
      type: NotificationType.INFO
    });

    return taskRef.id;
  }

  // Обновление статуса задачи
  static async updateTaskStatus(
    taskId: string, 
    newStatus: TaskStatus, 
    userId: string
  ): Promise<void> {
    const taskRef = doc(firestore, this.TASKS_COLLECTION, taskId);
    
    await updateDoc(taskRef, { 
      status: newStatus,
      ...(newStatus === TaskStatus.COMPLETED && { 
        completedDate: Timestamp.now() 
      })
    });

    // Уведомление о смене статуса
    await NotificationService.createNotification({
      userId: userId,
      title: 'Статус задачи изменен',
      message: `Задача переведена в статус: ${newStatus}`,
      type: NotificationType.INFO
    });
  }

  // Получение задач пользователя
  static async getUserTasks(
    userId: string, 
    status?: TaskStatus
  ): Promise<Task[]> {
    const q = status 
      ? query(
          collection(firestore, this.TASKS_COLLECTION),
          where('assignedTo', '==', userId),
          where('status', '==', status)
        )
      : query(
          collection(firestore, this.TASKS_COLLECTION),
          where('assignedTo', '==', userId)
        );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));
  }

  // Добавление комментария к задаче
  static async addTaskComment(
    taskId: string, 
    comment: TaskComment
  ): Promise<void> {
    const taskRef = doc(firestore, this.TASKS_COLLECTION, taskId);
    
    await updateDoc(taskRef, {
      comments: arrayUnion(comment)
    });
  }

  // Удаление задачи
  static async deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(firestore, this.TASKS_COLLECTION, taskId);
    await deleteDoc(taskRef);
  }

  // Получение просроченных задач
  static async getOverdueTasks(): Promise<Task[]> {
    const now = Timestamp.now();
    const q = query(
      collection(firestore, this.TASKS_COLLECTION),
      where('dueDate', '<', now),
      where('status', '!=', TaskStatus.COMPLETED)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));
  }

  // Workflow автоматизации
  static async processOverdueTasks() {
    const overdueTasks = await this.getOverdueTasks();

    for (const task of overdueTasks) {
      // Уведомление о просрочке
      await NotificationService.createNotification({
        userId: task.assignedTo,
        title: 'Просроченная задача',
        message: `Задача "${task.title}" просрочена`,
        type: NotificationType.WARNING
      });

      // Эскалация задачи руководителю
      const managerNotification = await NotificationService.createNotification({
        userId: task.assignedBy,
        title: 'Эскалация задачи',
        message: `Задача "${task.title}" просрочена пользователем`,
        type: NotificationType.ERROR
      });
    }
  }
}

// Пример использования workflow
export async function exampleTaskWorkflow() {
  // Создание задачи
  const taskId = await TaskManagementService.createTask({
    title: 'Изучение React',
    description: 'Пройти курс по современному React',
    assignedTo: 'user123',
    assignedBy: 'manager456',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    startDate: Timestamp.now(),
    dueDate: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    tags: ['обучение', 'frontend']
  });

  // Обновление статуса
  await TaskManagementService.updateTaskStatus(
    taskId, 
    TaskStatus.IN_PROGRESS, 
    'user123'
  );

  // Добавление комментария
  await TaskManagementService.addTaskComment(taskId, {
    userId: 'user123',
    text: 'Начал изучение материалов',
    timestamp: Timestamp.now()
  });
}
