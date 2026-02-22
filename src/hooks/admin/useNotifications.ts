import { adminNotificationApi } from "@/lib/api/admin/notifications";
import { NotificationResponse } from "@/types/notification.type";
import { useCallback, useEffect, useState, useRef } from "react";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminNotificationApi.getAll();
      setNotifications(data);
      const dataCount = await adminNotificationApi.getUnreadCount();
      setUnreadCount(dataCount.count);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message?.data ||
        "Failed to fetch notifications";
      setError(errorMessage);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []); 

  const markAsRead = useCallback(
    async (id: number) => {
      try {
        await adminNotificationApi.markAsRead(id);
        await fetchNotifications();
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message?.data ||
          "Failed to fetch notifications";
        setError(errorMessage);
        console.error("Fetch error:", err);
      }
    },
    [fetchNotifications],
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await adminNotificationApi.markAllAsRead();
      await fetchNotifications();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message?.data ||
        "Failed to fetch notifications";
      setError(errorMessage);
      console.error("Fetch error:", err);
    }
  }, [fetchNotifications]);

  const deleteNotification = useCallback(
    async (id: number) => {
      try {
        await adminNotificationApi.deleteNotification(id);
        await fetchNotifications();
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message?.data ||
          "Failed to fetch notifications";
        setError(errorMessage);
        console.error("Fetch error:", err);
      }
    },
    [fetchNotifications], 
  );


  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]); 

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchNotifications,
  };
};