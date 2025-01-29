import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Инициализация Firebase Admin
admin.initializeApp();

// Триггер создания пользователя
export const onUserCreated = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snapshot, context) => {
    const userData = snapshot.data();
    const userId = context.params.userId;

    // Автоматическое создание профиля
    await admin.firestore()
      .collection('user_profiles')
      .doc(userId)
      .set({
        userId,
        displayName: userData.displayName || '',
        email: userData.email,
        role: userData.role || 'student',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

    // Автоматическое создание настроек
    await admin.firestore()
      .collection('user_settings')
      .doc(userId)
      .set({
        userId,
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        privacy: {
          profileVisibility: 'public'
        }
      });

    console.log(`Создан профиль для пользователя ${userId}`);
  });

// Триггер удаления пользователя
export const onUserDeleted = functions.firestore
  .document('users/{userId}')
  .onDelete(async (snapshot, context) => {
    const userId = context.params.userId;

    // Каскадное удаление связанных документов
    const batch = admin.firestore().batch();

    // Удаление профиля
    const profileRef = admin.firestore()
      .collection('user_profiles')
      .doc(userId);
    batch.delete(profileRef);

    // Удаление настроек
    const settingsRef = admin.firestore()
      .collection('user_settings')
      .doc(userId);
    batch.delete(settingsRef);

    // Удаление активностей
    const activitiesQuery = admin.firestore()
      .collection('user_activities')
      .where('userId', '==', userId);
    const activitiesSnapshot = await activitiesQuery.get();
    activitiesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Удалены все данные пользователя ${userId}`);
  });

// Триггер создания задачи
export const onTaskCreated = functions.firestore
  .document('tasks/{taskId}')
  .onCreate(async (snapshot, context) => {
    const taskData = snapshot.data();
    const taskId = context.params.taskId;

    // Логирование активности
    await admin.firestore()
      .collection('user_activities')
      .add({
        userId: taskData.createdBy,
        type: 'task_created',
        title: `Создана задача: ${taskData.title}`,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        metadata: {
          taskId,
          taskTitle: taskData.title
        }
      });

    console.log(`Создана задача ${taskId}`);
  });
