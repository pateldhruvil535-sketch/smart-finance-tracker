import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// REQUEST
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// RESPONSE
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      console.error("API Error:", status, data);

      if (status === 401) {
        localStorage.removeItem("token");
        window.location.replace("/login");
      }

      if (status === 500) {
        alert("Server error! Please try again.");
      }
    } else {
      console.error("Network error:", error.message);
      alert("Server not reachable");
    }

    return Promise.reject(error);
  }
);

export default API;