import { firestore } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';

// Настройки уведомлений
export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

// Настройки приватности
export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'limited';
  showEmail: boolean;
  showLastActive: boolean;
}

// Настройки темы и интерфейса
export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: number;
}

// Общие настройки пользователя
export interface UserSettings {
  userId: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
  createdAt: Date;
  updatedAt: Date;
}

export class UserSettingsService {
  private static COLLECTION = 'user_settings';

  // Создание настроек по умолчанию
  static async createDefaultSettings(userId: string): Promise<UserSettings> {
    const defaultSettings: UserSettings = {
      userId,
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showLastActive: true
      },
      appearance: {
        theme: 'system',
        language: 'ru',
        fontSize: 16
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(
      doc(firestore, this.COLLECTION, userId), 
      defaultSettings
    );

    return defaultSettings;
  }

  // Получение настроек пользователя
  static async getSettings(userId: string): Promise<UserSettings | null> {
    const docRef = doc(firestore, this.COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserSettings;
    }

    return this.createDefaultSettings(userId);
  }

  // Обновление настроек уведомлений
  static async updateNotificationSettings(
    userId: string, 
    settings: Partial<NotificationSettings>
  ): Promise<UserSettings> {
    const docRef = doc(firestore, this.COLLECTION, userId);
    await updateDoc(docRef, {
      notifications: settings,
      updatedAt: new Date()
    });

    return this.getSettings(userId) as Promise<UserSettings>;
  }

  // Обновление настроек приватности
  static async updatePrivacySettings(
    userId: string, 
    settings: Partial<PrivacySettings>
  ): Promise<UserSettings> {
    const docRef = doc(firestore, this.COLLECTION, userId);
    await updateDoc(docRef, {
      privacy: settings,
      updatedAt: new Date()
    });

    return this.getSettings(userId) as Promise<UserSettings>;
  }

  // Обновление настроек внешнего вида
  static async updateAppearanceSettings(
    userId: string, 
    settings: Partial<AppearanceSettings>
  ): Promise<UserSettings> {
    const docRef = doc(firestore, this.COLLECTION, userId);
    await updateDoc(docRef, {
      appearance: settings,
      updatedAt: new Date()
    });

    return this.getSettings(userId) as Promise<UserSettings>;
  }

  // Сброс настроек к значениям по умолчанию
  static async resetToDefaultSettings(userId: string): Promise<UserSettings> {
    const defaultSettings = await this.createDefaultSettings(userId);
    return defaultSettings;
  }
}
