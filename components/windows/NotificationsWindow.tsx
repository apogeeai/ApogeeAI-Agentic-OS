"use client";

import { Bell, TriangleAlert as AlertTriangle, Info, CircleCheck as CheckCircle, X } from 'lucide-react';
import { useState } from 'react';

export function NotificationsWindow() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', title: 'Pipeline Stall Detected', message: 'Assembled queue has 3 items pending for >10min', time: '2m ago' },
    { id: 2, type: 'info', title: 'Approval Required', message: 'Director needs approval for task #1847', time: '5m ago' },
    { id: 3, type: 'success', title: 'Task Completed', message: 'Blog post "AI in 2026" published successfully', time: '12m ago' },
    { id: 4, type: 'warning', title: 'Watchdog Alert', message: 'GPU 3 temperature above 80°C', time: '18m ago' },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'info': return <Info className="w-5 h-5 text-blue-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-orange-100/80';
      case 'info': return 'bg-blue-100/80';
      case 'success': return 'bg-green-100/80';
      default: return 'bg-gray-100/80';
    }
  };

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
        <div className="text-sm text-gray-600">{notifications.length} unread</div>
      </div>

      <div className="space-y-3">
        {notifications.map(notification => (
          <div key={notification.id} className={`${getBgColor(notification.type)} backdrop-blur-sm rounded-lg p-4 border border-white/60 shadow-sm`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-800">{notification.title}</h3>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="flex-shrink-0 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-700 mb-1">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No notifications</p>
        </div>
      )}
    </div>
  );
}
