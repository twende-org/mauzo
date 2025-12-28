// src/components/OfflineNotification.tsx
import { useEffect, useState } from 'react';
import { FiWifiOff } from 'react-icons/fi';

export default function OfflineNotification() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white shadow-lg rounded-lg px-4 py-3 flex items-center gap-2 z-50 animate-slide-down">
      <FiWifiOff className="w-6 h-6" />
      <span className="font-medium">No internet connection. Please check your network!</span>
    </div>
  );
}
