import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useCallback } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import PrivateRoute from "./components/common/PrivateRoute";
import MainLayout from "./components/layout/MainLayout";
import CustomerView from "./pages/customer/CustomerView";
import VendorsPage from "./pages/VendorsPage";
import OrdersPage from "./pages/OrdersPage";
import CalendarPage from "./pages/CalendarPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import { Toaster } from "./components/ui/toaster";

import { useAuth } from "./stores/auth.store";

function AppRoutes() {
  const { bootstrap } = useAuth();
  const location = useLocation();

  // Wrap bootstrap so it is stable and ESLint is happy
  const doBootstrap = useCallback(() => {
    bootstrap();
  }, [bootstrap]);

  // Run on first load + every navigation (back/forward included)
  useEffect(() => {
    doBootstrap();
  }, [location.pathname, doBootstrap]);

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<CustomerView />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}