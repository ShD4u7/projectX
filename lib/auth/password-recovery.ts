import { 
  sendPasswordResetEmail, 
  confirmPasswordReset,
  verifyPasswordResetCode
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc, 
  Timestamp 
} from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

export interface PasswordResetRequest {
  userId: string;
  email: string;
  token: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  used: boolean;
}

export class PasswordRecoveryService {
  private static RESET_REQUESTS_COLLECTION = 'password_reset_requests';
  private static TOKEN_EXPIRATION_HOURS = 2;

  // Отправка письма для сброса пароля
  static async initiatePasswordReset(email: string): Promise<boolean> {
    try {
      // Отправка Firebase письма для сброса
      await sendPasswordResetEmail(auth, email);

      // Создание дополнительного токена для безопасности
      const token = uuidv4();
      const now = Timestamp.now();
      const expiresAt = Timestamp.fromMillis(
        now.toMillis() + this.TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000
      );

      // Получаем пользователя
      const userQuery = await this.findUserByEmail(email);
      
      if (!userQuery) {
        throw new Error('Пользователь не найден');
      }

      // Сохраняем запрос на сброс
      await setDoc(doc(firestore, this.RESET_REQUESTS_COLLECTION, token), {
        userId: userQuery.id,
        email,
        token,
        createdAt: now,
        expiresAt,
        used: false
      });

      // Отправка письма с кастомным токеном
      await this.sendResetEmail(email, token);

      return true;
    } catch (error) {
      console.error('Ошибка сброса пароля:', error);
      return false;
    }
  }

  // Проверка токена сброса пароля
  static async validateResetToken(token: string): Promise<PasswordResetRequest | null> {
    const tokenDoc = doc(firestore, this.RESET_REQUESTS_COLLECTION, token);
    const tokenSnapshot = await getDoc(tokenDoc);

    if (!tokenSnapshot.exists()) return null;

    const tokenData = tokenSnapshot.data() as PasswordResetRequest;

    // Проверка истечения токена и использования
    if (
      tokenData.used || 
      tokenData.expiresAt.toMillis() < Date.now()
    ) {
      return null;
    }

    return tokenData;
  }

  // Сброс пароля
  static async resetPassword(
    token: string, 
    newPassword: string
  ): Promise<boolean> {
    try {
      const tokenData = await this.validateResetToken(token);
      
      if (!tokenData) {
        throw new Error('Недействительный токен');
      }

      // Сброс пароля через Firebase
      await confirmPasswordReset(auth, token, newPassword);

      // Пометить токен как использованный
      await updateDoc(
        doc(firestore, this.RESET_REQUESTS_COLLECTION, token),
        { used: true }
      );

      return true;
    } catch (error) {
      console.error('Ошибка сброса пароля:', error);
      return false;
    }
  }

  // Поиск пользователя по email
  private static async findUserByEmail(email: string) {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    return snapshot.docs.length > 0 
      ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
      : null;
  }

  // Отправка письма для сброса пароля
  private static async sendResetEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Сброс пароля',
      html: `
        <h1>Сброс пароля</h1>
        <p>Перейдите по ссылке для сброса пароля:</p>
        <a href="${resetLink}">Сбросить пароль</a>
        <p>Ссылка действительна ${this.TOKEN_EXPIRATION_HOURS} часа</p>
      `
    });
  }
}

// Пример использования
export async function examplePasswordRecovery() {
  // Инициация сброса
  await PasswordRecoveryService.initiatePasswordReset('user@example.com');

  // Сброс пароля
  await PasswordRecoveryService.resetPassword(
    'some-reset-token', 
    'NewSecurePassword123!'
  );
}
