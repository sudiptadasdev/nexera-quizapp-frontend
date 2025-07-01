import React, { useState } from 'react';
import API from '../api/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      console.error('Password reset request failed:', err);
      setError('Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: '400px' }}>
      <div className="card-body">
        <h3 className="card-title mb-4">Forgot Password</h3>
        {submitted ? (
          <div className="alert alert-success">
            A reset link has been sent to your email.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
