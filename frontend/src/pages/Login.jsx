import { useState, useContext } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", { email, password });

      login(res.data); // ✅ FIXED
      navigate("/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", color: "#fff" }}>Login</h2>

        {error && <p style={{ color: "#f87171" }}>{error}</p>}

        <form onSubmit={submit}>
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />

          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ color: "#ccc", marginTop: "10px" }}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

const pageStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
};

const cardStyle = {
  background: "#111827",
  padding: "35px",
  borderRadius: "16px",
  width: "320px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #374151",
  background: "#1f2937",
  color: "#fff",
};

const btnStyle = {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(90deg, #6366f1, #4f46e5)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};