import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { 
  collection, 
  addDoc, 
  Timestamp 
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export interface ErrorLog {
  message: string;
  stack?: string;
  userId?: string;
  timestamp: Timestamp;
  severity: 'error' | 'warning' | 'info';
  context?: Record<string, any>;
}

export class ErrorTrackingService {
  private static ERROR_LOGS_COLLECTION = 'error_logs';

  // Инициализация Sentry
  static initializeSentry(dsn: string) {
    Sentry.init({
      dsn: dsn,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      debug: process.env.NODE_ENV !== 'production',
      environment: process.env.NODE_ENV
    });
  }

  // Логирование ошибки в Firestore
  static async logErrorToFirestore(
    error: Error, 
    userId?: string, 
    context?: Record<string, any>
  ): Promise<string> {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      userId,
      timestamp: Timestamp.now(),
      severity: 'error',
      context
    };

    const docRef = await addDoc(
      collection(firestore, this.ERROR_LOGS_COLLECTION), 
      errorLog
    );

    return docRef.id;
  }

  // Отправка ошибки в Sentry
  static captureException(
    error: Error, 
    userId?: string, 
    extraContext?: Record<string, any>
  ) {
    Sentry.withScope(scope => {
      if (userId) {
        scope.setUser({ id: userId });
      }

      if (extraContext) {
        Object.entries(extraContext).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }

      Sentry.captureException(error);
    });
  }

  // Комплексное логирование ошибок
  static handleError(
    error: Error, 
    userId?: string, 
    context?: Record<string, any>
  ) {
    // Логирование в Firestore
    this.logErrorToFirestore(error, userId, context);

    // Отправка в Sentry
    this.captureException(error, userId, context);

    // Логирование в консоль в development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Ошибка:', error);
    }
  }

  // Установка пользовательского контекста
  static setUserContext(userId: string) {
    Sentry.setUser({ id: userId });
  }

  // Очистка контекста
  static clearUserContext() {
    Sentry.setUser(null);
  }
}

// Пример использования
export async function exampleErrorTracking() {
  // Инициализация Sentry
  ErrorTrackingService.initializeSentry('YOUR_SENTRY_DSN');

  try {
    // Какой-то код, который может вызвать ошибку
    throw new Error('Тестовая ошибка');
  } catch (error) {
    // Обработка ошибки
    ErrorTrackingService.handleError(
      error as Error, 
      'user123', 
      { feature: 'authentication' }
    );
  }
}
