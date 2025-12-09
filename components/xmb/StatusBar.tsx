'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';

const StatusBar = memo(function StatusBar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      // Format as M/D (month/day numbers only, no year)
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const dateStr = `${month}/${day}`;
      setTime(timeStr);
      setDate(dateStr);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute z-20 flex items-center text-white/90" style={{ top: '0.75em', right: '1em', gap: '1em', fontSize: '1em' }}>
      <span className="font-medium">{date}</span>
      <span className="font-medium">{time}</span>
      
      {/* Battery icon */}
      <div className="relative" style={{ width: '1.75em', height: '1.75em' }}>
        <Image
          src="/icons/battery.png"
          alt="Battery"
          fill
          className="object-contain opacity-90"
        />
      </div>
    </div>
  );
});

export default StatusBar;
