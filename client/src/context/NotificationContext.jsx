import React, { createContext, useContext, useState, useEffect } from "react";
import { generateId } from "../utils/helpers";

const NotifContext = createContext(null);

const DEMO_NOTIFICATIONS = [
  {
    id: "NOTIF001",
    type: "request",
    title: "New Blood Request",
    message: "A recipient in Mangaluru needs O+ blood urgently.",
    time: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    urgent: true,
  },
  {
    id: "NOTIF002",
    type: "match",
    title: "Donor Match Found",
    message: "We found 3 compatible donors near you.",
    time: new Date(Date.now() - 7200000).toISOString(),
    read: false,
    urgent: false,
  },
  {
    id: "NOTIF003",
    type: "confirmation",
    title: "Donation Confirmed",
    message: "Your donation has been confirmed. Thank you!",
    time: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    urgent: false,
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem("ld_notifications");
      return stored ? JSON.parse(stored) : DEMO_NOTIFICATIONS;
    } catch { return DEMO_NOTIFICATIONS; }
  });

  useEffect(() => {
    localStorage.setItem("ld_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notif) => {
    const n = { ...notif, id: generateId("NOTIF"), time: new Date().toISOString(), read: false };
    setNotifications(prev => [n, ...prev]);
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotifContext.Provider value={{ notifications, addNotification, markRead, markAllRead, deleteNotification, unreadCount }}>
      {children}
    </NotifContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
