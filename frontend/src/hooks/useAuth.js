import { useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";
import API from "../services/api";

export default function useAuth() {
  const { user, login, logout } = useContext(AuthContext);

  // 🔐 Login API
  const loginUser = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });

      // Save full user (token + user data)
      login(res.data);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed"
      };
    }
  };

  // 🆕 Register API
  const registerUser = async (name, email, password) => {
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password
      });

      login(res.data);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed"
      };
    }
  };

  // 🚪 Logout
  const logoutUser = () => {
    logout();
  };

  return {
    user,
    loginUser,
    registerUser,
    logoutUser
  };
}