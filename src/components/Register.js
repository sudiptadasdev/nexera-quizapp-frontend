import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

function RegistrationForm({ darkMode }) {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [formError, setFormError] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$/.test(userName.trim())) {
      newErrors.userName = "Must be Alphabet or Alphanumeric characters .";
    }

    const acceptedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'uta.com'];
    const emailParts = userEmail.split('@');
    if (
      emailParts.length !== 2 ||
      !acceptedDomains.includes(emailParts[1].toLowerCase())
    ) {
      newErrors.userEmail = "Enter valid email address.";
    }

    if (userPassword.length < 8) {
      newErrors.userPassword = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setErrors({});

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

      if (err.response?.status === 400 && err.response?.data?.detail) {
        if (err.response.data.detail === "Email already registered.") {
          setFormError("This email is already registered. Try logging in instead.");
        } else {
          setFormError(err.response.data.detail);
        }
      } else if (err.response?.status === 422 && Array.isArray(err.response?.data?.detail)) {
        const msg = err.response.data.detail[0]?.msg || "Invalid input.";
        setFormError(msg);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className={`card ${darkMode ? "bg-secondary text-light" : "bg-white text-dark"} mx-auto`} style={{ maxWidth: '420px' }}>
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
            {errors.userName && <small className="text-danger d-block">{errors.userName}</small>}
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
            {errors.userEmail && <small className="text-danger d-block">{errors.userEmail}</small>}
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
            {errors.userPassword && <small className="text-danger d-block">{errors.userPassword}</small>}
          </div>

          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegistrationForm;