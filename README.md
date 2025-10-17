# OptiFlow Frontend

Production Order Management & Scheduling System

## Overview

OptiFlow is a modern web application for managing vendor relationships, production orders, and scheduling tasks. Built with React, TypeScript, and a beautiful orange-brownish theme.

## Tech Stack

- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **UI Library:** shadcn/ui (Radix UI + Tailwind CSS)
- **State Management:** Zustand + TanStack Query
- **Routing:** React Router v6
- **Forms:** react-hook-form + Zod
- **HTTP Client:** Axios
- **Calendar:** FullCalendar
- **Styling:** Tailwind CSS with custom theme
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Copy `.env.example` to `.env.development` and configure:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=OptiFlow
VITE_APP_VERSION=1.0.0
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components
│   ├── vendors/         # Vendor management
│   ├── orders/          # Order management
│   ├── calendar/        # Calendar/scheduling
│   ├── reports/         # Reporting
│   ├── dashboard/       # Dashboard widgets
│   └── common/          # Shared components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── lib/
│   ├── api/            # API client & endpoints
│   ├── utils/          # Utility functions
│   └── validations/    # Zod schemas
├── store/              # Zustand stores
├── types/              # TypeScript types
└── App.tsx
```

## Features (Planned)

- ✅ **Phase 1:** Project foundation (Complete)
- 🔄 **Phase 2:** Authentication with JWT
- 🔄 **Phase 3:** Vendor management
- 🔄 **Phase 4:** Order management
- 🔄 **Phase 5:** Calendar/scheduling
- 🔄 **Phase 6:** Reporting with PDF/CSV export
- 🔄 **Phase 7:** Layout & navigation
- 🔄 **Phase 8:** Testing & optimization

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Design System

**Color Theme:** Orange-brownish
- Primary: `#D97706` (amber-600)
- Secondary: `#92400E` (amber-800)
- Accent: `#FEF3C7` (amber-50)

**Typography:** Inter font family

**Style:** Interactive, Modern, Clean

## Backend Integration

This frontend connects to a FastAPI backend with MongoDB. See `frontend-implementation-plan.md` for API endpoint specifications.

## Deployment

Configured for deployment on Render as a static site. See deployment section in the implementation plan.

## License

Proprietary
