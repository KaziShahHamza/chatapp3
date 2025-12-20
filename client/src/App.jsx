// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import { getStoredUser } from './services/auth';

export default function App() {
  // Use a lazy initializer function to read from localStorage.
  // This only runs once when the component first mounts.
  const [user, setUser] = useState(() => getStoredUser());

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes: Redirect to chat if already logged in */}
        <Route 
          path="/login" 
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <Signup /> : <Navigate to="/dashboard" />} 
        />

        {/* Protected Routes: Redirect to login if not authenticated */}
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/chat"
          element={
            user ? <Chat user={user} setUser={setUser} /> : <Navigate to="/login" />
          }
        />

        {/* Fallback routing */}
        <Route path="*" element={<Navigate to={user ? "/chat" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}