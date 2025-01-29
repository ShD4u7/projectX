import { RoleManagementService } from '@/lib/roles/role-management';
import { UserRoles } from '@/lib/firebase/firestore-schema';
import { firestore } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  deleteDoc
} from 'firebase/firestore';

describe('RoleManagementService', () => {
  const testRoleName = 'Test Custom Role';
  let createdRoleId: string;

  afterAll(async () => {
    // Очистка тестовых данных
    if (createdRoleId) {
      const roleRef = doc(firestore, 'system_roles', createdRoleId);
      await deleteDoc(roleRef);
    }
  });

  test('создание кастомной роли', async () => {
    createdRoleId = await RoleManagementService.createCustomRole(
      testRoleName, 
      'Тестовая роль для проверки'
    );

    expect(createdRoleId).toBeTruthy();

    // Проверка существования роли
    const roleExists = await RoleManagementService.roleExists(testRoleName);
    expect(roleExists).toBeTruthy();
  });

  test('получение кастомных ролей', async () => {
    const roles = await RoleManagementService.getAllCustomRoles();
    
    expect(Array.isArray(roles)).toBeTruthy();
    expect(roles.length).toBeGreaterThan(0);
  });

  test('обновление разрешений роли', async () => {
    await RoleManagementService.updateRolePermissions(createdRoleId, {
      learning: {
        viewCourses: false,
        createCourses: true
      }
    });

    // Получаем роль для проверки
    const rolesRef = collection(firestore, 'system_roles');
    const q = query(rolesRef, where('name', '==', testRoleName));
    const snapshot = await getDocs(q);

    const updatedRole = snapshot.docs[0].data();
    expect(updatedRole.permissions.learning.createCourses).toBeTruthy();
  });

  test('получение пользователей по роли', async () => {
    const users = await RoleManagementService.getUsersByRole(UserRoles.TRAINEE);
    
    expect(Array.isArray(users)).toBeTruthy();
  });

  test('массовое обновление ролей', async () => {
    const testUserIds = ['user1', 'user2', 'user3'];
    
    await RoleManagementService.bulkUpdateUserRoles(
      testUserIds, 
      createdRoleId
    );

    // Здесь можно добавить проверку обновления ролей
  });
});
