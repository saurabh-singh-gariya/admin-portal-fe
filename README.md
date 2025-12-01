# Admin Portal Frontend

A modern, interactive admin portal for managing users, bets, agents, and game configuration.

## Features

- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- 🔐 **Authentication** - Role-based access control (Super Admin & Agent Admin)
- 📊 **Interactive Dashboard** - Real-time statistics with charts and graphs
- 👥 **User Management** - Full CRUD operations for users
- 🎲 **Bet History** - View and filter all bets with detailed information
- 🏢 **Agent Management** - Manage agents (Super Admin only)
- ⚙️ **Game Configuration** - Configure game settings (Super Admin only)
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Zustand** - State Management
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Recharts** - Charts & Graphs
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Navigate to the admin portal directory:
```bash
cd admin-portal-fe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5174`

## Demo Credentials

The app uses dummy data for demonstration. You can login with:

- **Super Admin**: 
  - Username: `superadmin`
  - Password: (any password)

- **Agent Admin**: 
  - Username: `agentadmin`
  - Password: (any password)

## Project Structure

```
admin-portal-fe/
├── src/
│   ├── components/
│   │   ├── Layout/          # Layout components (Sidebar, Header, etc.)
│   │   └── Common/          # Reusable components (Loading, Toast, etc.)
│   ├── pages/              # Page components
│   ├── store/              # Zustand stores with dummy data
│   ├── types/              # TypeScript types and interfaces
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Features Overview

### Dashboard
- Overview statistics cards
- Revenue and bets trend charts
- Difficulty distribution pie chart
- Active users and volume metrics

### User Management
- List all users with search and filters
- View user details with statistics
- Create and edit users
- Delete users

### Bet History
- View all bets with filters
- Summary statistics (total bets, volume, revenue)
- Detailed bet information
- Filter by status, difficulty, currency, etc.

### Agent Management (Super Admin Only)
- List all agents
- View agent statistics
- Create and edit agents
- Delete agents

### Game Configuration (Super Admin Only)
- View all configuration entries
- Create and edit configurations
- Delete configurations
- Sensitive values are masked

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Notes

- All data is currently dummy/mock data for UI demonstration
- Authentication is simulated (accepts any password for demo users)
- The app is fully functional with dummy data and ready for backend integration

## Next Steps

To connect to a real backend:

1. Update API service in `src/services/api.service.ts` (create if needed)
2. Replace dummy data in stores with actual API calls
3. Configure API base URL in environment variables
4. Update authentication flow to use real JWT tokens

## License

MIT

