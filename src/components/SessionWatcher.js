import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/authUtils';
import { Toast, ToastContainer } from 'react-bootstrap';

const SessionWatcher = () => {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);

  // 🚪 Logs user out by removing token and redirecting to login
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (!jwtToken) return;

    const tokenPayload = decodeToken(jwtToken);
    if (!tokenPayload || !tokenPayload.exp) return;

    const expirationTimeMs = tokenPayload.exp * 1000; // ⏱ JWT expiration in ms
    const currentTime = Date.now();
    const timeRemaining = expirationTimeMs - currentTime;
    const warningBufferMs = 10 * 1000; // ⏳ Show toast 10 sec before logout

    if (timeRemaining <= 0) {
      handleLogout();
      return;
    }

    // ⏰ Schedule toast and logout
    const toastTimeout = setTimeout(() => setShowWarning(true), timeRemaining - warningBufferMs);
    const logoutTimeout = setTimeout(() => handleLogout(), timeRemaining);

    return () => {
      clearTimeout(toastTimeout);
      clearTimeout(logoutTimeout);
    };
  }, [handleLogout]);

  return (
    <ToastContainer position="top-center" className="p-3">
      <Toast
        onClose={() => setShowWarning(false)}
        show={showWarning}
        bg="warning"
        delay={4000}
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">Session Expiring</strong>
        </Toast.Header>
        <Toast.Body>Your session is ending. You’ll be logged out shortly.</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default SessionWatcher;
