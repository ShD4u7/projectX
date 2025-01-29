import { firestore, storage } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

// Роли пользователей
export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin'
}

// Интерфейс профиля пользователя
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  createdAt: Date;
  lastActive?: Date;
}

export class UserProfileService {
  private static COLLECTION = 'user_profiles';

  // Создание профиля пользователя
  static async createProfile(
    userId: string, 
    profileData: Omit<UserProfile, 'id' | 'createdAt'>
  ): Promise<UserProfile> {
    const profile: UserProfile = {
      id: userId,
      ...profileData,
      createdAt: new Date(),
      role: profileData.role || UserRole.STUDENT
    };

    await setDoc(
      doc(firestore, this.COLLECTION, userId), 
      profile
    );

    return profile;
  }

  // Получение профиля пользователя
  static async getProfile(userId: string): Promise<UserProfile | null> {
    const docRef = doc(firestore, this.COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() 
      ? docSnap.data() as UserProfile 
      : null;
  }

  // Обновление профиля
  static async updateProfile(
    userId: string, 
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    const docRef = doc(firestore, this.COLLECTION, userId);
    await updateDoc(docRef, {
      ...updates,
      lastActive: new Date()
    });

    const updatedProfile = await this.getProfile(userId);
    return updatedProfile!;
  }

  // Загрузка аватара
  static async uploadAvatar(
    userId: string, 
    file: File
  ): Promise<string> {
    const storageRef = ref(
      storage, 
      `avatars/${userId}/${file.name}`
    );

    // Удаление предыдущего аватара
    const profile = await this.getProfile(userId);
    if (profile?.avatarUrl) {
      const oldAvatarRef = ref(storage, profile.avatarUrl);
      await deleteObject(oldAvatarRef).catch(() => {});
    }

    // Загрузка нового аватара
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Обновление профиля
    await this.updateProfile(userId, { avatarUrl: downloadURL });

    return downloadURL;
  }

  // Удаление профиля
  static async deleteProfile(userId: string): Promise<void> {
    const docRef = doc(firestore, this.COLLECTION, userId);
    await deleteDoc(docRef);

    // Дополнительная логика очистки
    const profile = await this.getProfile(userId);
    if (profile?.avatarUrl) {
      const avatarRef = ref(storage, profile.avatarUrl);
      await deleteObject(avatarRef).catch(() => {});
    }
  }

  // Поиск пользователей
  static async searchUsers(
    query: string, 
    filters?: {
      role?: UserRole;
      skills?: string[];
    }
  ): Promise<UserProfile[]> {
    // В реальном приложении используйте серверные функции Firestore
    console.warn('Метод searchUsers требует серверной реализации');
    return [];
  }
}
