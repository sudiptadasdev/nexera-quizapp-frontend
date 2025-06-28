import React, { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Optionally: Call backend here
    console.log("Requesting password reset for:", email);
    setSubmitted(true);
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: '400px' }}>
      <div className="card-body">
        <h3 className="card-title mb-4">Forgot Password</h3>
        {submitted ? (
          <div className="alert alert-success">
            If the email exists, a reset link has been sent.
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
            <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
