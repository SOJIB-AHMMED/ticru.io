/**
 * Digital Clock Component
 * Displays the current time for a list of provided time zones
 */

import React, { useState, useEffect } from 'react';
import './DigitalClock.css';

interface DigitalClockProps {
  timeZones: string[];
}

const DigitalClock: React.FC<DigitalClockProps> = ({ timeZones }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    // Set up a timer that updates the state every second
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the timer on component unmount
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formatTimeForZone = (timeZone: string): { zoneName: string; timeString: string } => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      const timeString = formatter.format(currentTime);
      
      return {
        zoneName: timeZone,
        timeString,
      };
    } catch (error) {
      // Handle invalid timezone
      return {
        zoneName: timeZone,
        timeString: 'Invalid Timezone',
      };
    }
  };

  return (
    <div className="digital-clock-container">
      <h2 className="digital-clock-title">World Clock</h2>
      <div className="digital-clock-grid">
        {timeZones.map((timeZone) => {
          const { zoneName, timeString } = formatTimeForZone(timeZone);
          return (
            <div key={timeZone} className="digital-clock-card">
              <div className="timezone-name">{zoneName}</div>
              <div className="time-display">{timeString}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DigitalClock;
