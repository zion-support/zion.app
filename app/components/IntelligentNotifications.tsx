'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Check,
  Info,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
  aiGenerated?: boolean;
}

interface IntelligentNotificationsProps {
  maxVisible?: number;
}

const demoNotifications: Notification[] = [
  {
    id: '1',
    type: 'ai',
    title: 'AI Recommendation',
    message: 'Based on your interest in AI solutions, you might like our new AI Business Advisor Pro',
    timestamp: new Date(),
    read: false,
    action: { label: 'Explore', href: '/ai-business-advisor' },
    aiGenerated: true
  },
  {
    id: '2',
    type: 'info',
    title: 'New Feature Alert',
    message: 'Voice AI Assistant is now live! Try speaking to our chat bot.',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    action: { label: 'Learn More', href: '/ai-voice-assistant' }
  },
  {
    id: '3',
    type: 'success',
    title: 'System Update',
    message: 'All AI services are running at optimal performance',
    timestamp: new Date(Date.now() - 7200000),
    read: true
  },
  {
    id: '4',
    type: 'ai',
    title: 'Trending in Your Industry',
    message: 'Machine Learning solutions are trending 40% higher this week',
    timestamp: new Date(Date.now() - 10800000),
    read: false,
    action: { label: 'View Trends', href: '/ai-ml-platform' },
    aiGenerated: true
  },
];

export default function IntelligentNotifications({ maxVisible = 5 }: IntelligentNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'ai'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const aiCount = notifications.filter(n => n.aiGenerated).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (filter === 'ai') {
      filtered = filtered.filter(n => n.aiGenerated);
    }
    return filtered.slice(0, maxVisible);
  };

  const getIcon = (type: Notification['type']) => {
    const icons = {
      info: <Info className="w-4 h-4" />,
      success: <Check className="w-4 h-4" />,
      warning: <AlertTriangle className="w-4 h-4" />,
      error: <AlertCircle className="w-4 h-4" />,
      ai: <Sparkles className="w-4 h-4" />,
    };
    return icons[type];
  };

  const getColors = (type: Notification['type']) => {
    const colors = {
      info: 'bg-blue-500/20 text-blue-400',
      success: 'bg-green-500/20 text-green-400',
      warning: 'bg-amber-500/20 text-amber-400',
      error: 'bg-red-500/20 text-red-400',
      ai: 'bg-violet-500/20 text-violet-400',
    };
    return colors[type];
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
      >
        <Bell className="w-5 h-5 text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-12 w-80 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-3 border-b border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-violet-400 hover:text-violet-300"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              {/* Filters */}
              <div className="flex gap-1">
                {(
                  [
                    { key: 'all' as const, label: 'All', count: notifications.length },
                    { key: 'unread' as const, label: 'Unread', count: unreadCount },
                    { key: 'ai' as const, label: 'AI', count: aiCount },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`flex-1 text-xs px-2 py-1 rounded-lg transition-colors ${
                      filter === f.key 
                        ? 'bg-violet-600 text-white' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {getFilteredNotifications().length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No notifications</p>
                </div>
              ) : (
                getFilteredNotifications().map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${
                      !notification.read ? 'bg-slate-800/30' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getColors(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-white text-sm font-medium">{notification.title}</h4>
                              {notification.aiGenerated && (
                                <Sparkles className="w-3 h-3 text-violet-400" />
                              )}
                            </div>
                            <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{notification.message}</p>
                          </div>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-slate-500 hover:text-slate-300 shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-slate-500 text-xs">{formatTime(notification.timestamp)}</span>
                          {notification.action && (
                            <a
                              href={notification.action.href}
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                            >
                              {notification.action.label}
                              <ChevronRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="absolute top-3 right-12 w-2 h-2 bg-violet-500 rounded-full" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-slate-700">
              <button className="w-full text-center text-xs text-slate-400 hover:text-white py-1">
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
