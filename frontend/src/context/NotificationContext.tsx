import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

export interface AdminNotification {
  id: string;
  type: 'order' | 'stock' | 'review';
  title: string;
  message: string;
  orderId?: string;
  orderNumber?: string;
  total?: number;
  time: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: AdminNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  triggerOrderAlert: (order: Order) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Web Audio synthesizer for luxury chime
function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Play high harmonic chime
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3); // A6

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1174.66, ctx.currentTime); // D6
    osc2.frequency.exponentialRampToValueAtTime(2349.32, ctx.currentTime + 0.3); // D7

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.8);
    osc2.stop(ctx.currentTime + 0.8);

    // Haptic vibration on mobile
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  } catch (e) {
    console.log('Audio chime error:', e);
  }
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const saved = localStorage.getItem('bbs_notifications');
      return saved ? JSON.parse(saved) : [
        {
          id: 'notif_init',
          type: 'order',
          title: 'Nouvelle commande #BBS-00125',
          message: 'Aïcha Diallo a commandé 2 articles (37 000 FCFA)',
          orderNumber: 'BBS-00125',
          total: 37000,
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          read: false
        }
      ];
    } catch {
      return [];
    }
  });

  const [lastKnownOrderCount, setLastKnownOrderCount] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('bbs_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Polling for new orders when authenticated as admin
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkNewOrders = async () => {
      try {
        const orders = await api.getOrders();
        if (lastKnownOrderCount > 0 && orders.length > lastKnownOrderCount) {
          const newest = orders[0];
          triggerOrderAlert(newest);
        }
        setLastKnownOrderCount(orders.length);
      } catch (e) {
        // silent
      }
    };

    checkNewOrders();
    const interval = setInterval(checkNewOrders, 8000);
    return () => clearInterval(interval);
  }, [isAuthenticated, lastKnownOrderCount]);

  const triggerOrderAlert = (order: Order) => {
    playNotificationChime();

    const newNotif: AdminNotification = {
      id: `notif_${Date.now()}`,
      type: 'order',
      title: `🔔 Nouvelle commande #${order.orderNumber}`,
      message: `${order.customer.name} - ${order.items.length} produit(s) (${new Intl.NumberFormat('fr-FR').format(order.total)} FCFA)`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev.slice(0, 20)]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        triggerOrderAlert
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
