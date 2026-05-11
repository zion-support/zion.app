/**
 * Smart Notification System
 * Context-aware notifications for important updates
 * Priority: MEDIUM
 */

'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check, Info, AlertTriangle, Sparkles } from 'lucide-react';

type NotificationType = 'info' | 'success' | 'warning' | 'feature';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
};

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'welcome',
    type: 'feature',
    title: 'Welcome to Zion Tech Group! 🎉',
    message: 'Explore our 50+ AI solutions. Try our new AI Chat Support for instant help!',
    timestamp: Date.now(),
    read: false,
    action: { label: 'Try AI Chat', url: '/#chat' }
  },
  {
    id: 'autonomous',
    type: 'info',
    title: 'New: Autonomous Improvement System',
    message: 'Our app now continuously improves itself with AI agents. Check the dashboard!',
    timestamp: Date.now() - 3600000,
    read: false,
    action: { label: 'Learn More', url: '/about' }
  },
  {
    id: 'seo',
    type: 'success',
    title: 'SEO Score Improved',
    message: 'Auto-SEO optimizations have improved your search ranking score by 15%.',
    timestamp: Date.now() - 7200000,
    read: true
  }
];

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // Load notifications
    try {
      const saved = JSON.parse(localStorage.getItem('zion_notifications') || '[]');
      if (saved.length > 0) {
        setNotifications(saved);
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
      }
    } catch {
      setNotifications(DEFAULT_NOTIFICATIONS);
    }
  }, []);

  useEffect(() => {
    setHasUnread(notifications.some(n => !n.read));
  }, [notifications]);

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('zion_notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('zion_notifications', JSON.stringify(updated));
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('zion_notifications', JSON.stringify(updated));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return <Check size={16} color="#10b981" />;
      case 'warning': return <AlertTriangle size={16} color="#f59e0b" />;
      case 'feature': return <Sparkles size={16} color="#8b5cf6" />;
      default: return <Info size={16} color="#3b82f6" />;
    }
  };

  const getStyles = (type: NotificationType) => {
    switch (type) {
      case 'success': return { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981' };
      case 'warning': return { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b' };
      case 'feature': return { bg: 'rgba(139, 92, 246, 0.1)', border: '#8b5cf6' };
      default: return { bg: 'rgba(59, 130, 246, 0.1)', border: '#3b82f6' };
    }
  };

  const formatTime = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          padding: '10px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Bell size={20} color="#fff" />
        {hasUnread && (
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            background: '#ef4444',
            borderRadius: '50%'
          }} />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          right: 0,
          width: '360px',
          maxHeight: '480px',
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>Notifications</span>
            {hasUnread && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: '380px', overflow: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                <Bell size={32} style={{ marginBottom: '10px', opacity: 0.5 }} />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => {
                const styles = getStyles(notification.type);
                return (
                  <div
                    key={notification.id}
                    style={{
                      padding: '14px 16px',
                      borderBottom: '1px solid #333',
                      background: notification.read ? 'transparent' : styles.bg,
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    {/* Unread indicator */}
                    {!notification.read && (
                      <span style={{
                        position: 'absolute',
                        left: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '6px',
                        height: '6px',
                        background: styles.border,
                        borderRadius: '50%'
                      }} />
                    )}

                    <div style={{ display: 'flex', gap: '12px', paddingLeft: notification.read ? 0 : '8px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {getIcon(notification.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          color: '#fff', 
                          fontSize: '13px', 
                          fontWeight: notification.read ? 400 : 600,
                          marginBottom: '4px'
                        }}>
                          {notification.title}
                        </div>
                        <div style={{ color: '#888', fontSize: '12px', lineHeight: 1.4 }}>
                          {notification.message}
                        </div>
                        <div style={{ 
                          color: '#666', 
                          fontSize: '11px', 
                          marginTop: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <span>{formatTime(notification.timestamp)}</span>
                          {notification.action && (
                            <span style={{ color: '#3b82f6' }}>
                              {notification.action.label} →
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => dismissNotification(notification.id, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          opacity: 0.5
                        }}
                      >
                        <X size={14} color="#666" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
