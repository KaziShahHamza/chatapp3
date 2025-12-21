import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Posts from './pages/Posts';
import PostDetails from './pages/PostDetails';


import { getStoredUser } from './services/auth';

export default function App() {
  const [user, setUser] = useState(() => getStoredUser());

  return (
    <BrowserRouter>
      {user && <Navbar user={user} setUser={setUser} />}

      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />

        {/* Protected */}
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={user ? <Profile user={user} /> : <Navigate to="/login" />}
        />

        <Route
          path="/chat"
          element={user ? <Chat user={user} /> : <Navigate to="/login" />}
        />

        {/* POSTS */}
        <Route
          path="/posts"
          element={user ? <Posts /> : <Navigate to="/login" />}
        />
        <Route
          path="/posts/:id"
          element={user ? <PostDetails /> : <Navigate to="/login" />}
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
