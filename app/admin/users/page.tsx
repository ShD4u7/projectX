'use client';

import { useState, useEffect } from 'react';
import { AuthService, UserStatus } from '@/lib/firebase/auth';
import { UserRoles } from '@/lib/firebase/firestore-schema';
import { withRoleAccess } from '@/lib/hoc/withRoleAccess';

function AdminUserApprovalPage() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<{ [key: string]: UserRoles }>({});

  useEffect(() => {
    const fetchPendingUsers = async () => {
      const users = await AuthService.getPendingUsers();
      setPendingUsers(users);
    };

    fetchPendingUsers();
  }, []);

  const handleRoleChange = (userId: string, role: UserRoles) => {
    setSelectedRole(prev => ({
      ...prev,
      [userId]: role
    }));
  };

  const approveUser = async (userId: string) => {
    const role = selectedRole[userId] || UserRoles.STUDENT;
    await AuthService.approveUser(userId, role);
    setPendingUsers(pendingUsers.filter(u => u.id !== userId));
  };

  const rejectUser = async (userId: string) => {
    await AuthService.rejectUser(userId);
    setPendingUsers(pendingUsers.filter(u => u.id !== userId));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Одобрение пользователей</h1>
      
      {pendingUsers.length === 0 ? (
        <p className="text-gray-600">Нет ожидающих подтверждения пользователей</p>
      ) : (
        <div className="grid gap-4">
          {pendingUsers.map(user => (
            <div 
              key={user.id} 
              className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold">{user.displayName}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={selectedRole[user.id] || UserRoles.STUDENT}
                  onChange={(e) => handleRoleChange(user.id, e.target.value as UserRoles)}
                  className="border rounded px-2 py-1"
                >
                  {Object.values(UserRoles).map(role => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => approveUser(user.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Одобрить
                </button>
                
                <button
                  onClick={() => rejectUser(user.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Отклонить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withRoleAccess(AdminUserApprovalPage, {
  requiredRoles: [UserRoles.ADMIN],
  requiredPermission: 'userManagement.approve'
});
