import { firestore } from './index';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  writeBatch,
  Timestamp 
} from 'firebase/firestore';

export class FirestoreMigrations {
  // Версия текущей схемы
  private static CURRENT_SCHEMA_VERSION = '1.1.0';

  // Проверка необходимости миграции
  static async needsMigration(): Promise<boolean> {
    const metadataRef = doc(firestore, 'system_metadata', 'schema_version');
    const metadataSnap = await getDoc(metadataRef);
    
    if (!metadataSnap.exists()) return true;

    const currentVersion = metadataSnap.data().version;
    return currentVersion !== this.CURRENT_SCHEMA_VERSION;
  }

  // Основной метод миграции
  static async migrate() {
    if (!(await this.needsMigration())) {
      console.log('✅ Миграция не требуется');
      return;
    }

    const batch = writeBatch(firestore);

    try {
      // Миграция профилей пользователей
      await this.migrateUserProfiles(batch);

      // Миграция настроек
      await this.migrateUserSettings(batch);

      // Обновление версии схемы
      const versionRef = doc(firestore, 'system_metadata', 'schema_version');
      batch.set(versionRef, {
        version: this.CURRENT_SCHEMA_VERSION,
        migratedAt: Timestamp.now()
      });

      await batch.commit();
      console.log('✅ Миграция базы данных успешно завершена');
    } catch (error) {
      console.error('❌ Ошибка миграции:', error);
      throw error;
    }
  }

  // Миграция профилей пользователей
  private static async migrateUserProfiles(batch: WriteBatch) {
    const profilesQuery = query(
      collection(firestore, 'user_profiles'),
      where('migrated', '!=', true)
    );

    const profilesSnapshot = await getDocs(profilesQuery);

    profilesSnapshot.docs.forEach(profileDoc => {
      const profileData = profileDoc.data();
      
      // Добавление недостающих полей
      const updatedProfile = {
        ...profileData,
        skills: profileData.skills || [],
        socialLinks: profileData.socialLinks || {},
        migrated: true
      };

      batch.update(profileDoc.ref, updatedProfile);
    });
  }

  // Миграция настроек пользователей
  private static async migrateUserSettings(batch: WriteBatch) {
    const settingsQuery = query(
      collection(firestore, 'user_settings'),
      where('migrated', '!=', true)
    );

    const settingsSnapshot = await getDocs(settingsQuery);

    settingsSnapshot.docs.forEach(settingsDoc => {
      const settingsData = settingsDoc.data();
      
      // Добавление недостающих настроек
      const updatedSettings = {
        ...settingsData,
        appearance: settingsData.appearance || {
          theme: 'system',
          language: 'ru',
          fontSize: 16
        },
        migrated: true
      };

      batch.update(settingsDoc.ref, updatedSettings);
    });
  }
}
