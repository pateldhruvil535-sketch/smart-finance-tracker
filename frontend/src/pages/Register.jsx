import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await API.post("/auth/register", { name, email, password });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2>Create Account</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={submit}>
          <input placeholder="Full Name" value={name}
            onChange={(e) => setName(e.target.value)} required style={inputStyle} />

          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />

          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

// styles same as Login
const pageStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#020617",
};

const cardStyle = {
  background: "#1e293b",
  padding: "30px",
  borderRadius: "12px",
  width: "300px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "none",
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  background: "#6366f1",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};