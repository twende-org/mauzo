import { useEffect, useState } from 'react';
import { FiWifiOff, FiAlertCircle } from 'react-icons/fi';

export default function OfflineNotification() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setIsVisible(true);
    };
    const handleOnline = () => {
      setIsOffline(false);
      // Tunachelewesha kuificha ili mtumiaji aone imerudi online
      setTimeout(() => setIsVisible(false), 3000);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !isVisible) return null;

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md transition-all duration-500 ease-in-out ${
      isOffline ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
    }`}>
      <div className={`
        relative overflow-hidden rounded-2xl p-4 shadow-2xl border backdrop-blur-md
        ${isOffline 
          ? 'bg-white/90 border-red-100' 
          : 'bg-primary/90 border-primary/20 text-white'}
      `}>
        {/* Animated Background Pulse for attention */}
        {isOffline && (
          <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
        )}

        <div className="relative flex items-center gap-4">
          <div className={`
            flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
            ${isOffline ? 'bg-red-100 text-red-600' : 'bg-white text-primary'}
          `}>
            {isOffline ? <FiWifiOff size={24} /> : <FiAlertCircle size={24} />}
          </div>

          <div className="flex-1">
            <h4 className={`text-sm font-bold uppercase tracking-wider ${isOffline ? 'text-red-600' : 'text-white'}`}>
              {isOffline ? 'Mtandao Umekatika' : 'Mtandao Umerudi'}
            </h4>
            <p className={`text-sm leading-tight ${isOffline ? 'text-gray-600' : 'text-white/90'}`}>
              {isOffline 
                ? 'Huwezi kufanya mauzo ya mtandaoni kwa sasa. Angalia data au Wi-Fi.' 
                : 'Mfumo umerudi hewani. Unaweza kuendelea.'}
            </p>
          </div>

          {isOffline && (
            <div className="flex flex-col items-center">
               <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
