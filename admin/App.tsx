import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { PricingPage } from './pages/PricingPage';
import { ContentPage } from './pages/ContentPage';
import { MediaPage } from './pages/MediaPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuditPage } from './pages/AuditPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--cv-black)',
          color: 'var(--cv-gold)',
          fontFamily: 'Cinzel, Georgia, serif',
          letterSpacing: '0.1em',
        }}
      >
        VERIFYING VAULT CLEARANCE...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const AdminApp: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Login Route */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="content" element={<ContentPage />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="audit" element={<AuditPage />} />
            </Route>

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
