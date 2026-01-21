import React, { useState, useEffect } from 'react';

/**
 * Props for the DigitalClock component
 */
interface DigitalClockProps {
    /**
     * Array of IANA timezone names to display
     * @default ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']
     */
    zones?: string[];
}

/**
 * Timezone display data
 */
interface TimezoneData {
    timezone: string;
    label: string;
    time: string;
    date: string;
}

/**
 * Default timezones to display
 */
const DEFAULT_TIMEZONES = [
    'UTC',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo'
];

/**
 * Formats a timezone string for display
 * @param timezone - IANA timezone name
 * @returns Human-readable timezone label
 */
const formatTimezoneLabel = (timezone: string): string => {
    return timezone.replace(/_/g, ' ').replace('/', ' - ');
};

/**
 * Validates if a timezone is supported by the browser
 * @param timezone - IANA timezone name to validate
 * @returns true if timezone is valid
 */
const isValidTimezone = (timezone: string): boolean => {
    try {
        Intl.DateTimeFormat(undefined, { timeZone: timezone });
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Gets the current time formatted for a specific timezone
 * @param timezone - IANA timezone name
 * @returns Formatted time string
 */
const getFormattedTime = (timezone: string): string => {
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        return formatter.format(now);
    } catch (error) {
        console.warn(`Invalid timezone "${timezone}", falling back to local time`, error);
        return new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }
};

/**
 * Gets the current date formatted for a specific timezone
 * @param timezone - IANA timezone name
 * @returns Formatted date string
 */
const getFormattedDate = (timezone: string): string => {
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        return formatter.format(now);
    } catch (error) {
        console.warn(`Invalid timezone "${timezone}", falling back to local date`, error);
        return new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
};

/**
 * Digital Clock Component
 * 
 * Displays the current time in multiple timezones, updating every second.
 * Uses the browser's Intl.DateTimeFormat API for timezone-aware formatting.
 * 
 * @example
 * ```tsx
 * // Use with default timezones
 * <DigitalClock />
 * 
 * // Use with custom timezones
 * <DigitalClock zones={['UTC', 'America/Los_Angeles', 'Asia/Dubai']} />
 * ```
 */
const DigitalClock: React.FC<DigitalClockProps> = ({ zones = DEFAULT_TIMEZONES }) => {
    const [timezoneData, setTimezoneData] = useState<TimezoneData[]>([]);

    /**
     * Updates timezone data for all zones
     */
    const updateTimes = () => {
        const validZones = zones.filter(tz => {
            const valid = isValidTimezone(tz);
            if (!valid) {
                console.warn(`Invalid timezone "${tz}" will be skipped`);
            }
            return valid;
        });

        if (validZones.length === 0) {
            console.error('No valid timezones provided, using defaults');
            validZones.push(...DEFAULT_TIMEZONES);
        }

        const data = validZones.map(timezone => ({
            timezone,
            label: formatTimezoneLabel(timezone),
            time: getFormattedTime(timezone),
            date: getFormattedDate(timezone)
        }));

        setTimezoneData(data);
    };

    useEffect(() => {
        // Initial update
        updateTimes();

        // Update every second
        const intervalId = setInterval(updateTimes, 1000);

        // Cleanup interval on unmount
        return () => {
            clearInterval(intervalId);
        };
    }, [zones]); // Re-run effect if zones prop changes

    return (
        <div 
            className="digital-clock-container" 
            role="timer" 
            aria-live="polite" 
            aria-atomic="true"
        >
            {timezoneData.map(({ timezone, label, time, date }) => (
                <div 
                    key={timezone} 
                    className="zone"
                    data-timezone={timezone}
                >
                    <div className="zone-label">{label}</div>
                    <div className="time">{time}</div>
                    <div className="date">{date}</div>
                </div>
            ))}
        </div>
    );
};

export default DigitalClock;
