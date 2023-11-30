import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../auth/authStore";

const ProtectedRoute = () => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
