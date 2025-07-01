import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from '../api/api';

const ResetPassword = () => { 
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reset-password", { token, new_password: newPassword });
      setStatus("Password reset successfully.");
    } catch (err) {
      setStatus("Reset failed. Token may be invalid or expired.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Reset Your Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary mt-2">Reset Password</button>
      </form>
      {status && <p className="mt-3">{status}</p>}
    </div>
  );
};

export default ResetPassword;
