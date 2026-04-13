import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={container}>
      <h1 style={title}>404</h1>
      <h2 style={subtitle}>Page Not Found</h2>

      <p style={text}>
        The page you are looking for does not exist.
      </p>

      <Link to="/dashboard" style={btn}>
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;

const container = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "#020617",
  color: "#fff",
};

const title = { fontSize: "80px" };
const subtitle = { fontSize: "24px" };
const text = { marginBottom: "20px" };

const btn = {
  padding: "10px 20px",
  background: "#6366f1",
  color: "#fff",
  borderRadius: "8px",
  textDecoration: "none",
};