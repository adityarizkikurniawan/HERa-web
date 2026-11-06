
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirect = {
      user: "/",
      admin: "/admin/dashboard",
      mentor: "/mentor",
      
    };

    return (
      <Navigate
        to={redirect[user.role] || "/login"}
        replace
      />
    );
  }

  return <Outlet />;
}
