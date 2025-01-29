import { firestore } from './index';
import { 
  collection, 
  doc, 
  setDoc, 
  writeBatch,
  Timestamp
} from 'firebase/firestore';

// Перечисления для типизации
export enum UserRoles {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MENTOR = 'MENTOR',
  EMPLOYEE = 'EMPLOYEE',
  TRAINEE = 'TRAINEE'
}

export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress', 
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface UserPermissions {
  // Основной доступ
  dashboard: boolean;
  profile: boolean;
  notifications: boolean;

  // Управление пользователями
  userManagement: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
  };

  // Доступ к обучению
  learning: {
    viewCourses: boolean;
    enrollCourses: boolean;
    createCourses: boolean;
    editCourses: boolean;
    deleteCourses: boolean;
  };

  // Экзамены и оценивание
  exams: {
    view: boolean;
    take: boolean;
    create: boolean;
    grade: boolean;
    analyze: boolean;
  };

  // Задачи и проекты
  tasks: {
    view: boolean;
    create: boolean;
    assign: boolean;
    complete: boolean;
    review: boolean;
  };

  // Сертификация
  certification: {
    view: boolean;
    issue: boolean;
    validate: boolean;
  };

  // Системные настройки
  systemSettings: {
    view: boolean;
    modify: boolean;
  };
}

export const RolePermissions: Record<UserRoles, UserPermissions> = {
  [UserRoles.ADMIN]: {
    dashboard: true,
    profile: true,
    notifications: true,
    
    userManagement: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      approve: true
    },
    
    learning: {
      viewCourses: true,
      enrollCourses: true,
      createCourses: true,
      editCourses: true,
      deleteCourses: true
    },
    
    exams: {
      view: true,
      take: true,
      create: true,
      grade: true,
      analyze: true
    },
    
    tasks: {
      view: true,
      create: true,
      assign: true,
      complete: true,
      review: true
    },
    
    certification: {
      view: true,
      issue: true,
      validate: true
    },
    
    systemSettings: {
      view: true,
      modify: true
    }
  },
  
  [UserRoles.MANAGER]: {
    dashboard: true,
    profile: true,
    notifications: true,
    
    userManagement: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      approve: false
    },
    
    learning: {
      viewCourses: true,
      enrollCourses: false,
      createCourses: true,
      editCourses: true,
      deleteCourses: false
    },
    
    exams: {
      view: true,
      take: false,
      create: true,
      grade: true,
      analyze: true
    },
    
    tasks: {
      view: true,
      create: true,
      assign: true,
      complete: false,
      review: true
    },
    
    certification: {
      view: true,
      issue: false,
      validate: false
    },
    
    systemSettings: {
      view: true,
      modify: false
    }
  },
  
  [UserRoles.MENTOR]: {
    dashboard: true,
    profile: true,
    notifications: true,
    
    userManagement: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      approve: false
    },
    
    learning: {
      viewCourses: true,
      enrollCourses: false,
      createCourses: false,
      editCourses: false,
      deleteCourses: false
    },
    
    exams: {
      view: true,
      take: false,
      create: false,
      grade: true,
      analyze: false
    },
    
    tasks: {
      view: true,
      create: false,
      assign: true,
      complete: false,
      review: true
    },
    
    certification: {
      view: true,
      issue: false,
      validate: false
    },
    
    systemSettings: {
      view: false,
      modify: false
    }
  },
  
  [UserRoles.EMPLOYEE]: {
    dashboard: true,
    profile: true,
    notifications: true,
    
    userManagement: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      approve: false
    },
    
    learning: {
      viewCourses: true,
      enrollCourses: true,
      createCourses: false,
      editCourses: false,
      deleteCourses: false
    },
    
    exams: {
      view: true,
      take: true,
      create: false,
      grade: false,
      analyze: false
    },
    
    tasks: {
      view: true,
      create: true,
      assign: false,
      complete: true,
      review: false
    },
    
    certification: {
      view: true,
      issue: false,
      validate: false
    },
    
    systemSettings: {
      view: false,
      modify: false
    }
  },
  
  [UserRoles.TRAINEE]: {
    dashboard: true,
    profile: true,
    notifications: false,
    
    userManagement: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      approve: false
    },
    
    learning: {
      viewCourses: true,
      enrollCourses: true,
      createCourses: false,
      editCourses: false,
      deleteCourses: false
    },
    
    exams: {
      view: true,
      take: true,
      create: false,
      grade: false,
      analyze: false
    },
    
    tasks: {
      view: true,
      create: false,
      assign: false,
      complete: true,
      review: false
    },
    
    certification: {
      view: true,
      issue: false,
      validate: false
    },
    
    systemSettings: {
      view: false,
      modify: false
    }
  }
};

// Локализация ролей
export function getLocalizedRoleName(role: UserRoles): string {
  const roleNames: Record<UserRoles, string> = {
    [UserRoles.ADMIN]: 'Администратор',
    [UserRoles.MANAGER]: 'Менеджер',
    [UserRoles.MENTOR]: 'Ментор',
    [UserRoles.EMPLOYEE]: 'Сотрудник',
    [UserRoles.TRAINEE]: 'Стажер'
  };
  return roleNames[role];
}

// Описание ролей
export function getRoleDescription(role: UserRoles): string {
  const roleDescriptions: Record<UserRoles, string> = {
    [UserRoles.ADMIN]: 'Полный доступ ко всем системам и настройкам',
    [UserRoles.MANAGER]: 'Управление курсами, пользователями и экзаменами',
    [UserRoles.MENTOR]: 'Проверка заданий и оценивание учеников',
    [UserRoles.EMPLOYEE]: 'Прохождение курсов и выполнение задач',
    [UserRoles.TRAINEE]: 'Обучение и прохождение стажировки'
  };
  return roleDescriptions[role];
}

export class FirestoreSchemaInitializer {
  // Приватный метод для создания коллекции с метаданными
  private static async createCollectionMetadata(
    collectionName: string, 
    description: string
  ) {
    const metadataRef = doc(firestore, 'system_metadata', collectionName);
    await setDoc(metadataRef, {
      name: collectionName,
      description,
      createdAt: Timestamp.now(),
      version: '1.0.0',
      indexes: [], // Место для описания индексов
      rules: {} // Место для описания правил валидации
    });
  }

  // Создание базовых справочников
  static async createReferenceCollections() {
    const batch = writeBatch(firestore);

    // Справочник ролей
    const rolesRef = doc(firestore, 'references', 'user_roles');
    batch.set(rolesRef, {
      roles: Object.values(UserRoles).map(role => ({
        id: role,
        name: getLocalizedRoleName(role),
        description: getRoleDescription(role),
        permissions: RolePermissions[role]
      }))
    });

    // Справочник статусов задач
    const taskStatusRef = doc(firestore, 'references', 'task_statuses');
    batch.set(taskStatusRef, {
      statuses: Object.values(TaskStatus).map(status => ({
        id: status,
        name: this.getTaskStatusName(status)
      }))
    });

    // Справочник статусов курсов
    const courseStatusRef = doc(firestore, 'references', 'course_statuses');
    batch.set(courseStatusRef, {
      statuses: Object.values(CourseStatus).map(status => ({
        id: status,
        name: this.getCourseStatusName(status)
      }))
    });

    await batch.commit();
  }

  // Вспомогательные методы для локализации
  private static getTaskStatusName(status: TaskStatus): string {
    const names = {
      [TaskStatus.NOT_STARTED]: 'Не начата',
      [TaskStatus.IN_PROGRESS]: 'В процессе',
      [TaskStatus.COMPLETED]: 'Завершена',
      [TaskStatus.FAILED]: 'Не выполнена'
    };
    return names[status];
  }

  private static getCourseStatusName(status: CourseStatus): string {
    const names = {
      [CourseStatus.DRAFT]: 'Черновик',
      [CourseStatus.PUBLISHED]: 'Опубликован',
      [CourseStatus.ARCHIVED]: 'Архив'
    };
    return names[status];
  }

  // Инициализация основных коллекций с метаданными
  static async initializeCollections() {
    const collections = [
      { name: 'users', description: 'Пользователи платформы' },
      { name: 'user_profiles', description: 'Профили пользователей' },
      { name: 'user_settings', description: 'Настройки пользователей' },
      { name: 'tasks', description: 'Задания и упражнения' },
      { name: 'courses', description: 'Учебные курсы' },
      { name: 'exams', description: 'Экзамены и тесты' },
      { name: 'certifications', description: 'Сертификаты' },
      { name: 'notifications', description: 'Уведомления пользователей' },
      { name: 'user_activities', description: 'Активности пользователей' }
    ];

    for (const collection of collections) {
      await this.createCollectionMetadata(
        collection.name, 
        collection.description
      );
    }
  }

  // Полная инициализация базы данных
  static async setup() {
    try {
      await this.initializeCollections();
      await this.createReferenceCollections();
      console.log('✅ Firestore база данных успешно инициализирована');
    } catch (error) {
      console.error('❌ Ошибка инициализации базы данных:', error);
      throw error;
    }
  }
}
