import { cache } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  limit, 
  orderBy 
} from 'firebase/firestore';
import { firestore } from './firebase/config';

// Декоратор кэширования с инвалидацией
export function cacheable(
  duration: number = 300000, // 5 минут по умолчанию
  key?: string
) {
  const cache = new Map();

  return function(
    target: any, 
    propertyKey: string, 
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      const cacheKey = key || JSON.stringify(args);
      const cachedResult = cache.get(cacheKey);
      const now = Date.now();

      if (cachedResult && now - cachedResult.timestamp < duration) {
        return cachedResult.data;
      }

      const result = await originalMethod.apply(this, args);
      
      cache.set(cacheKey, {
        data: result,
        timestamp: now
      });

      return result;
    };

    return descriptor;
  };
}

// Оптимизированный сервис запросов
export class CachedFirestoreService {
  // Кэшированный запрос с фильтрацией и сортировкой
  @cacheable()
  static async getDocumentsWithCache(
    collectionName: string, 
    filterField?: string, 
    filterValue?: any,
    orderField?: string,
    limitCount?: number
  ) {
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
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Ошибка при получении документов:', error);
      return [];
    }
  }

  // Метод принудительной инвалидации кэша
  static invalidateCache() {
    // Реализация логики сброса кэша
  }
}
