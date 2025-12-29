import { useEffect, useState } from 'react';
import { FiWifiOff, FiCheckCircle } from 'react-icons/fi';

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
      // Tunachelewesha kuificha ili mtumiaji aone ujumbe wa mafanikio
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background Overlay - Inalinda data zisiharibike mtandao ukiwa hamna */}
      <div 
        className={`absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-opacity duration-500 ${
          isOffline ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
      />

      {/* Main Notification Card - Inakaa katikati (Center) */}
      <div className={`
        relative w-full max-w-sm overflow-hidden rounded-3xl p-8 shadow-2xl transition-all duration-500 ease-out
        ${isOffline 
          ? 'scale-100 opacity-100 bg-white border-b-8 border-red-500' 
          : 'scale-90 opacity-0 bg-primary text-white border-none'}
      `}>
        
        {/* Decorative background element */}
        {isOffline && (
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-red-50 rounded-full opacity-50" />
        )}

        <div className="relative text-center flex flex-col items-center">
          <div className={`
            w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg
            ${isOffline ? 'bg-red-50 text-red-500' : 'bg-white/20 text-white'}
          `}>
            {isOffline ? <FiWifiOff size={40} /> : <FiCheckCircle size={40} />}
          </div>

          <h3 className={`text-xl font-black mb-2 ${isOffline ? 'text-gray-800' : 'text-white'}`}>
            {isOffline ? 'Mtandao Umekatika' : 'Mtandao Umerudi!'}
          </h3>
          
          <p className={`text-base leading-relaxed ${isOffline ? 'text-gray-500' : 'text-white/90'}`}>
            {isOffline 
              ? 'Tafadhali angalia muunganisho wako wa mtandao ili uweze kuendelea na mauzo.' 
              : 'Hongera! Mfumo umerudi hewani na kila kitu kiko tayari.'}
          </p>

          {isOffline && (
             <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
                  Jaribu Tena...
                </span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
