# OptiFlow Frontend Implementation Plan

**Version:** 1.0  
**Last Updated:** October 17, 2025  
**Project:** Production Order Management & Scheduling System

---

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Setup](#project-setup)
4. [Implementation Phases](#implementation-phases)
5. [API Integration](#api-integration)
6. [Deployment](#deployment)
7. [Timeline](#timeline)

---

## Overview

OptiFlow is a production order management and scheduling software system designed to improve efficiency in handling vendor orders and daily production tasks. This plan outlines the complete frontend implementation aligned with the FastAPI backend and MongoDB database.

### Design Guidelines
- **Color Theme:** Orange-brownish (Primary: #D97706, Secondary: #92400E, Accent: #FEF3C7)
- **Font:** Inter
- **Style:** Interactive, Modern, Clean

---

## Tech Stack

### Frontend
- **Framework:** React.js 18+ with TypeScript 5+
- **Build Tool:** Vite 5+
- **UI Library:** shadcn/ui (Radix UI + Tailwind CSS)
- **Calendar:** FullCalendar v6
- **State Management:** Zustand + TanStack Query
- **Form Handling:** react-hook-form + Zod
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Charts:** Recharts
- **PDF/CSV Export:** jsPDF, papaparse
- **Icons:** Lucide React

### Backend (Integration Points)
- **API:** FastAPI (Python)
- **Authentication:** JWT tokens
- **Database:** MongoDB
- **Hosting:** Render (Frontend static site, Backend service)

---

## Project Setup

### Initial Commands
```bash
# Create project
npm create vite@latest optiflow-frontend -- --template react-ts
cd optiflow-frontend

# Install dependencies
npm install react-router-dom zustand @tanstack/react-query axios zod react-hook-form @hookform/resolvers
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
npm install date-fns lucide-react recharts jspdf jspdf-autotable papaparse
npm install -D tailwindcss postcss autoprefixer @types/papaparse

# Setup Tailwind & shadcn/ui
npx tailwindcss init -p
npx shadcn-ui@latest init

# Install shadcn components
npx shadcn-ui@latest add button input card dialog select table tabs form label dropdown-menu toast calendar badge avatar separator skeleton
```

### Environment Variables
```env
# .env.development
VITE_API_BASE_URL=http://localhost:8000/api

# .env.production
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D97706",
          50: "#FEF3C7",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
};
```

---

## Implementation Phases

### **Phase 1: Foundation** (Days 1-2)

#### Tasks
1. Initialize React + TypeScript project with Vite
2. Configure Tailwind CSS with orange-brownish theme
3. Setup shadcn/ui components
4. Install Inter font
5. Create project directory structure
6. Setup ESLint, Prettier
7. Configure environment variables

#### Directory Structure
```
src/
├── components/
│   ├── ui/              # shadcn components
│   ├── layout/          # Header, Sidebar, Footer
│   ├── vendors/         # Vendor components
│   ├── orders/          # Order components
│   ├── calendar/        # Calendar components
│   ├── reports/         # Report components
│   └── common/          # Shared components
├── pages/               # Page components
├── hooks/               # Custom hooks
├── lib/
│   ├── api/            # API clients
│   ├── utils/          # Utilities
│   └── validations/    # Zod schemas
├── store/              # Zustand stores
├── types/              # TypeScript types
└── App.tsx
```

---

### **Phase 2: Authentication** (Days 3-5)

#### API Integration
**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

#### Components
1. **LoginPage** - Email/password form with validation
2. **RegisterPage** - Registration form
3. **ProtectedRoute** - Route wrapper for authentication
4. **AuthLayout** - Layout for auth pages

#### Implementation Details
```typescript
// Axios client with JWT interceptors
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth store with Zustand
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
}
```

---

### **Phase 3: Vendor Management** (Days 6-9)

#### API Integration
**Endpoints:**
- `GET /api/vendors` - List vendors (with search)
- `POST /api/vendors` - Create vendor
- `GET /api/vendors/:id` - Get vendor details
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor
- `GET /api/vendors/:id/orders` - Get vendor orders

#### Data Model
```typescript
interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Components
1. **VendorsPage** - Main vendor management page
2. **VendorList** - Data table with search/filter
3. **VendorForm** - Create/edit form (Dialog)
4. **VendorCard** - Card display
5. **VendorDetails** - Detailed view with order history
6. **DeleteVendorDialog** - Confirmation dialog

#### Features
- Search vendors by name
- CRUD operations
- View order history per vendor
- Pagination
- Empty states

---

### **Phase 4: Order Management** (Days 10-14)

#### API Integration
**Endpoints:**
- `GET /api/orders` - List orders (with filters)
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

#### Data Model
```typescript
interface Order {
  id: string;
  vendorId: string;
  vendor?: Vendor;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  instructions: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Components
1. **OrdersPage** - Main order management page
2. **DashboardStats** - Overview cards (total, pending, in progress, completed)
3. **OrderList** - Data table with filters
4. **OrderForm** - Create/edit form
5. **OrderDetails** - Detailed view
6. **OrderFilters** - Filter panel (status, vendor, date range)
7. **OrderStatusBadge** - Color-coded status badges
8. **DeleteOrderDialog** - Confirmation dialog

#### Features
- Dashboard with key metrics
- Filter by status, vendor, date range
- Search orders
- Status color coding (Pending: Yellow, In Progress: Blue, Completed: Green)
- CRUD operations
- Bulk actions
- CSV export

---

### **Phase 5: Calendar/Scheduling** (Days 15-18)

#### API Integration
**Endpoints:**
- `GET /api/orders?dateFrom=X&dateTo=Y` - Get orders for calendar
- `PUT /api/orders/:id` - Update order due date (drag & drop)

#### Components
1. **CalendarPage** - Main calendar page
2. **CalendarView** - FullCalendar component
3. **CalendarControls** - View switcher, navigation
4. **CalendarLegend** - Status color legend
5. **EventDetailsModal** - Order details on click

#### FullCalendar Configuration
```typescript
<FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  headerToolbar={{
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek'
  }}
  events={calendarEvents}
  editable={true}
  eventDrop={handleEventDrop}
  eventClick={handleEventClick}
/>
```

#### Features
- Month and week views
- Drag & drop rescheduling
- Color-coded events by status
- Click event to view details
- Filter by status/vendor
- Optimistic UI updates
- Real-time sync with backend

---

### **Phase 6: Reporting** (Days 19-21)

#### API Integration
**Endpoints:**
- `POST /api/reports/generate` - Generate report with filters

#### Data Model
```typescript
interface ReportParams {
  dateFrom: string;
  dateTo: string;
  vendorIds?: string[];
  statuses?: string[];
}

interface ReportData {
  summary: {
    totalOrders: number;
    byStatus: Record<string, number>;
    byVendor: Record<string, number>;
  };
  orders: Order[];
}
```

#### Components
1. **ReportsPage** - Main reports page
2. **ReportFilters** - Date range, vendor, status filters
3. **ReportSummary** - Key metrics cards
4. **ReportCharts** - Bar/pie charts (Recharts)
5. **ReportTable** - Detailed data table
6. **ExportButtons** - PDF/CSV export

#### Export Features
**PDF Export (jsPDF):**
```typescript
const exportPDF = (data: ReportData) => {
  const doc = new jsPDF();
  doc.text('OptiFlow Report', 14, 20);
  // Add charts and tables
  doc.save('optiflow-report.pdf');
};
```

**CSV Export (papaparse):**
```typescript
const exportCSV = (orders: Order[]) => {
  const csv = Papa.unparse(orders);
  const blob = new Blob([csv], { type: 'text/csv' });
  saveAs(blob, 'optiflow-report.csv');
};
```

---

### **Phase 7: Layout & Navigation** (Days 22-23)

#### Components
1. **MainLayout** - Main app layout with header/sidebar
2. **Header** - Logo, navigation, user menu
3. **Sidebar** - Collapsible navigation (desktop)
4. **Footer** - Copyright info
5. **MobileMenu** - Hamburger menu (mobile)

#### Navigation Structure
```
- Dashboard
- Vendors
- Orders
- Calendar
- Reports
- Profile (dropdown)
  - Settings
  - Logout
```

#### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

### **Phase 8: Polish & Testing** (Days 24-26)

#### Performance Optimization
- Code splitting with React.lazy
- Memoization (useMemo, useCallback)
- Virtual scrolling for large lists
- Image optimization
- Bundle size analysis

#### Error Handling
- Form validation with clear messages
- API error handling
- Network error recovery
- Error boundary component
- Toast notifications

#### Testing
```bash
# Unit tests (Vitest)
npm run test

# E2E tests (Playwright)
npx playwright test
```

#### Accessibility
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support
- WCAG AA compliance

---

## API Integration

### Base Configuration
```typescript
// src/lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// JWT token injection
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
    }
    return Promise.reject(error);
  }
);
```

### React Query Setup
```typescript
// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* App content */}
    </QueryClientProvider>
  );
}
```

### Custom Hooks Pattern
```typescript
// src/hooks/useOrders.ts
export const useOrders = (filters?: OrderFilters) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersApi.getAll(filters),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
```

---

## Deployment

### Build for Production
```bash
# Build
npm run build

# Preview build locally
npm run preview
```

### Render Deployment

#### 1. Create `render.yaml`
```yaml
services:
  - type: web
    name: optiflow-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_BASE_URL
        value: https://your-backend.onrender.com/api
```

#### 2. Deploy Steps
1. Push code to GitHub
2. Connect repository to Render
3. Configure environment variables
4. Deploy as static site
5. Setup custom domain (optional)

#### 3. CI/CD with GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Render
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm run test
```

---

## Timeline

### Summary (26 Working Days)
- **Phase 1:** Foundation (2 days)
- **Phase 2:** Authentication (3 days)
- **Phase 3:** Vendor Management (4 days)
- **Phase 4:** Order Management (5 days)
- **Phase 5:** Calendar/Scheduling (4 days)
- **Phase 6:** Reporting (3 days)
- **Phase 7:** Layout & Navigation (2 days)
- **Phase 8:** Polish & Testing (3 days)

### Milestones
- **Week 1:** Project setup + Authentication complete
- **Week 2:** Vendor management complete
- **Week 3:** Order management complete
- **Week 4:** Calendar + Reporting complete
- **Week 5:** Polish, testing, deployment

### Team Requirements
- 1-2 Frontend Developers
- Backend API must be ready by Day 3
- Design assets needed by Day 22

---

## Key Technical Decisions

### State Management
- **Zustand:** Global state (auth, UI preferences)
- **React Query:** Server state (caching, refetching)
- **Local State:** Component-specific data

### Form Handling
- **react-hook-form:** Form state
- **Zod:** Schema validation
- **shadcn/ui:** Form components

### Date Handling
- **date-fns:** All date operations
- **Consistent formatting:** ISO 8601 for API, localized for display

### Code Quality
- **TypeScript:** Strict mode enabled
- **ESLint:** Code linting
- **Prettier:** Code formatting
- **Vitest:** Unit testing
- **Playwright:** E2E testing

---

## Success Criteria

### Performance
- Dashboard load < 3 seconds
- API responses < 500ms
- Calendar renders 100+ events smoothly

### Usability
- Responsive on desktop/tablet/mobile
- Vendor creation workflow < 2 minutes
- Intuitive navigation

### Reliability
- 99.5% uptime
- Graceful error handling
- No data loss on network errors

### Security
- HTTPS encryption
- JWT token management
- XSS/CSRF protection
- Secure password handling

---

## Next Steps

1. Review and approve this plan
2. Setup development environment
3. Create GitHub repository
4. Initialize project with Phase 1 tasks
5. Coordinate with backend team on API contracts
6. Begin implementation

