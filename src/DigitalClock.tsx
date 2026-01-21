/**
 * Digital Clock Component
 * Displays the current time for a list of provided time zones
 */

import React, { useState, useEffect } from 'react';

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
        {timeZones.map((timeZone, index) => {
          const { zoneName, timeString } = formatTimeForZone(timeZone);
          return (
            <div key={index} className="digital-clock-card">
              <div className="timezone-name">{zoneName}</div>
              <div className="time-display">{timeString}</div>
            </div>
          );
        })}
      </div>
      <style>{`
        .digital-clock-container {
          background-color: var(--background-color);
          padding: 2rem;
          border-radius: var(--border-radius);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .digital-clock-title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
          color: var(--dark-color);
        }

        .digital-clock-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .digital-clock-card {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          padding: 1.5rem;
          border-radius: var(--border-radius);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: var(--transition);
        }

        .digital-clock-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
        }

        .timezone-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--light-color);
          margin-bottom: 0.8rem;
          text-transform: capitalize;
        }

        .time-display {
          font-size: 2rem;
          font-weight: bold;
          color: white;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
        }

        @media (max-width: 768px) {
          .digital-clock-container {
            padding: 1rem;
          }

          .digital-clock-title {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .digital-clock-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .time-display {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DigitalClock;
