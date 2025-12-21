// client/src/App.jsx
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
      {<Navbar user={user} setUser={setUser} />}

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
          element={ <Home />}
        />

        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile/:id"
          element={<Profile />}
        />

        <Route
          path="/chat"
          element={<Chat user={user} />}
        />

        {/* POSTS */}
        <Route
          path="/posts"
          element={<Posts />}
        />
        <Route
          path="/posts/:id"
          element={<PostDetails />}
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
