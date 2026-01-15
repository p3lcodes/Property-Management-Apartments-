import { useAuth } from '@/contexts/AuthContext';
import LandlordDashboard from './LandlordDashboard';
import CaretakerDashboard from './CaretakerDashboard';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'landlord') {
    return <LandlordDashboard />;
  }

  return <CaretakerDashboard />;
};

export default Dashboard;
