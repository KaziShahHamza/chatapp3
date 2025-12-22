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
import Requests from './pages/Requests';
import RequestDetails from './pages/RequestDetails';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';

import { getStoredUser } from './services/auth';

export default function App() {
  const [user, setUser] = useState(() => getStoredUser());

  return (
    <BrowserRouter>
      <Navbar />

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

        {/* Protected / public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/chat" element={<Chat user={user} />} />

        {/* Posts */}
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<PostDetails />} />

        {/* Requests */}
        <Route path="/requests" element={<Requests />} />
        <Route path="/requests/:id" element={<RequestDetails />} />

        {/* Events */}
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
