import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import QuizPage from './components/QuizPage';
import ResultsPage from './components/ResultsPage';
import HistoryPage from './components/HistoryPage';
import AppNavbar from './components/Navbar';
import Login from './components/Login';
import { jwtDecode } from "jwt-decode";
import Dashboard from './components/Dashboard';
import Register from './components/Register'; 
import SessionWatcher from './components/SessionWatcher';
import ViewProfile from './components/ViewProfile';
import EditProfile from './components/EditProfile';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';


function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
}

function PrivateRoute({ children }) {
  return isTokenValid() ? children : <Navigate to="/login" />;
}

function AppRoutes() {

  return (
    <div style={{ backgroundColor: "#e6f0ff", minHeight: "100vh" }}>
      <AppNavbar />
      <div className="container pt-4">
        <SessionWatcher />
        <Routes>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/quiz/:quizId" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
          <Route path="/results" element={<PrivateRoute><ResultsPage /></PrivateRoute>} />
          
          <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
          <Route path="/upload" element={<PrivateRoute><FileUpload /></PrivateRoute>} />
          <Route path="/profile/view" element={<PrivateRoute><ViewProfile /></PrivateRoute>} />
          <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
