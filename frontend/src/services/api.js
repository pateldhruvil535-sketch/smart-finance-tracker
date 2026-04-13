import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000
});

// ================= REQUEST INTERCEPTOR =================
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token"); // ✅ FIXED

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      const { status } = error.response;

      // 🔥 Unauthorized
      if (status === 401) {
        localStorage.removeItem("token"); 
        window.location.href = "/login";
      }

      // 🔥 Server error
      if (status === 500) {
        console.error("Server error:", error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

export default API;