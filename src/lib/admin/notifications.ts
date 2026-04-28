import {
  NotificationResponse,
  UnreadNotificationCount,
} from "@/types/admin/notification.type";
import apiClient from "../api/client";

export const adminNotificationApi = {
  //Get all notifications
  getAll: async () => {
    const res = await apiClient.get<NotificationResponse[]>(
      "/admin/notifications",
    );
    return res.data;
  },

  //Get unread count
  getUnreadCount: async () => {
    const res = await apiClient.get<UnreadNotificationCount>(
      "/admin/notifications/unread/count",
    );
    return res.data;
  },

  // Mark as read
  markAsRead: async (id: number) => {
    await apiClient.patch(`/admin/notifications/${id}/read`);
  },

  // Mark all as read
  markAllAsRead: async () => {
    await apiClient.patch("/admin/notifications/read-all");
  },

  // Delete notification
  deleteNotification: async (id: number) => {
    await apiClient.delete(`/admin/notifications/${id}`);
  },
  deleteAll: async () => {
    await apiClient.delete("/admin/notifications/delete-all");
  },
};
