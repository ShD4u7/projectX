import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User,
  AuthError
} from 'firebase/auth';
import { auth, firestore } from './index';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { UserRoles } from './firestore-schema';

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface AuthResult {
  user?: User | null;
  error?: string;
}

export class AuthService {
  // Регистрация нового пользователя
  static async signUp(
    email: string, 
    password: string, 
    displayName: string,
    role: UserRoles = UserRoles.TRAINEE
  ): Promise<AuthResult> {
    try {
      // Создание пользователя в Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        password
      );
      const user = userCredential.user;

      // Обновление профиля
      await updateProfile(user, { displayName });

      // Создание документа пользователя в Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        role: role,
        status: UserStatus.PENDING,
        createdAt: new Date(),
        lastLogin: new Date()
      });

      return { user };
    } catch (error: any) {
      const authError = error as AuthError;
      let errorMessage = 'Ошибка регистрации';

      switch (authError.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email уже используется';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Некорректный email';
          break;
        case 'auth/weak-password':
          errorMessage = 'Слабый пароль';
          break;
      }

      return { error: errorMessage };
    }
  }

  // Вход пользователя
  static async signIn(
    email: string, 
    password: string
  ): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        email, 
        password
      );
      
      // Обновление времени последнего входа
      await setDoc(
        doc(firestore, 'users', userCredential.user.uid), 
        { lastLogin: new Date() }, 
        { merge: true }
      );

      return { user: userCredential.user };
    } catch (error: any) {
      const authError = error as AuthError;
      let errorMessage = 'Ошибка входа';

      switch (authError.code) {
        case 'auth/wrong-password':
          errorMessage = 'Неверный пароль';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Пользователь не найден';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Некорректный email';
          break;
      }

      return { error: errorMessage };
    }
  }

  // Получение списка ожидающих подтверждения пользователей
  static async getPendingUsers(): Promise<any[]> {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('status', '==', UserStatus.PENDING));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // Одобрение пользователя администратором
  static async approveUser(
    userId: string, 
    role: UserRoles
  ): Promise<void> {
    const userRef = doc(firestore, 'users', userId);
    
    await updateDoc(userRef, {
      status: UserStatus.APPROVED,
      role: role
    });
  }

  // Отклонение регистрации
  static async rejectUser(userId: string): Promise<void> {
    const userRef = doc(firestore, 'users', userId);
    
    await updateDoc(userRef, {
      status: UserStatus.REJECTED
    });
  }

  // Восстановление пароля
  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      await sendPasswordResetEmail(auth, email);
      return {};
    } catch (error: any) {
      const authError = error as AuthError;
      let errorMessage = 'Ошибка восстановления пароля';

      switch (authError.code) {
        case 'auth/user-not-found':
          errorMessage = 'Пользователь с таким email не найден';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Некорректный email';
          break;
      }

      return { error: errorMessage };
    }
  }

  // Выход пользователя
  static async signOut(): Promise<void> {
    await signOut(auth);
  }

  // Получение текущего пользователя
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }
}
