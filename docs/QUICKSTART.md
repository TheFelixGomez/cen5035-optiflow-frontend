# OptiFlow - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm package manager

## Installation

```bash
# Navigate to project directory
cd optiflow-frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure Overview

```
optiflow-frontend/
├── src/
│   ├── components/ui/      # shadcn/ui components (Button, Card, Input, etc.)
│   ├── components/*/       # Feature-specific components
│   ├── pages/              # Page components
│   ├── lib/                # Utilities, API clients, validations
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Main application component
├── public/                 # Static assets
└── Configuration files
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Environment Variables

Copy `.env.example` to `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=OptiFlow
VITE_APP_VERSION=1.0.0
```

## Design System

### Colors (Orange-Brownish Theme)
- **Primary:** `#D97706` - Main actions, links
- **Secondary:** `#92400E` - Secondary actions
- **Accent:** `#FEF3C7` - Highlights, backgrounds

### Typography
- **Font:** Inter (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700, 800

## Adding New Components

### Using shadcn/ui Components
```tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function MyComponent() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  )
}
```

### Creating Custom Components
Place in appropriate directory:
- `src/components/vendors/` - Vendor-related
- `src/components/orders/` - Order-related
- `src/components/common/` - Shared components

## Path Aliases

Use `@/` prefix for clean imports:

```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@/types/auth.types'
```

## Development Workflow

1. **Start dev server:** `npm run dev`
2. **Make changes** in `src/` directory
3. **Hot reload** updates automatically
4. **Build for production:** `npm run build`

## Next Steps

See `frontend-implementation-plan.md` for:
- Phase 2: Authentication
- Phase 3: Vendor Management
- Phase 4: Order Management
- Phase 5: Calendar/Scheduling
- Phase 6: Reporting
- Phase 7: Layout & Navigation
- Phase 8: Testing & Optimization

## Troubleshooting

### Port already in use
```bash
# Kill existing process
taskkill /F /IM node.exe

# Or change port in vite.config.ts
```

### Module not found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Restart TypeScript server in your IDE
# Or rebuild
npm run build
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Vite Documentation](https://vitejs.dev)

## Support

For issues or questions, refer to:
- `frontend-implementation-plan.md` - Detailed implementation guide
- `PHASE1-COMPLETE.md` - Phase 1 completion summary
- `README.md` - Project overview
