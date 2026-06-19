import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EquipmentProvider } from './context/EquipmentContext';
import Login from './pages/Login';
import FarmerDashboard from './pages/FarmerDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import TermsAndConditions from './pages/TermsAndConditions';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'farmer' | 'owner' }> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to terms page if terms have not been accepted yet
  if (user && !user.terms_accepted) {
    return <Navigate to="/terms" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'farmer' ? '/farmer/dashboard' : '/owner/dashboard'} replace />;
  }

  return <>{children}</>;
};

const TermsRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If terms are already accepted, redirect directly to dashboard
  if (user && user.terms_accepted) {
    return <Navigate to={user.role === 'farmer' ? '/farmer/dashboard' : '/owner/dashboard'} replace />;
  }

  return <TermsAndConditions />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/terms" element={<TermsRoute />} />
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


