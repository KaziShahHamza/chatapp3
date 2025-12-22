import { Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  User,
  LayoutDashboard,
  LogIn,
  LogOut,
} from 'lucide-react';
import { logout } from '../services/auth';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, setUser } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="border-b px-6 py-3 flex items-center">
      {/* Left: Brand */}
      <Link
        to="/"
        className="font-semibold text-lg tracking-tight"
      >
        CampusBoard
      </Link>

      {/* Center: Navigation */}
      <div className="absolute left-1/2 -translate-x-1/2 flex gap-6 text-lg">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/posts" className="hover:underline">
          Complaints
        </Link>
        <Link to="/requests" className="hover:underline">
          Requests
        </Link>
        <Link to="/events" className="hover:underline">
          Events
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="ml-auto flex items-center gap-4 text-sm">
        {/* Live Chat – emphasized */}
        <Link
          to="/chat"
          className="flex items-center gap-1 border rounded px-3 py-1 hover:bg-gray-50"
        >
          <MessageSquare size={16} />
          Live Chat
        </Link>

        {user ? (
          <>
            {/* User name */}
            <div className="flex items-center gap-1 text-gray-700">
              <span>Welcome, {user.name}</span>
            </div>

            {/* Dashboard */}
            <Link
              to="/dashboard"
              className="flex items-center gap-1 hover:underline"
            >
              <User size={16} />
              Dashboard
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600 hover:underline cursor-pointer"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1 hover:underline"
          >
            <LogIn size={16} />
            Login/SignUp
          </Link>
        )}
      </div>
    </nav>
  );
}
