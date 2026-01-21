/**
 * Digital Clock Component
 * Display current time in multiple time zones with automatic updates
 */

import React, { useState, useEffect, useMemo } from 'react';

interface DigitalClockProps {
  timeZones?: string[];
}

interface TimeZoneDisplay {
  zone: string;
  time: string;
  date: string;
}

const DigitalClock: React.FC<DigitalClockProps> = ({ 
  timeZones = ['America/New_York', 'Europe/London', 'Asia/Tokyo'] 
}) => {
  const [timeData, setTimeData] = useState<TimeZoneDisplay[]>([]);

  // Memoize formatters to avoid recreating them on every update
  const formatters = useMemo(() => {
    return timeZones.map(zone => ({
      zone,
      timeFormatter: new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }),
      dateFormatter: new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }));
  }, [timeZones]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const updatedTimeData = formatters.map(({ zone, timeFormatter, dateFormatter }) => {
        return {
          zone,
          time: timeFormatter.format(now),
          date: dateFormatter.format(now)
        };
      });

      setTimeData(updatedTimeData);
    };

    // Initial update
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, [formatters]);

  const formatZoneName = (zone: string): string => {
    return zone.replace(/_/g, ' ').replace('/', ' / ');
  };

  const styles = {
    container: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '20px',
      padding: '20px',
      justifyContent: 'center',
      alignItems: 'stretch'
    },
    clockCard: {
      background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
      color: 'white',
      borderRadius: 'var(--border-radius)',
      padding: '30px',
      minWidth: '280px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'default',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      textAlign: 'center' as const
    },
    clockCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
    },
    zoneName: {
      fontSize: '1rem',
      fontWeight: '500' as const,
      marginBottom: '15px',
      opacity: 0.9,
      textTransform: 'uppercase' as const,
      letterSpacing: '1px'
    },
    time: {
      fontSize: '3rem',
      fontWeight: 'bold' as const,
      fontFamily: 'monospace',
      marginBottom: '10px',
      letterSpacing: '2px',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
    },
    date: {
      fontSize: '1rem',
      opacity: 0.85,
      fontWeight: '300' as const
    }
  };

  return (
    <div style={styles.container}>
      {timeData.map((data) => (
        <div
          key={data.zone}
          style={styles.clockCard}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLDivElement;
            target.style.transform = styles.clockCardHover.transform;
            target.style.boxShadow = styles.clockCardHover.boxShadow;
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLDivElement;
            target.style.transform = '';
            target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
        >
          <div style={styles.zoneName}>
            {formatZoneName(data.zone)}
          </div>
          <div style={styles.time}>
            {data.time}
          </div>
          <div style={styles.date}>
            {data.date}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DigitalClock;
