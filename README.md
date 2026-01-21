# ticru.io

Modern full-stack web application with TypeScript, React, Python FastAPI backend, and PostgreSQL database.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/SOJIB-AHMMED/ticru.io.git
cd ticru.io

# Run the setup script
./setup-local.sh

# Start both frontend and backend servers
python3 ticru-cli.py run        # Starts both servers concurrently

# OR start servers separately
npm run dev                     # Frontend (port 5173)
python3 ticru-cli.py serve     # Backend API (port 8000)
```

## 📁 Project Structure

```
ticru.io/
├── src/                      # TypeScript/React source files
│   ├── 60-second-setup-wizard.ts
│   ├── campaign-manager-ui.tsx
│   ├── sentiment-analysis.ts
│   ├── integration-marketplace.tsx
│   ├── multi-mode-agent.ts
│   └── role-play-simulator.ts
├── docs/                     # Documentation
│   ├── DEPLOY-TICRU-IO.md
│   ├── TICRU-PRODUCTION-GUIDE.pdf
│   └── TICRU-COMMAND-REFERENCE.pdf
├── index.html               # Main HTML entry point
├── styles.css               # Application styles
├── app.js                   # Client-side JavaScript
├── api-server.py           # FastAPI backend server
├── BUILD-DATABASE.sql      # PostgreSQL schema
├── build-system.py         # Build automation
├── ticru-cli.py           # CLI tool
├── deploy-vercel.sh       # Deployment script
├── setup-local.sh         # Local setup script
├── package.json           # npm dependencies
├── tsconfig.json          # TypeScript config
├── vercel.json            # Vercel deployment config
├── requirements.txt       # Python dependencies
├── COMMAND-REFERENCE.md   # CLI commands reference
└── PRODUCTION-DEPLOYMENT-GUIDE.md
```

## 🛠️ Features

### Frontend
- ✨ Responsive web design
- 🎨 Modern UI with smooth animations
- 📱 Mobile-first approach
- ⚡ TypeScript for type safety
- ⚛️ React components

### Backend
- 🚀 FastAPI REST API
- 🗄️ PostgreSQL database
- 🔐 Secure authentication
- 📊 Sentiment analysis
- 🤖 AI agent with multiple modes
- 📈 Campaign management

### Deployment
- ☁️ Vercel/Netlify ready
- 🐳 Docker support
- 📦 Automated build system
- 🔄 CI/CD pipeline
- 📝 Comprehensive documentation

## 📚 Documentation

- **[Command Reference](COMMAND-REFERENCE.md)** - All CLI commands
- **[Deployment Guide](docs/DEPLOY-TICRU-IO.md)** - Quick deployment
- **[Production Guide](PRODUCTION-DEPLOYMENT-GUIDE.md)** - Full production setup

## 🔧 Development

```bash
# Start both frontend and backend servers
python3 ticru-cli.py run

# OR start servers separately:
# Frontend development
npm run dev
npm run build
npm run preview
npm run lint
npm run type-check

# Backend development
python3 ticru-cli.py serve
python3 ticru-cli.py dev

# Build & deploy
python3 build-system.py --all
./deploy-vercel.sh
```

## 🗄️ Database

```bash
# Initialize database
python3 ticru-cli.py init-db

# Direct PostgreSQL
psql $DATABASE_URL -f BUILD-DATABASE.sql
```

## 🚀 Deployment

```bash
# Vercel
./deploy-vercel.sh
vercel --prod

# Netlify
netlify deploy --prod --dir=dist
```

## 🧪 Testing

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Tests
python3 ticru-cli.py test
```

## 📄 License

MIT

## 👥 Contributing

Contributions welcome! Please read the documentation before submitting PRs.

## 📧 Support

- GitHub Issues: https://github.com/SOJIB-AHMMED/ticru.io/issues
- Documentation: See docs/ folder

## 🕐 Digital Clock

Ticru.io includes a lightweight, timezone-aware digital clock feature that can be used in both static HTML pages and React applications.

### Features

- ⏰ Real-time updates every second
- 🌍 Timezone-aware using `Intl.DateTimeFormat`
- 🎨 Responsive and customizable styling
- ♿ Accessible with ARIA live regions
- 📦 Zero dependencies
- 🔧 Works in all modern browsers

### JavaScript Widget (Static HTML)

The digital clock widget can be easily integrated into any HTML page:

#### Basic Usage

```html
<!-- Include the script -->
<script src="digital-clock.js"></script>

<!-- Add a container -->
<div id="digital-clock"></div>

<!-- Initialize with default timezones -->
<script>
  TicruDigitalClock.init('digital-clock');
</script>
```

#### Custom Timezones

```html
<script>
  // Initialize with custom timezones
  TicruDigitalClock.init('digital-clock', [
    'UTC',
    'America/Los_Angeles',
    'Europe/Paris',
    'Asia/Dubai'
  ]);
</script>
```

#### Default Timezones

The widget includes these default timezones:
- UTC
- America/New_York
- Europe/London
- Asia/Tokyo

#### API Reference

```javascript
// Initialize the clock
TicruDigitalClock.init(containerId, timezones)

// Stop and remove the clock
TicruDigitalClock.destroy(containerId)

// Access default timezones
TicruDigitalClock.DEFAULT_TIMEZONES
```

### React Component (TypeScript)

For React applications, use the TypeScript component:

#### Installation

The component is located at `src/DigitalClock.tsx`.

#### Basic Usage

```tsx
import DigitalClock from './DigitalClock';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <DigitalClock />
    </div>
  );
}
```

#### Custom Timezones

```tsx
<DigitalClock 
  zones={['UTC', 'America/Los_Angeles', 'Asia/Dubai']} 
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| zones | string[] | DEFAULT_TIMEZONES | Array of IANA timezone names |

### Styling

The digital clock uses CSS classes that can be customized:

- `.digital-clock-container` - Main container
- `.zone` - Individual timezone card
- `.zone-label` - Timezone name label
- `.time` - Time display
- `.date` - Date display

The default styles use CSS variables from `styles.css` for colors and spacing.

### Testing

A standalone test page is available for quick browser testing:

```bash
# Open in browser
open digital-clock-quicktest.html
```

The test page demonstrates:
- Default timezone display
- Automatic updates
- Responsive layout
- Accessibility features

### Browser Support

The digital clock requires:
- ES6+ JavaScript support
- `Intl.DateTimeFormat` API (available in all modern browsers)
- CSS Grid and Flexbox support

### Timezone Names

Use valid IANA timezone names (e.g., `America/New_York`, `Europe/London`, `Asia/Tokyo`). 
Invalid timezones will be logged to console and skipped gracefully.
