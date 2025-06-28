// src/components/UserLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

function UserLogin({ darkMode }) {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();

  // Handle form submission
  const attemptLogin = async (event) => {
    event.preventDefault();

    const credentials = new URLSearchParams();
    credentials.append('username', userEmail);
    credentials.append('password', userPassword);

    try {
      const res = await API.post("/auth/login", credentials, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      const { access_token } = res.data;

      // Store token in local storage
      localStorage.setItem("token", access_token);

      // Navigate to dashboard/home
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid email or password.");
    }
  };

  return (
    <div
      className={`card ${darkMode ? "bg-dark text-light" : "bg-light text-dark"} mx-auto`}
      style={{ maxWidth: '400px' }}
    >
      <div className="card-body">
        <h3 className="card-title mb-4">Sign In</h3>

        {loginError && <div className="alert alert-danger">{loginError}</div>}

        <form onSubmit={attemptLogin}>
          <div className="mb-3">
            <label htmlFor="emailInput">Email</label>
            <input
              id="emailInput"
              type="email"
              className="form-control"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="passwordInput">Password</label>
            <input
              id="passwordInput"
              type="password"
              className="form-control"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
            <div className="text-end mt-1">
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => navigate("/forgot-password")}
                style={{ fontSize: "0.9rem" }}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
