# DigitalClock Component

A React component that displays the current time for multiple time zones.

## Usage

```tsx
import DigitalClock from './DigitalClock';

function App() {
  return (
    <DigitalClock 
      timeZones={[
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo',
        'Australia/Sydney'
      ]} 
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `timeZones` | `string[]` | Yes | Array of IANA timezone identifiers (e.g., 'America/New_York') |

## Features

- ✅ Real-time clock updates every second
- ✅ Supports multiple timezones simultaneously
- ✅ Responsive design (mobile-friendly)
- ✅ User-friendly timezone names (e.g., "New York" instead of "America/New_York")
- ✅ Error handling for invalid timezones
- ✅ Styled using existing CSS variables for consistent theming
- ✅ Hover effects for better UX

## Valid Timezone Examples

```tsx
const timeZones = [
  'America/New_York',      // Eastern Time
  'America/Chicago',       // Central Time
  'America/Los_Angeles',   // Pacific Time
  'Europe/London',         // GMT/BST
  'Europe/Paris',          // Central European Time
  'Asia/Tokyo',            // Japan Standard Time
  'Asia/Shanghai',         // China Standard Time
  'Australia/Sydney',      // Australian Eastern Time
  'Pacific/Auckland',      // New Zealand Time
];
```

For a complete list of valid IANA timezone identifiers, see:
https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

## Styling

The component uses the following CSS variables from `styles.css`:
- `--primary-color` - Primary gradient color
- `--secondary-color` - Secondary gradient color
- `--dark-color` - Title text color
- `--light-color` - Timezone name color
- `--background-color` - Container background
- `--border-radius` - Border radius for cards
- `--transition` - Transition timing

You can customize the appearance by modifying these variables in your `styles.css` file.
