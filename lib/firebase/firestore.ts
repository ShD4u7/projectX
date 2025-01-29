import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { firestore } from './config';

export class FirestoreService {
  // Добавление документа
  static async addDocument(collectionName: string, data: any): Promise<string> {
    try {
      const docRef = await addDoc(collection(firestore, collectionName), data);
      return docRef.id;
    } catch (error) {
      console.error('Ошибка при добавлении документа:', error);
      throw error;
    }
  }

  // Обновление документа
  static async updateDocument(
    collectionName: string, 
    documentId: string, 
    data: any
  ): Promise<void> {
    try {
      const docRef = doc(firestore, collectionName, documentId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Ошибка при обновлении документа:', error);
      throw error;
    }
  }

  // Удаление документа
  static async deleteDocument(
    collectionName: string, 
    documentId: string
  ): Promise<void> {
    try {
      const docRef = doc(firestore, collectionName, documentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Ошибка при удалении документа:', error);
      throw error;
    }
  }

  // Получение документов с фильтрацией
  static async getDocuments(
    collectionName: string, 
    filterField?: string, 
    filterValue?: any
  ): Promise<any[]> {
    try {
      let q = collection(firestore, collectionName);
      
      if (filterField && filterValue) {
        q = query(q, where(filterField, '==', filterValue));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Ошибка при получении документов:', error);
      throw error;
    }
  }
}
