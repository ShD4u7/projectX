import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase';
import { 
  UserRoles, 
  UserPermissions, 
  RolePermissions,
  getLocalizedRoleName,
  getRoleDescription
} from '@/lib/firebase/firestore-schema';

export function useAccess() {
  const [user, loading] = useAuthState(auth);
  const [userRole, setUserRole] = useState<UserRoles | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          const userData = userDoc.data();
          
          if (userData) {
            const role = userData.role as UserRoles;
            setUserRole(role);
            setPermissions(RolePermissions[role]);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };

    if (!loading) {
      fetchUserRole();
    }
  }, [user, loading]);

  // Проверка доступа к конкретному разрешению
  const checkAccess = (
    section: keyof UserPermissions, 
    action?: string
  ): boolean => {
    if (!permissions) return false;

    const sectionPermissions = permissions[section];

    // Для сложных разрешений (объектов)
    if (typeof sectionPermissions === 'object' && action) {
      return sectionPermissions[action as keyof typeof sectionPermissions] || false;
    }

    // Для простых булевых разрешений
    return sectionPermissions as boolean;
  };

  // Получение локализованного имени роли
  const getLocalizedRole = (): string => {
    return userRole ? getLocalizedRoleName(userRole) : '';
  };

  // Получение описания роли
  const getRoleDesc = (): string => {
    return userRole ? getRoleDescription(userRole) : '';
  };

  return {
    userRole,
    permissions,
    checkAccess,
    getLocalizedRole,
    getRoleDesc,
    isLoading: loading
  };
}
