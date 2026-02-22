"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Trash2,
  ArrowLeft,
  RefreshCw,
  Loader2,
  ShoppingBag,
  AlertTriangle,
  XCircle,
  Megaphone,
} from "lucide-react";
import { useNotifications } from "@/hooks/admin/useNotifications";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  } = useNotifications();

  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => !n.read);

  const getIcon = (type: string) => {
    switch (type) {
      case "ORDER":        return <ShoppingBag size={15} />;
      case "LOW_STOCK":    return <AlertTriangle size={15} />;
      case "OUT_OF_STOCK": return <XCircle size={15} />;
      default:             return <Megaphone size={15} />;
    }
  };

  const getTypeIconClass = (type: string) => {
    switch (type) {
      case "ORDER":        return "bg-blue-50 text-blue-600";
      case "LOW_STOCK":    return "bg-amber-50 text-amber-600";
      case "OUT_OF_STOCK": return "bg-red-50 text-red-600";
      default:             return "bg-zinc-100 text-zinc-500";
    }
  };

  const getTypePillClass = (type: string) => {
    switch (type) {
      case "ORDER":        return "bg-blue-50 text-blue-600";
      case "LOW_STOCK":    return "bg-amber-50 text-amber-600";
      case "OUT_OF_STOCK": return "bg-red-50 text-red-600";
      default:             return "bg-zinc-100 text-zinc-500";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ORDER":        return "New Order";
      case "LOW_STOCK":    return "Low Stock";
      case "OUT_OF_STOCK": return "Out of Stock";
      default:             return "Notice";
    }
  };

  const getUnreadBarClass = (type: string) => {
    switch (type) {
      case "ORDER":        return "bg-blue-500";
      case "LOW_STOCK":    return "bg-amber-400";
      case "OUT_OF_STOCK": return "bg-red-500";
      default:             return "bg-zinc-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 size={24} className="animate-spin text-zinc-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 px-2.5 py-1.5 rounded-lg transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">Notifications</h1>
          <p className="text-sm text-zinc-400 mt-1 flex items-center gap-2">
            <span>{unreadCount} unread</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300 inline-block" />
            <span>{notifications.length} total</span>
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === "unread"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
            <button
              onClick={refresh}
              title="Refresh"
              className="flex items-center justify-center w-9 h-9 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 rounded-lg transition-colors"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {/* List */}
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 mb-4">
                <Bell size={20} />
              </div>
              <p className="text-sm font-semibold text-zinc-600 mb-1">No notifications</p>
              <p className="text-sm text-zinc-400">
                {filter === "unread" ? "You're all caught up" : "Notifications will appear here"}
              </p>
            </div>
          ) : (
            <>
              {filteredNotifications.map((notif, index) => (
                <div
                  key={notif.id}
                  className={`group relative flex items-start gap-3.5 px-5 py-4 transition-colors ${
                    index !== filteredNotifications.length - 1 ? "border-b border-zinc-50" : ""
                  } ${!notif.read ? "bg-blue-50/30 hover:bg-blue-50/50" : "hover:bg-zinc-50"}`}
                >
                  {/* Unread left bar */}
                  {!notif.read && (
                    <span className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full ${getUnreadBarClass(notif.type)}`} />
                  )}

                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${getTypeIconClass(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${getTypePillClass(notif.type)}`}>
                        {getTypeLabel(notif.type)}
                      </span>
                    </div>
                    <Link
                      href={notif.link}
                      onClick={() => markAsRead(notif.id)}
                      className="block"
                    >
                      <p className={`text-sm leading-relaxed ${!notif.read ? "font-medium text-zinc-900" : "text-zinc-500"}`}>
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-zinc-400">{notif.timeAgo}</span>
                        {!notif.read && (
                          <span className="text-[10px] font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded tracking-wide">
                            NEW
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>

                  {/* Actions — visible on hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        title="Mark as read"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <CheckCheck size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      title="Delete"
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div className="px-5 py-3 border-t border-zinc-50 bg-zinc-50/60 text-center text-xs text-zinc-400">
                Showing {filteredNotifications.length} of {notifications.length} notifications
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}