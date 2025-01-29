import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';
import { NotificationService, NotificationType } from '@/lib/notifications/notification-service';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  id?: string;
  title: string;
  message: string;
  type: NotificationType;
  onClose: () => void;
}

const NotificationIcon = {
  [NotificationType.SUCCESS]: <CheckCircle className="text-green-500" />,
  [NotificationType.ERROR]: <AlertTriangle className="text-red-500" />,
  [NotificationType.WARNING]: <AlertTriangle className="text-yellow-500" />,
  [NotificationType.INFO]: <Info className="text-blue-500" />
};

const NotificationItem: React.FC<NotificationProps> = ({ 
  id, 
  title, 
  message, 
  type, 
  onClose 
}) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 100 }}
    className={`
      flex items-start p-4 rounded-lg shadow-md mb-2 
      ${type === NotificationType.SUCCESS ? 'bg-green-50' : 
        type === NotificationType.ERROR ? 'bg-red-50' : 
        type === NotificationType.WARNING ? 'bg-yellow-50' : 
        'bg-blue-50'}
    `}
  >
    <div className="mr-4 mt-1">
      {NotificationIcon[type]}
    </div>
    <div className="flex-grow">
      <h4 className="font-bold">{title}</h4>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
    <button 
      onClick={onClose} 
      className="ml-4 hover:bg-gray-100 rounded-full p-1"
    >
      <X size={16} />
    </button>
  </motion.div>
);

export const NotificationCenter: React.FC = () => {
  const [user] = useAuthState(auth);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const userNotifications = await NotificationService.getUserNotifications(user.uid);
      setNotifications(userNotifications);

      const count = await NotificationService.getUnreadNotificationsCount(user.uid);
      setUnreadCount(count);
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000); // Обновление каждые 5 минут

    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    await NotificationService.markNotificationAsRead(notificationId);
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full"
      >
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white border rounded-lg shadow-lg z-50"
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold">Уведомления</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-gray-100 rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>

          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Нет новых уведомлений
              </div>
            ) : (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  {...notification}
                  onClose={() => handleMarkAsRead(notification.id)}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
