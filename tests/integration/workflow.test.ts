import { 
  TaskManagementService, 
  TaskStatus, 
  TaskPriority 
} from '@/lib/workflow/task-management';
import { 
  NotificationService 
} from '@/lib/notifications/notification-service';
import { 
  PerformanceTrackingService, 
  AnalyticsEventType 
} from '@/lib/analytics/performance-tracking';
import { UserRoles } from '@/lib/firebase/firestore-schema';
import { Timestamp } from 'firebase/firestore';

describe('Workflow Integration', () => {
  const testUserId = 'test-user-123';
  const testManagerId = 'test-manager-456';
  let createdTaskId: string;

  beforeAll(async () => {
    // Подготовка тестовых данных
    await PerformanceTrackingService.trackEvent(
      testUserId, 
      UserRoles.TRAINEE, 
      AnalyticsEventType.USER_LOGIN
    );
  });

  test('Создание и управление задачей', async () => {
    // Создание задачи
    createdTaskId = await TaskManagementService.createTask({
      title: 'Тестовая задача',
      description: 'Интеграционный тест workflow',
      assignedTo: testUserId,
      assignedBy: testManagerId,
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      startDate: Timestamp.now(),
      dueDate: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    });

    expect(createdTaskId).toBeTruthy();

    // Проверка уведомления
    const notifications = await NotificationService.getUserNotifications(testUserId);
    const taskNotification = notifications.find(
      n => n.title === 'Новая задача'
    );
    expect(taskNotification).toBeTruthy();
  });

  test('Обновление статуса задачи', async () => {
    await TaskManagementService.updateTaskStatus(
      createdTaskId, 
      TaskStatus.IN_PROGRESS, 
      testUserId
    );

    // Проверка аналитики
    const userAnalytics = await PerformanceTrackingService.getUserPerformanceAnalytics(
      testUserId
    );
    
    expect(userAnalytics.completedTasks).toBe(0);
  });

  test('Завершение задачи', async () => {
    await TaskManagementService.updateTaskStatus(
      createdTaskId, 
      TaskStatus.COMPLETED, 
      testUserId
    );

    // Трекинг события
    await PerformanceTrackingService.trackEvent(
      testUserId, 
      UserRoles.TRAINEE, 
      AnalyticsEventType.TASK_COMPLETED,
      { taskId: createdTaskId }
    );

    // Проверка аналитики
    const userAnalytics = await PerformanceTrackingService.getUserPerformanceAnalytics(
      testUserId
    );
    
    expect(userAnalytics.completedTasks).toBe(1);
  });

  test('Просроченные задачи', async () => {
    // Создание просроченной задачи
    const overdueTaskId = await TaskManagementService.createTask({
      title: 'Просроченная задача',
      description: 'Тест обработки просроченных задач',
      assignedTo: testUserId,
      assignedBy: testManagerId,
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      startDate: Timestamp.fromDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
      dueDate: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    });

    // Обработка просроченных задач
    await TaskManagementService.processOverdueTasks();

    // Проверка уведомлений
    const managerNotifications = await NotificationService.getUserNotifications(testManagerId);
    const overdueNotification = managerNotifications.find(
      n => n.title === 'Эскалация задачи'
    );
    expect(overdueNotification).toBeTruthy();
  });

  afterAll(async () => {
    // Очистка тестовых данных
    if (createdTaskId) {
      await TaskManagementService.deleteTask(createdTaskId);
    }
  });
});
