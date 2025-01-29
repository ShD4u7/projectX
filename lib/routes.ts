export const ROUTES = {
  // Публичные маршруты
  PUBLIC: {
    HOME: '/',
    SIGNIN: '/signin',
    SIGNUP: '/signup',
  },

  // Защищенные маршруты
  PRIVATE: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    TASKS: '/tasks',
    EXAMS: '/exams',
    CERTIFICATION: '/certification',
    NOTIFICATIONS: '/notifications',
  },

  // Административные маршруты
  ADMIN: {
    USERS: '/admin/users',
    ANALYTICS: '/admin/analytics',
    MANAGEMENT: '/admin/management',
  }
};

// Функция проверки доступа к маршруту
export function checkRouteAccess(route: string, userRole?: string): boolean {
  // Публичные маршруты всегда доступны
  if (Object.values(ROUTES.PUBLIC).includes(route)) {
    return true;
  }

  // Проверка доступа для приватных маршрутов
  const privateRoutes = Object.values(ROUTES.PRIVATE);
  if (privateRoutes.includes(route)) {
    return !!userRole; // Требуется авторизация
  }

  // Проверка доступа для административных маршрутов
  const adminRoutes = Object.values(ROUTES.ADMIN);
  if (adminRoutes.includes(route)) {
    return userRole === 'ADMIN';
  }

  return false;
}

// Функция редиректа
export function getRedirectRoute(userRole?: string): string {
  switch (userRole) {
    case 'ADMIN':
      return ROUTES.ADMIN.ANALYTICS;
    case 'USER':
      return ROUTES.PRIVATE.DASHBOARD;
    default:
      return ROUTES.PUBLIC.SIGNIN;
  }
}
