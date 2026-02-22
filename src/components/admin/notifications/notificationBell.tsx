"use client"
import { useNotifications } from "@/hooks/admin/useNotifications";
import { CheckCheck , ExternalLink , Trash2 , Bell  , Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { notifications, fetchNotifications , deleteNotification, markAsRead, markAllAsRead,error , loading , refresh , unreadCount} = useNotifications();

   

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)){
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    },[])

    const getIcon = (type: string) => {
        switch (type) {
                case "ORDER": return "💰";
                case "LOW_STOCK": return "⚠️";
                case "OUT_OF_STOCK": return "❌";
                default: return "📢";
        }
    };

    const getColor = (type: string) => {
            switch (type) {
                case "ORDER": return "bg-blue-100 text-blue-600";
                case "LOW_STOCK": return "bg-yellow-100 text-yellow-600";
                case "OUT_OF_STOCK": return "bg-red-100 text-red-600";
                default: return "bg-gray-100 text-gray-600";
                }
    };


      return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl  shadow-lg border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {unreadCount} unread
              </p>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-2 hover:bg-gray-100 rounded-lg text-sm text-blue-600"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <Link
                href="/admin/notifications"
                className="p-2 hover:bg-gray-100 rounded-lg text-sm text-gray-600"
                title="View all"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No notifications</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-gray-200  last:border-0 hover:bg-gray-50  transition-colors ${
                    !notif.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-lg ${getColor(notif.type)} flex items-center justify-center flex-shrink-0`}>
                      <span>{getIcon(notif.type)}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Link
                        href={notif.link}
                        onClick={() => markAsRead(notif.id)}
                        className="block"
                      >
                        <p className={`text-sm ${!notif.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{notif.timeAgo}</p>
                      </Link>
                    </div>

                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="opacity-0 group-hover:opacity-100 hover:bg-gray-200 p-1 rounded-lg text-gray-400 hover:text-red-600 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 5 && (
            <Link
              href="/admin/notifications"
              className="block p-3 text-center text-sm text-blue-600 hover:bg-gray-50 rounded-b-xl border-t"
            >
              View all {notifications.length} notifications
            </Link>
          )}
        </div>
      )}
    </div>
  );




}