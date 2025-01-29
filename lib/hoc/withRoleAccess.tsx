'use client';

import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useAccess } from '@/lib/hooks/useAccess';
import { UserRoles, UserPermissions } from '@/lib/firebase/firestore-schema';

interface WithRoleAccessProps {
  requiredPermission?: keyof UserPermissions;
  requiredRoles?: UserRoles[];
}

export function withRoleAccess<P extends object>(
  WrappedComponent: ComponentType<P>, 
  options: WithRoleAccessProps = {}
) {
  return function WithRoleAccessComponent(props: P) {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();
    const { userRole, checkAccess } = useAccess();

    useEffect(() => {
      if (!loading) {
        // Если пользователь не авторизован
        if (!user) {
          router.push('/auth/signin');
          return;
        }

        // Проверка роли
        if (options.requiredRoles && 
            !options.requiredRoles.includes(userRole as UserRoles)) {
          router.push('/dashboard');
          return;
        }

        // Проверка разрешений
        if (options.requiredPermission && 
            !checkAccess(options.requiredPermission)) {
          router.push('/dashboard');
          return;
        }
      }
    }, [user, loading, userRole]);

    // Показываем компонент только если все проверки пройдены
    if (loading || !user || 
        (options.requiredRoles && !options.requiredRoles.includes(userRole as UserRoles)) ||
        (options.requiredPermission && !checkAccess(options.requiredPermission))) {
      return null; // Или можно показать loader
    }

    return <WrappedComponent {...props} />;
  };
}
