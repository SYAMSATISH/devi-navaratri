
import { useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";

const API_URL = "https://devi-navaratri.onrender.com";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      // Read response as text first.
      // This prevents "Unexpected end of JSON input"
      // when backend sends an empty/non-JSON response.
      const responseText = await response.text();

      let data = {};

      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            `Server returned an invalid response (${response.status})`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            responseText ||
            `Login failed (${response.status})`
        );
      }

      if (!data.token) {
        throw new Error(
          "Login succeeded but JWT token was not returned by the server."
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      setIsLoggedIn(true);
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setMessage(error.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return (
    <div className="app">
      <div className="login-container">
        <div className="login-card">

          <div className="logo-section">
            <h1>Devi Navaratri</h1>
            <p>Member Management System</p>
          </div>

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Login to continue
          </p>

          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;