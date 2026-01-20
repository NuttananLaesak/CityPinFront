import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ user, adminOnly = false }) {
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.is_admin) return <Navigate to="/selectproject" />;

  return <Outlet />;
}

export default ProtectedRoute;
