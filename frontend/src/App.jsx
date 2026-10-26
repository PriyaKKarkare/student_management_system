
import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [email, setEmail] = useState("director@example.com");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [schools, setSchools] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Login API
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setToken(data.token);
      setUser(data.user);

      setMessage("Login successful!");

      // Login successful झाल्यावर Dashboard API call
      await fetchDashboard(data.token);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Protected Dashboard API
  const fetchDashboard = async (loginToken) => {
    try {
      const response = await fetch(
        `${API_URL}/api/director/dashboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Dashboard failed");
      }

      setSchools(data.schools || []);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Logout
  const handleLogout = () => {
    setToken("");
    setUser(null);
    setSchools([]);
    setPassword("");
    setMessage("You have logged out.");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>School Management System</h1>
        <p>Director Portal</p>
      </header>

      {!token ? (
        <form className="login-card" onSubmit={handleLogin}>
          <h2>Director Login</h2>

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>

          {message && <p className="message">{message}</p>}
        </form>
      ) : (
        <main className="dashboard">
          <div className="welcome">
            <div>
              <h2>Welcome, {user?.name}</h2>
              <p>Role: {user?.role}</p>
            </div>

            <button onClick={handleLogout}>Logout</button>
          </div>

          <h2>My Schools</h2>
          <p>{schools.length} schools found</p>

          {schools.length === 0 ? (
            <p>No schools found in this group.</p>
          ) : (
            <div className="school-list">
              {schools.map((school) => (
                <div className="school-card" key={school._id}>
                  <h3>{school.name}</h3>
                  <p>{school.address}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => fetchDashboard(token)}
            className="refresh-button"
          >
            Refresh Dashboard
          </button>

          {message && <p className="message">{message}</p>}
        </main>
      )}
    </div>
  );
}

export default App;
