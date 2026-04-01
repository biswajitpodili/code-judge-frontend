
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginModal />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 