import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import MainLayout from '@/components/layout/MainLayout';
import PublicLayout from '@/components/layout/PublicLayout';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import ScrollToTop from '@/components/common/ScrollToTop';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const VendorsPage = lazy(() => import('@/pages/VendorsPage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component
function PageLoader() {
  return (
    <div className="container mx-auto py-8">
      <CardSkeleton />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes with Public Layout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Main App Routes - No Auth Guard */}
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/vendors" element={<VendorsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Route>
              
              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
