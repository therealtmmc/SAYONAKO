import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-mono font-bold flex items-center gap-2 shadow-inner border-2 border-slate-600 text-xs sm:text-sm">
      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
      <span className="whitespace-nowrap">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
      </span>
    </div>
  );
}
