import { 
  collection, 
  query, 
  where, 
  getDocs, 
  limit, 
  orderBy,
  doc,
  getDoc,
  updateDoc,
  setDoc
} from 'firebase/firestore';
import { firestore } from './config';

// Интерфейс для кэша
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class FirestoreCacheService {
  private static cache = new Map<string, CacheEntry<any>>();
  private static DEFAULT_TTL = 5 * 60 * 1000; // 5 минут

  // Приватный метод для генерации уникального ключа
  private static generateCacheKey(
    collectionName: string, 
    params: Record<string, any> = {}
  ): string {
    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
    return `${collectionName}:${paramString}`;
  }

  // Метод для кэширования данных
  static async getCachedData<T>(
    collectionName: string, 
    params: {
      filterField?: string, 
      filterValue?: any,
      orderField?: string,
      limitCount?: number,
      ttl?: number
    } = {}
  ): Promise<T[]> {
    const { 
      filterField, 
      filterValue, 
      orderField, 
      limitCount,
      ttl = this.DEFAULT_TTL 
    } = params;

    const cacheKey = this.generateCacheKey(collectionName, params);
    const cachedEntry = this.cache.get(cacheKey);

    // Проверка кэша
    if (cachedEntry && Date.now() - cachedEntry.timestamp < cachedEntry.ttl) {
      return cachedEntry.data;
    }

    try {
      let q = collection(firestore, collectionName);
      
      // Применение фильтров
      if (filterField && filterValue) {
        q = query(q, where(filterField, '==', filterValue));
      }

      // Сортировка
      if (orderField) {
        q = query(q, orderBy(orderField));
      }

      // Лимит результатов
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];

      // Сохранение в кэш
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl
      });

      return data;
    } catch (error) {
      console.error('Ошибка при получении документов:', error);
      return [];
    }
  }

  // Метод для получения одного документа с кэшированием
  static async getCachedDocument<T>(
    collectionName: string, 
    documentId: string, 
    ttl = this.DEFAULT_TTL
  ): Promise<T | null> {
    const cacheKey = `doc:${collectionName}:${documentId}`;
    const cachedEntry = this.cache.get(cacheKey);

    // Проверка кэша
    if (cachedEntry && Date.now() - cachedEntry.timestamp < cachedEntry.ttl) {
      return cachedEntry.data;
    }

    try {
      const docRef = doc(firestore, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as T;

        // Сохранение в кэш
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl
        });

        return data;
      }
      return null;
    } catch (error) {
      console.error('Ошибка при получении документа:', error);
      return null;
    }
  }

  // Метод для обновления документа с инвалидацией кэша
  static async updateDocumentWithCacheInvalidation<T>(
    collectionName: string, 
    documentId: string, 
    data: Partial<T>
  ): Promise<boolean> {
    try {
      const docRef = doc(firestore, collectionName, documentId);
      await updateDoc(docRef, data);

      // Инвалидация кэша
      const cacheKey = `doc:${collectionName}:${documentId}`;
      this.cache.delete(cacheKey);

      return true;
    } catch (error) {
      console.error('Ошибка при обновлении документа:', error);
      return false;
    }
  }

  // Метод для очистки кэша
  static clearCache() {
    this.cache.clear();
  }
}
