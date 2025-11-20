# OptiFlow Frontend - Unit Testing Strategy

## Overview
This document outlines the comprehensive unit testing strategy for the OptiFlow frontend application. It identifies all testable components, utilities, hooks, and stores, along with implementation priorities and specific test scenarios.

---

## Testing Stack

### Core Tools
- **Vitest** - Fast unit test runner (Vite-native)
- **@testing-library/react** - Component testing utilities
- **@testing-library/jest-dom** - DOM matchers
- **jsdom** - Browser environment simulation

### Installation
```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

---

## Testable Units Inventory

### 1. Utility Functions (High Priority)

#### `src/lib/utils.ts`
**Function:** `cn(...inputs: ClassValue[])`
- **Purpose:** Merges Tailwind class names
- **Test Cases:**
  - Combines multiple class strings
  - Handles conditional classes
  - Resolves conflicting Tailwind classes
  - Returns empty string for no inputs

#### `src/lib/utils/exportUtils.ts`
**Functions:** `exportToPDF(data)`, `exportToCSV(data)`
- **Purpose:** Export report data to PDF/CSV formats
- **Test Cases:**
  - PDF generation with valid report data
  - CSV generation with valid report data
  - Handles empty orders array
  - Formats dates correctly
  - Truncates long instructions in PDF
  - Creates downloadable blob/file
  - Handles missing vendor data gracefully

---

### 2. Custom Hooks (High Priority)

#### `src/hooks/useDebounce.ts`
**Hook:** `useDebounce<T>(value, delay)`
- **Purpose:** Debounces rapidly changing values
- **Test Cases:**
  - Returns initial value immediately
  - Updates value after delay expires
  - Resets timer on value change
  - Cleans up timeout on unmount
  - Works with different data types (string, number, object)

#### `src/hooks/useToast.ts`
**Hook:** `useToast()`
- **Purpose:** Toast notification management
- **Test Cases:**
  - Displays toast with correct message
  - Supports different toast variants (success, error, info)
  - Dismisses toast after timeout
  - Handles multiple toasts

#### `src/hooks/useOrders.ts`
**Hook:** `useOrders()`
- **Purpose:** Fetch and manage orders via React Query
- **Test Cases:**
  - Fetches orders successfully
  - Handles loading state
  - Handles error state
  - Caches data appropriately
  - Refetches on invalidation

#### `src/hooks/useVendors.ts`
**Hook:** `useVendors()`
- **Purpose:** Fetch and manage vendors via React Query
- **Test Cases:**
  - Fetches vendors successfully
  - Handles loading state
  - Handles error state
  - Caches data appropriately

---

### 3. State Management (High Priority)

#### `src/store/authStore.ts`
**Store:** `useAuthStore`
- **Purpose:** Global authentication state with Zustand
- **Test Cases:**
  - Initial state (mock user authenticated)
  - `login()` - successful login updates state and localStorage
  - `login()` - failed login sets error state
  - `register()` - successful registration
  - `register()` - failed registration sets error
  - `logout()` - clears user and tokens
  - `clearError()` - resets error state
  - `setUser()` - updates user and isAuthenticated
  - Persists state to localStorage
  - Rehydrates state from localStorage

---

### 4. API Client (Medium Priority)

#### `src/lib/api/client.ts`
**Module:** Axios instance with interceptors
- **Test Cases:**
  - Adds Authorization header when token exists
  - Skips Authorization header when no token
  - Intercepts 401 and attempts token refresh
  - Redirects to login on refresh failure
  - Retries original request after successful refresh
  - Handles network errors gracefully

#### `src/lib/api/auth.ts`
**Functions:** `login()`, `register()`, `logout()`
- **Test Cases:**
  - Successful login returns tokens and user
  - Failed login throws error
  - Successful registration returns tokens and user
  - Logout calls correct endpoint

#### `src/lib/api/orders.ts`
**Functions:** `getOrders()`, `createOrder()`, `updateOrder()`, `deleteOrder()`
- **Test Cases:**
  - Fetches orders list
  - Creates new order with valid data
  - Updates existing order
  - Deletes order by ID
  - Handles API errors

#### `src/lib/api/vendors.ts`
**Functions:** `getVendors()`, `createVendor()`, `updateVendor()`, `deleteVendor()`
- **Test Cases:**
  - Fetches vendors list
  - Creates new vendor
  - Updates existing vendor
  - Deletes vendor by ID

---

### 5. Presentational Components (Medium Priority)

#### `src/components/orders/OrderStatusBadge.tsx`
**Component:** `<OrderStatusBadge status={status} />`
- **Test Cases:**
  - Renders "Pending" badge for `pending` status
  - Renders "In Progress" badge for `in_progress` status
  - Renders "Completed" badge for `completed` status
  - Applies correct variant styling

#### `src/components/common/EmptyState.tsx`
**Component:** `<EmptyState icon={Icon} title={...} description={...} />`
- **Test Cases:**
  - Renders icon, title, and description
  - Shows action button when `actionLabel` and `onAction` provided
  - Hides action button when props missing
  - Calls `onAction` when button clicked

#### `src/components/common/LoadingSkeleton.tsx`
**Component:** `<LoadingSkeleton />`
- **Test Cases:**
  - Renders skeleton UI
  - Displays correct number of skeleton items

#### `src/components/common/ErrorBoundary.tsx`
**Component:** `<ErrorBoundary />`
- **Test Cases:**
  - Renders children when no error
  - Catches and displays error UI when child throws
  - Logs error to console

---

### 6. UI Components (Low Priority - shadcn/ui)

These are third-party components from shadcn/ui. Testing them is optional since they're already well-tested upstream. Focus on integration tests instead.

- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/table.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/toast.tsx`
- `src/components/ui/toaster.tsx`

---

### 7. Feature Components (Medium-Low Priority)

These components integrate multiple pieces and are better suited for integration/E2E tests. Unit tests should focus on isolated logic.

#### `src/components/orders/OrderForm.tsx`
- **Test Cases:**
  - Validates required fields
  - Submits form with valid data
  - Displays validation errors
  - Populates form when editing existing order

#### `src/components/orders/OrderList.tsx`
- **Test Cases:**
  - Renders list of orders
  - Shows empty state when no orders
  - Handles loading state
  - Handles error state

#### `src/components/orders/OrderDetails.tsx`
- **Test Cases:**
  - Displays order information
  - Shows vendor details
  - Renders status badge

#### `src/components/orders/OrderFilters.tsx`
- **Test Cases:**
  - Filters by status
  - Filters by vendor
  - Filters by date range
  - Clears filters

#### `src/components/vendors/VendorForm.tsx`
- **Test Cases:**
  - Validates required fields
  - Submits form with valid data
  - Displays validation errors

#### `src/components/vendors/VendorList.tsx`
- **Test Cases:**
  - Renders list of vendors
  - Shows empty state when no vendors
  - Handles loading/error states

#### `src/components/vendors/VendorDetails.tsx`
- **Test Cases:**
  - Displays vendor information
  - Shows contact details

#### `src/components/reports/ReportFilters.tsx`
- **Test Cases:**
  - Filters by date range
  - Filters by status
  - Applies filters correctly

#### `src/components/reports/ReportSummary.tsx`
- **Test Cases:**
  - Displays summary statistics
  - Calculates totals correctly

#### `src/components/reports/ReportTable.tsx`
- **Test Cases:**
  - Renders report data in table
  - Handles empty data

#### `src/components/reports/ExportButtons.tsx`
- **Test Cases:**
  - Triggers PDF export
  - Triggers CSV export
  - Disables buttons when no data

#### `src/components/calendar/CalendarView.tsx`
- **Test Cases:**
  - Renders calendar with events
  - Handles date navigation
  - Opens event details on click

#### `src/components/calendar/CalendarFilters.tsx`
- **Test Cases:**
  - Filters events by status
  - Filters events by vendor

#### `src/components/calendar/CalendarLegend.tsx`
- **Test Cases:**
  - Displays color legend
  - Shows status labels

---

### 8. Layout Components (Low Priority)

#### `src/components/layout/MainLayout.tsx`
- **Test Cases:**
  - Renders navigation
  - Renders children content
  - Shows user info when authenticated

#### `src/components/layout/PublicLayout.tsx`
- **Test Cases:**
  - Renders public header
  - Renders children content
  - Renders footer

#### `src/components/layout/Footer.tsx`
- **Test Cases:**
  - Renders footer content
  - Displays copyright year

---

### 9. Pages (Low Priority - Better for E2E)

Pages are composition layers and are better tested with integration/E2E tests. Focus on critical user flows instead.

- `src/pages/LandingPage.tsx`
- `src/pages/DashboardPage.tsx`
- `src/pages/OrdersPage.tsx`
- `src/pages/VendorsPage.tsx`
- `src/pages/CalendarPage.tsx`
- `src/pages/ReportsPage.tsx`
- `src/pages/AboutPage.tsx`
- `src/pages/NotFoundPage.tsx`
- `src/pages/auth/LoginPage.tsx`
- `src/pages/auth/RegisterPage.tsx`

---

## Implementation Plan

### Phase 1: Foundation (Week 1)
**Goal:** Set up testing infrastructure and test critical utilities

1. **Setup**
   - Install Vitest and testing libraries
   - Create `vitest.config.ts`
   - Create `src/test/setup.ts`
   - Add test scripts to `package.json`

2. **Utilities**
   - Test `cn()` function
   - Test `exportToPDF()` and `exportToCSV()`

3. **Custom Hooks**
   - Test `useDebounce()`
   - Test `useToast()`

**Deliverable:** Working test suite with ~10-15 passing tests

---

### Phase 2: State & API (Week 2)
**Goal:** Test state management and API layer

1. **State Management**
   - Test `authStore` (all actions and persistence)

2. **API Client**
   - Test axios interceptors
   - Mock API responses
   - Test error handling

3. **API Modules**
   - Test `auth.ts` functions
   - Test `orders.ts` functions
   - Test `vendors.ts` functions

**Deliverable:** 20-30 additional tests covering state and API

---

### Phase 3: Components (Week 3)
**Goal:** Test presentational and feature components

1. **Presentational Components**
   - Test `OrderStatusBadge`
   - Test `EmptyState`
   - Test `LoadingSkeleton`
   - Test `ErrorBoundary`

2. **Feature Components (Selected)**
   - Test `OrderForm` validation logic
   - Test `OrderFilters` filtering logic
   - Test `VendorForm` validation logic
   - Test `ReportFilters` filtering logic

**Deliverable:** 15-25 component tests

---

### Phase 4: Integration & Coverage (Week 4)
**Goal:** Add integration tests and improve coverage

1. **Integration Tests**
   - Test `OrderList` with mocked API
   - Test `VendorList` with mocked API
   - Test form submission flows

2. **Coverage Analysis**
   - Run coverage report
   - Identify gaps
   - Add tests for critical uncovered paths

3. **Documentation**
   - Document testing patterns
   - Create test examples
   - Update README with testing instructions

**Deliverable:** 80%+ code coverage on critical paths

---

## Testing Patterns & Best Practices

### 1. Component Testing Pattern
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders with required props', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const { user } = render(<MyComponent onAction={mockFn} />);
    await user.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### 2. Hook Testing Pattern
```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMyHook } from '../useMyHook';

describe('useMyHook', () => {
  it('returns expected value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe('expected');
  });

  it('updates on action', async () => {
    const { result } = renderHook(() => useMyHook());
    result.current.updateValue('new');
    await waitFor(() => expect(result.current.value).toBe('new'));
  });
});
```

### 3. API Mocking Pattern
```tsx
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API calls', () => {
  it('fetches data successfully', async () => {
    mockedAxios.get.mockResolvedValue({ data: { items: [] } });
    const result = await fetchItems();
    expect(result).toEqual({ items: [] });
  });
});
```

### 4. Zustand Store Testing Pattern
```tsx
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  it('logs in user', async () => {
    const { result } = renderHook(() => useAuthStore());
    await act(async () => {
      await result.current.login({ email: 'test@test.com', password: 'pass' });
    });
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

---

## File Organization

```
src/
├── components/
│   ├── orders/
│   │   ├── __tests__/
│   │   │   ├── OrderStatusBadge.test.tsx
│   │   │   ├── OrderForm.test.tsx
│   │   │   └── OrderList.test.tsx
│   │   ├── OrderStatusBadge.tsx
│   │   ├── OrderForm.tsx
│   │   └── OrderList.tsx
│   └── ...
├── hooks/
│   ├── __tests__/
│   │   ├── useDebounce.test.ts
│   │   └── useToast.test.ts
│   ├── useDebounce.ts
│   └── useToast.ts
├── lib/
│   ├── utils/
│   │   ├── __tests__/
│   │   │   └── exportUtils.test.ts
│   │   └── exportUtils.ts
│   ├── api/
│   │   ├── __tests__/
│   │   │   ├── client.test.ts
│   │   │   ├── auth.test.ts
│   │   │   └── orders.test.ts
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   └── orders.ts
│   └── __tests__/
│       └── utils.test.ts
├── store/
│   ├── __tests__/
│   │   └── authStore.test.ts
│   └── authStore.ts
└── test/
    ├── setup.ts
    └── utils.tsx (test helpers)
```

---

## Coverage Goals

### Minimum Coverage Targets
- **Utilities:** 90%+
- **Hooks:** 85%+
- **Stores:** 85%+
- **API Layer:** 80%+
- **Components:** 70%+
- **Overall:** 75%+

### Running Coverage
```bash
npm run test:coverage
```

---

## Test Reporting & Collaboration

### Where to Record Results
- **Primary log:** Append the latest results in this document under "Testing Results Log" (see template below).
- **Pull requests:** Summarize outcomes in the PR description using the checklist format in the "Status Template" section.
- **CI artifacts:** Store generated reports (JUnit, coverage) in the CI run for traceability.

### Testing Results Log
| Date | Branch / PR | Suite / Command | Result | Coverage | Owner | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 2025-11-12 | main | `npm run test:coverage` | ✅ Pass | 85.92% statements | Team | All 103 tests passing. Phase 1-4 complete. |
| _YYYY-MM-DD_ | _feature/branch-name_ | `npm run test` | ✅ Pass / ❌ Fail | 78% statements | _Name_ | _Follow-up items, flaky tests, etc._ |

> Keep the table sorted with the most recent run on top. Link to CI runs or artifacts when available.

### Status Template for PRs
```markdown
## Testing
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] Coverage reviewed (current: XX%)
- [ ] Screenshots / recordings attached (if UI changes)

Notes:
- Highlight failing tests or skipped suites and expected fixes.
- Mention any new fixtures or environment variables introduced.
```

### Artifacts to Share
- **Vitest JSON / JUnit report:** `npm run test -- --reporter=junit --outputFile=./reports/unit-results.xml`
- **Coverage summary:** `npm run test:coverage && cat coverage/coverage-final.json`
- **Manual verification evidence:** GIFs, screenshots, or Loom recordings when UI requires visual confirmation.

---

## Continuous Integration

### Pre-commit Hook
```bash
# Run tests before commit
npm run test
```

### CI Pipeline (GitHub Actions)
```yaml
- name: Run tests
  run: npm run test:coverage
- name: Upload coverage
  uses: codecov/codecov-action@v3
```

---

## Next Steps

1. **Immediate:** Set up Vitest configuration and test infrastructure
2. **Week 1:** Implement Phase 1 tests (utilities and hooks)
3. **Week 2:** Implement Phase 2 tests (state and API)
4. **Week 3:** Implement Phase 3 tests (components)
5. **Week 4:** Integration tests and coverage improvements
6. **Ongoing:** Maintain tests as features are added

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Zustand Testing Guide](https://docs.pmnd.rs/zustand/guides/testing)
- [React Query Testing](https://tanstack.com/query/latest/docs/framework/react/guides/testing)

---

**Document Version:** 1.0  
**Last Updated:** November 11, 2025  
**Maintained By:** OptiFlow Development Team
