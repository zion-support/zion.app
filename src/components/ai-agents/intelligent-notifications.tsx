'use client';

import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: string;
}

export default function IntelligentNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Simulate real-time notifications
    const sampleNotifications: Notification[] = [
      {
        id: 'notif-001',
        type: 'success',
        title: 'Deployment Successful',
        message: 'Production deployment completed in 45s with 0 errors. All systems operating normally.',
        timestamp: new Date(Date.now() - 5 * 60000),
        read: false
      },
      {
        id: 'notif-002',
        type: 'alert',
        title: 'High CPU Usage Detected',
        message: 'CPU usage exceeded 80% for 5 minutes. AI auto-scaling has adjusted resources.',
        timestamp: new Date(Date.now() - 15 * 60000),
        read: false
      },
      {
        id: 'notif-003',
        type: 'warning',
        title: 'Vulnerability Found',
        message: 'Security scan detected 1 medium vulnerability in lodash dependency. Auto-patch available.',
        timestamp: new Date(Date.now() - 35 * 60000),
        read: false,
        action: 'Patch Now'
      },
      {
        id: 'notif-004',
        type: 'info',
        title: 'Performance Improvement Available',
        message: 'AI identified opportunity to optimize image loading. Estimated 15% improvement in LCP.',
        timestamp: new Date(Date.now() - 60 * 60000),
        read: true
      },
      {
        id: 'notif-005',
        type: 'alert',
        title: 'Traffic Spike Detected',
        message: 'Traffic increased by 250% in the last hour. AI resource allocator has provisioned additional capacity.',
        timestamp: new Date(Date.now() - 90 * 60000),
        read: false
      }
    ];
    
    setNotifications(sampleNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'alert': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'alert': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">AI Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.slice(0, showAll ? undefined : 5).map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border-l-4 ${getTypeColor(notification.type)} ${notification.read ? 'opacity-70' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span>{getTypeIcon(notification.type)}</span>
                  <span className="font-semibold">{notification.title}</span>
                </div>
                <p className="text-sm mb-2">{notification.message}</p>
                <div className="flex items-center space-x-4 text-xs opacity-70">
                  <span>{notification.timestamp.toLocaleTimeString()}</span>
                  {notification.action && (
                    <button className="font-medium underline">
                      {notification.action}
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="ml-3 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {notifications.length > 5 && !showAll && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all {notifications.length} notifications
          </button>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No notifications yet</p>
        </div>
      )}

      {/* AI Intelligence Note */}
      <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
        <h3 className="font-semibold text-indigo-900 text-sm mb-1">🤖 Smart Alerts</h3>
        <p className="text-xs text-indigo-800">
          AI monitors your whole platform in real-time, predicting issues before they happen and suggesting proactive solutions.
        </p>
      </div>
    </div>
  );
}