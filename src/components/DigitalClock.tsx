import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white text-slate-900 px-8 py-2 sm:py-3 rounded-full font-black flex items-center justify-center gap-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-[5px] border-black text-xl sm:text-2xl transform hover:scale-105 transition-transform cursor-default min-w-[220px]">
      <div className="bg-blue-500 rounded-full p-1">
        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={3} />
      </div>
      <span className="whitespace-nowrap tracking-widest font-mono pt-1">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
      </span>
    </div>
  );
}
