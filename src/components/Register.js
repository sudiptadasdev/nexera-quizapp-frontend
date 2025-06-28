import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

function RegistrationForm({ darkMode }) {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();

  const validateForm = () => {
    const trimmedName = userName.trim();

    // Check if name is empty or contains only digits
    if (!trimmedName || /^\d+$/.test(trimmedName)) {
      setFormError("Full name must contain letters and cannot be only numbers.");
      return false;
    }

    // Email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userEmail)) {
      setFormError("Please enter a valid email address.");
      return false;
    }

    // Password: minimum 8 chars, one letter, one number, one special char
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(userPassword)) {
      setFormError("Password must be at least 8 characters long and include a letter, a number, and a special character.");
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) return;

    try {
      const response = await API.post("/auth/signup", {
        email: userEmail,
        full_name: userName,
        password: userPassword
      });

      if (response.status === 200 || response.status === 201) {
        navigate("/login");
      } else {
        setFormError(response.data.detail || "Registration failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response?.data?.detail) {
        setFormError(err.response.data.detail);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div
      className={`card ${darkMode ? "bg-secondary text-light" : "bg-white text-dark"} mx-auto`}
      style={{ maxWidth: '420px' }}
    >
      <div className="card-body">
        <h3 className="card-title mb-4 text-center">Create Account</h3>

        {formError && <div className="alert alert-danger">{formError}</div>}

        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
            <small className="text-muted">
              Must be 8+ characters, with letters, numbers & special characters.
            </small>
          </div>

          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <span
            className="text-primary"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/login')}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegistrationForm;
