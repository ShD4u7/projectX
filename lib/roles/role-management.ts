import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { 
  UserRoles, 
  UserPermissions, 
  RolePermissions 
} from '@/lib/firebase/firestore-schema';

export interface RoleDefinition {
  id?: string;
  name: string;
  description: string;
  permissions: UserPermissions;
}

export class RoleManagementService {
  private static ROLES_COLLECTION = 'system_roles';

  // Создание новой роли
  static async createCustomRole(
    roleName: string, 
    description: string, 
    baseRole: UserRoles = UserRoles.TRAINEE
  ): Promise<string> {
    const basePermissions = RolePermissions[baseRole];
    
    const newRole: RoleDefinition = {
      name: roleName,
      description: description,
      permissions: { ...basePermissions }
    };

    const roleRef = await addDoc(
      collection(firestore, this.ROLES_COLLECTION), 
      newRole
    );

    return roleRef.id;
  }

  // Получение всех пользовательских ролей
  static async getAllCustomRoles(): Promise<RoleDefinition[]> {
    const q = query(
      collection(firestore, this.ROLES_COLLECTION)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as RoleDefinition));
  }

  // Обновление разрешений роли
  static async updateRolePermissions(
    roleId: string, 
    updates: Partial<UserPermissions>
  ): Promise<void> {
    const roleRef = doc(firestore, this.ROLES_COLLECTION, roleId);
    
    await updateDoc(roleRef, {
      permissions: updates
    });
  }

  // Удаление роли
  static async deleteRole(roleId: string): Promise<void> {
    const roleRef = doc(firestore, this.ROLES_COLLECTION, roleId);
    await deleteDoc(roleRef);
  }

  // Получение пользователей с определенной ролью
  static async getUsersByRole(role: UserRoles | string): Promise<string[]> {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('role', '==', role));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.id);
  }

  // Массовое обновление ролей
  static async bulkUpdateUserRoles(
    userIds: string[], 
    newRole: UserRoles | string
  ): Promise<void> {
    const batch = [];
    
    for (const userId of userIds) {
      const userRef = doc(firestore, 'users', userId);
      batch.push(
        updateDoc(userRef, { role: newRole })
      );
    }

    await Promise.all(batch);
  }

  // Проверка существования роли
  static async roleExists(roleName: string): Promise<boolean> {
    const q = query(
      collection(firestore, this.ROLES_COLLECTION), 
      where('name', '==', roleName)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }
}

// Пример использования
export async function exampleRoleManagement() {
  // Создание кастомной роли
  const newRoleId = await RoleManagementService.createCustomRole(
    'Специальный ассистент', 
    'Роль с расширенными правами для специальных сотрудников'
  );

  // Обновление разрешений
  await RoleManagementService.updateRolePermissions(newRoleId, {
    learning: {
      viewCourses: true,
      enrollCourses: true,
      createCourses: true,
      editCourses: false,
      deleteCourses: false
    }
  });

  // Получение пользователей с определенной ролью
  const trainees = await RoleManagementService.getUsersByRole(UserRoles.TRAINEE);

  // Массовое обновление ролей
  await RoleManagementService.bulkUpdateUserRoles(
    trainees, 
    newRoleId
  );
}
