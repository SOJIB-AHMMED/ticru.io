/**
 * Ticru Digital Clock Widget
 * A lightweight, dependency-free JavaScript clock that displays time in multiple timezones
 * Uses Intl.DateTimeFormat for timezone-aware formatting
 */

(function() {
    'use strict';

    /**
     * Default timezones to display
     * @type {string[]}
     */
    const DEFAULT_TIMEZONES = [
        'UTC',
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo'
    ];

    /**
     * Formats a timezone string for display
     * @param {string} timezone - IANA timezone name
     * @returns {string} Human-readable timezone label
     */
    function formatTimezoneLabel(timezone) {
        // Convert timezone to readable format
        return timezone.replace(/_/g, ' ').replace('/', ' - ');
    }

    /**
     * Validates if a timezone is supported
     * @param {string} timezone - IANA timezone name to validate
     * @returns {boolean} true if timezone is valid
     */
    function isValidTimezone(timezone) {
        try {
            Intl.DateTimeFormat(undefined, { timeZone: timezone });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Gets the current time formatted for a specific timezone
     * @param {string} timezone - IANA timezone name
     * @returns {string} Formatted time string
     */
    function getFormattedTime(timezone) {
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
    }

    /**
     * Gets the current date formatted for a specific timezone
     * @param {string} timezone - IANA timezone name
     * @returns {string} Formatted date string
     */
    function getFormattedDate(timezone) {
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
    }

    /**
     * Creates the clock display HTML structure
     * @param {string[]} timezones - Array of IANA timezone names
     * @returns {string} HTML string for clock display
     */
    function createClockHTML(timezones) {
        const validTimezones = timezones.filter(tz => {
            const valid = isValidTimezone(tz);
            if (!valid) {
                console.warn(`Invalid timezone "${tz}" will be skipped`);
            }
            return valid;
        });

        // Use defaults if no valid timezones
        const finalTimezones = validTimezones.length === 0 
            ? [...DEFAULT_TIMEZONES] 
            : validTimezones;
        
        if (validTimezones.length === 0) {
            console.error('No valid timezones provided, using defaults');
        }

        const zonesHTML = finalTimezones.map(timezone => {
            const label = formatTimezoneLabel(timezone);
            const time = getFormattedTime(timezone);
            const date = getFormattedDate(timezone);
            
            return `
                <div class="zone" data-timezone="${timezone}">
                    <div class="zone-label">${label}</div>
                    <div class="time">${time}</div>
                    <div class="date">${date}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="digital-clock-container" aria-live="polite" aria-atomic="true">
                ${zonesHTML}
            </div>
        `;
    }

    /**
     * Updates all clock displays
     * @param {HTMLElement} container - Container element with clock displays
     */
    function updateClocks(container) {
        const zones = container.querySelectorAll('.zone');
        zones.forEach(zone => {
            const timezone = zone.getAttribute('data-timezone');
            const timeElement = zone.querySelector('.time');
            const dateElement = zone.querySelector('.date');
            
            if (timeElement && timezone) {
                timeElement.textContent = getFormattedTime(timezone);
            }
            if (dateElement && timezone) {
                dateElement.textContent = getFormattedDate(timezone);
            }
        });
    }

    /**
     * Initializes the digital clock widget
     * @param {string} containerId - ID of the container element
     * @param {string[]} [timezones] - Optional array of IANA timezone names
     */
    function init(containerId, timezones) {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container element with ID "${containerId}" not found`);
            return;
        }

        const zones = timezones || DEFAULT_TIMEZONES;
        
        // Create and inject the clock HTML
        container.innerHTML = createClockHTML(zones);

        // Update clocks every second
        const updateInterval = setInterval(() => {
            updateClocks(container);
        }, 1000);

        // Store interval ID for potential cleanup
        container.setAttribute('data-clock-interval', updateInterval);

        console.log('Ticru Digital Clock initialized with timezones:', zones);
    }

    /**
     * Stops the digital clock updates
     * @param {string} containerId - ID of the container element
     */
    function destroy(containerId) {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container element with ID "${containerId}" not found`);
            return;
        }

        const intervalId = container.getAttribute('data-clock-interval');
        if (intervalId) {
            clearInterval(parseInt(intervalId, 10));
            container.removeAttribute('data-clock-interval');
        }

        container.innerHTML = '';
        console.log('Ticru Digital Clock destroyed');
    }

    // Expose public API
    window.TicruDigitalClock = {
        init: init,
        destroy: destroy,
        DEFAULT_TIMEZONES: DEFAULT_TIMEZONES
    };
})();
