'use client';
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

export default function PushNotification() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showRequest, setShowRequest] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    setPermission(Notification.permission);
    if (Notification.permission === 'default') {
      const timer = setTimeout(() => setShowRequest(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    setPermission(perm);
    setShowRequest(false);
  };

  if (!showRequest || permission !== 'default') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-4 max-w-sm">
      <div className="flex items-start gap-3">
        <Bell className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-white font-semibold text-sm">Enable Notifications</h4>
          <p className="text-slate-400 text-xs mt-1">Get updates about new AI services</p>
          <div className="flex gap-2 mt-3">
            <button onClick={requestPermission} className="flex-1 px-3 py-1.5 bg-violet-600 text-white text-xs rounded-lg">Enable</button>
            <button onClick={() => setShowRequest(false)} className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs rounded-lg">Later</button>
          </div>
        </div>
      </div>
    </div>
  );
}
