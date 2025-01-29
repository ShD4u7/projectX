import { 
  collection, 
  query, 
  where, 
  limit,
  getDocs,
  doc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { 
  getDownloadURL, 
  ref, 
  uploadBytes 
} from 'firebase/storage';

export class PerformanceOptimizationService {
  // Кэширование частых запросов
  private static queryCache = new Map<string, any>();
  private static CACHE_EXPIRATION = 5 * 60 * 1000; // 5 минут

  // Кэшированный запрос с истечением
  static async cachedQuery(
    collectionName: string, 
    queryParams: any, 
    cacheKey: string
  ) {
    const now = Date.now();
    const cachedResult = this.queryCache.get(cacheKey);

    if (cachedResult && (now - cachedResult.timestamp) < this.CACHE_EXPIRATION) {
      return cachedResult.data;
    }

    const q = query(
      collection(firestore, collectionName),
      ...Object.entries(queryParams).map(([field, value]) => 
        where(field, '==', value)
      ),
      limit(50)
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    this.queryCache.set(cacheKey, {
      timestamp: now,
      data
    });

    return data;
  }

  // Оптимизация загрузки файлов
  static async optimizeFileUpload(
    file: File, 
    userId: string, 
    type: 'avatar' | 'document'
  ): Promise<string> {
    // Генерация уникального пути
    const fileName = `${type}/${userId}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);

    // Компрессия изображений
    if (type === 'avatar') {
      const compressedFile = await this.compressImage(file);
      await uploadBytes(storageRef, compressedFile);
    } else {
      await uploadBytes(storageRef, file);
    }

    // Получение URL
    const downloadURL = await getDownloadURL(storageRef);

    // Обновление профиля
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      [`${type}URL`]: downloadURL,
      [`${type}UpdatedAt`]: Timestamp.now()
    });

    return downloadURL;
  }

  // Компрессия изображений
  private static async compressImage(file: File): Promise<File> {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    await new Promise(resolve => {
      img.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const maxWidth = 500;
    const scaleFactor = maxWidth / img.width;
    
    canvas.width = maxWidth;
    canvas.height = img.height * scaleFactor;
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    return new Promise<File>(resolve => {
      canvas.toBlob(blob => {
        const compressedFile = new File(
          [blob!], 
          file.name, 
          { type: 'image/jpeg' }
        );
        resolve(compressedFile);
      }, 'image/jpeg', 0.7);
    });
  }

  // Ленивая загрузка данных
  static async lazyLoadData(
    collectionName: string, 
    userId: string, 
    pageSize = 20, 
    lastDoc?: any
  ) {
    const baseQuery = query(
      collection(firestore, collectionName),
      where('userId', '==', userId),
      limit(pageSize)
    );

    const snapshot = await getDocs(baseQuery);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      data,
      lastDoc: snapshot.docs[snapshot.docs.length - 1]
    };
  }

  // Предварительная выборка данных
  static prefetchUserData(userId: string) {
    return Promise.all([
      this.cachedQuery('users', { id: userId }, `user_${userId}`),
      this.cachedQuery('tasks', { assignedTo: userId }, `tasks_${userId}`),
      this.cachedQuery('courses', { enrolledUsers: userId }, `courses_${userId}`)
    ]);
  }
}

// Пример использования
export async function examplePerformanceOptimization() {
  // Кэшированный запрос
  const cachedUsers = await PerformanceOptimizationService.cachedQuery(
    'users', 
    { role: 'TRAINEE' }, 
    'trainees'
  );

  // Оптимизация загрузки файла
  const avatarUrl = await PerformanceOptimizationService.optimizeFileUpload(
    new File([], 'avatar.jpg'), 
    'user123', 
    'avatar'
  );

  // Ленивая загрузка
  const { data, lastDoc } = await PerformanceOptimizationService.lazyLoadData(
    'tasks', 
    'user123'
  );

  // Предварительная выборка
  await PerformanceOptimizationService.prefetchUserData('user123');
}
