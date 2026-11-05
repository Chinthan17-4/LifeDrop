import React from "react";
import { Bell, CheckCheck, Trash2, AlertCircle, Heart, Users, CheckCircle } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { timeAgo } from "../utils/helpers";

const TYPE_ICONS = {
  request: AlertCircle,
  match: Users,
  confirmation: CheckCircle,
  contact: Heart,
  default: Bell,
};

const TYPE_COLORS = {
  request: "bg-red-50 text-[#C62828] border-red-200/60",
  match: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  confirmation: "bg-blue-50 text-blue-600 border-blue-200/60",
  contact: "bg-purple-50 text-purple-600 border-purple-200/60",
  default: "bg-gray-50 text-gray-500 border-gray-200/60",
};

export default function Notifications() {
  const { notifications, markRead, markAllRead, deleteNotification, unreadCount } = useNotifications();

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? "s" : ""}` : "All notifications caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3.5"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="glass py-20 text-center text-gray-400">
          <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold text-gray-600">No active alerts</p>
          <p className="text-xs text-gray-400 mt-0.5">You're all clear.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notif) => {
            const Icon = TYPE_ICONS[notif.type] || TYPE_ICONS.default;
            const iconClass = TYPE_COLORS[notif.type] || TYPE_COLORS.default;
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`glass p-4 flex gap-3.5 cursor-pointer card-hover border ${
                  notif.read ? "opacity-75" : "border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
                } ${notif.urgent ? "border-l-4 border-l-[#C62828]" : ""}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border ${iconClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs sm:text-sm font-bold ${notif.read ? "text-gray-600" : "text-gray-900"}`}>
                      {notif.urgent && <span className="text-[#C62828] mr-1">🚨</span>}
                      {notif.title}
                    </p>
                    {!notif.read && <span className="w-2 h-2 bg-[#C62828] rounded-full flex-shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase mt-1.5">{timeAgo(notif.time)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  className="p-1.5 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
