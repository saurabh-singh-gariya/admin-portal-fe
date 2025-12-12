import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import UserDetailsPage from './pages/UserDetailsPage';
import UserFormPage from './pages/UserFormPage';
import BetsPage from './pages/BetsPage';
import AgentsPage from './pages/AgentsPage';
import AgentsListPage from './pages/AgentsListPage';
import AgentFormPage from './pages/AgentFormPage';
import PlayerSummaryPage from './pages/PlayerSummaryPage';
import ConfigPage from './pages/ConfigPage';
import ConfigFormPage from './pages/ConfigFormPage';
import AppLayout from './components/Layout/AppLayout';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import { AdminRole } from './types';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredRole={AdminRole.AGENT}>
              <AppLayout>
                <UsersPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/new"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UserFormPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId/:agentId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UserDetailsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bets"
          element={
            <ProtectedRoute>
              <AppLayout>
                <BetsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents/stats"
          element={
            <ProtectedRoute requiredRole={[AdminRole.SUPER_ADMIN, AdminRole.AGENT]}>
              <AppLayout>
                <AgentsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents/list"
          element={
            <ProtectedRoute requiredRole={AdminRole.SUPER_ADMIN}>
              <AppLayout>
                <AgentsListPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents/new"
          element={
            <ProtectedRoute requiredRole={AdminRole.SUPER_ADMIN}>
              <AppLayout>
                <AgentFormPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents/:agentId"
          element={
            <ProtectedRoute requiredRole={AdminRole.SUPER_ADMIN}>
              <AppLayout>
                <AgentFormPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/player-summary"
          element={
            <ProtectedRoute requiredRole={AdminRole.SUPER_ADMIN}>
              <AppLayout>
                <PlayerSummaryPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/config"
          element={
            <ProtectedRoute requiredRole={AdminRole.SUPER_ADMIN}>
              <AppLayout>
                <ConfigPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/config/new"
          element={
            <ProtectedRoute requiredRole={AdminRole.SUPER_ADMIN}>
              <AppLayout>
                <ConfigFormPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/config/:key"
          element={
            <ProtectedRoute requiredRole={AdminRole.SUPER_ADMIN}>
              <AppLayout>
                <ConfigFormPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

