export interface Notification {
  id: number;
  type: string;
  message: string;
  read: boolean;
  referenceId: number;
  timeAgo: string;
  createdAt: string;
}

export interface NotificationResponse {
  id: number;
  type: string;
  message: string;
  read: boolean;
  referenceId: number;
  timeAgo: string;
  link: string;
  createdAt: string;
}

export interface UnreadNotificationCount {
  count: number;
}
