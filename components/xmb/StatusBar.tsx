'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { usePortfolioStore } from '@/stores/portfolioStore';

interface BatteryLike extends EventTarget {
  level: number;
  charging: boolean;
}

/** The PSP gauge has three bars, so real percentages map onto four states. */
function barsForLevel(level: number) {
  if (level >= 0.66) return 3;
  if (level >= 0.33) return 2;
  if (level >= 0.1) return 1;
  return 0;
}

/**
 * Reads the host device's battery. The Battery Status API is Chromium-only, so
 * Safari and Firefox keep the default full gauge rather than showing nothing.
 */
function useBatteryBars() {
  const [state, setState] = useState<{ bars: number; level: number | null }>({
    bars: 3,
    level: null,
  });

  useEffect(() => {
    const getBattery = (navigator as Navigator & {
      getBattery?: () => Promise<BatteryLike>;
    }).getBattery;
    if (!getBattery) return;

    let battery: BatteryLike | undefined;
    let cancelled = false;
    const sync = () => {
      if (battery) setState({ bars: barsForLevel(battery.level), level: battery.level });
    };

    getBattery.call(navigator).then((b) => {
      if (cancelled) return;
      battery = b;
      sync();
      b.addEventListener('levelchange', sync);
      b.addEventListener('chargingchange', sync);
    });

    return () => {
      cancelled = true;
      battery?.removeEventListener('levelchange', sync);
      battery?.removeEventListener('chargingchange', sync);
    };
  }, []);

  return state;
}

const StatusBar = memo(function StatusBar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const { isMuted, toggleMute } = usePortfolioStore();
  const { bars, level } = useBatteryBars();

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
    <div className="absolute z-20 flex items-center text-white/90" style={{ top: '0.75em', right: '1em', gap: '0.75em', fontSize: '1em' }}>
      <span className="font-medium">{date}</span>
      <span className="font-medium">{time}</span>

      {/* Speaker / mute toggle */}
      <button
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        onClick={toggleMute}
        className="relative"
        style={{ width: '1.75em', height: '1.75em', WebkitTapHighlightColor: 'transparent' }}
      >
        <Image
          src={isMuted ? '/icons/speaker-muted.png' : '/icons/speaker-status.png'}
          alt={isMuted ? 'Sound muted' : 'Sound on'}
          fill
          className="object-contain opacity-90"
        />
      </button>

      {/* Battery gauge - reflects the host device where the API is available */}
      <div
        className="relative"
        style={{ width: '1.75em', height: '1.75em' }}
        title={level === null ? 'Battery' : `Battery ${Math.round(level * 100)}%`}
      >
        <Image
          src={bars === 3 ? '/icons/battery.png' : `/icons/battery-${bars}.png`}
          alt={level === null ? 'Battery' : `Battery ${Math.round(level * 100)} percent`}
          fill
          className="object-contain opacity-90"
        />
      </div>
    </div>
  );
});

export default StatusBar;
