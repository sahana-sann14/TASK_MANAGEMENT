import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useAuthContext();

  if (!auth?.token) {
    return <Navigate to="/login" />;
  }

  console.log("Protected route role:", auth?.user?.role);

  const userRole = auth.user?.role?.toLowerCase();
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
