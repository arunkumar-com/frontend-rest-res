import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Get token from localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    // Redirect to login if there's no token
    return <Navigate to="/login" replace />;
  }

  // If there is a token, render the protected component
  return children;
};

export default ProtectedRoute;
