import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, adminOnly = false, children }) {
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.is_admin) return <Navigate to="/selectproject" />;

  return children;
}

export default ProtectedRoute;
