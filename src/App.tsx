import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EquipmentProvider } from './context/EquipmentContext';
import Login from './pages/Login';
import FarmerDashboard from './pages/FarmerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'farmer' | 'owner' }> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'farmer' ? '/farmer/dashboard' : '/owner/dashboard'} replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/farmer/dashboard"
        element={
          <ProtectedRoute requiredRole="farmer">
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute requiredRole="owner">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <EquipmentProvider>
          <AppRoutes />
        </EquipmentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

