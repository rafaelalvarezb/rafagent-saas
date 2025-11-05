import { useQuery } from '@tanstack/react-query';
import { apiCall } from '@/lib/api';

export interface Notification {
  id: string;
  type: 'email_opened' | 'replied' | 'meeting_scheduled';
  prospectName: string;
  prospectEmail: string;
  companyName: string | null;
  contactTitle: string | null;
  timestamp: string;
  meetingTime?: string;
  read: boolean;
}

export function useNotifications() {
  const { data: notifications = [], isLoading, error, refetch } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await apiCall('/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Get unread count from localStorage (simple approach for now)
  const getUnreadCount = () => {
    const lastSeenTimestamp = localStorage.getItem('notifications_last_seen');
    if (!lastSeenTimestamp) {
      return notifications.length;
    }
    const lastSeen = new Date(lastSeenTimestamp);
    return notifications.filter(n => new Date(n.timestamp) > lastSeen).length;
  };

  const markAllAsRead = () => {
    localStorage.setItem('notifications_last_seen', new Date().toISOString());
  };

  return {
    notifications,
    isLoading,
    error,
    refetch,
    unreadCount: getUnreadCount(),
    markAllAsRead
  };
}

