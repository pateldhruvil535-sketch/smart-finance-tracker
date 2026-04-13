import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext); 

  // 🔒 If not logged in → redirect
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If logged in → allow access
  return children;
}

export default PrivateRoute;