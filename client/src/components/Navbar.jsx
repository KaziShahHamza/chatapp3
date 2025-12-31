import { NavLink, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  User,
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

  const navLinkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? 'text-white border-b-2 border-white pb-0.5'
        : 'hover:text-[#94B4C1]'
    }`;

  return (
    <nav className="bg-[#4f7baa] text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">

        {/* Left: Brand */}
        <NavLink
          to="/"
          end
          className="font-semibold text-xl tracking-tight hover:text-[#9acbdf] transition"
        >
          CampusBoard
        </NavLink>

        {/* Center: Navigation */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/posts" className={navLinkClass}>
            Complaints
          </NavLink>
          <NavLink to="/requests" className={navLinkClass}>
            Requests
          </NavLink>
          <NavLink to="/events" className={navLinkClass}>
            Events
          </NavLink>
        </div>

        {/* Right: Actions */}
        <div className="ml-auto flex items-center gap-3 text-sm">

          {/* Chat */}
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `inline-flex items-center gap-1.5 px-3 py-2 rounded-full border transition
              ${
                isActive
                  ? 'border-white bg-white/15'
                  : 'border-white/30 hover:border-white/60 hover:bg-white/10'
              }`
            }
          >
            <MessageSquare size={16} />
            Live Chat
          </NavLink>

          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-1 text-white/80">
                <span>Welcome, {user.name}</span>
              </div>

              {/* Dashboard */}
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1 px-3 py-2 rounded-full transition
                  ${
                    isActive
                      ? 'bg-white/20'
                      : 'bg-white/10 hover:bg-white/15'
                  }`
                }
              >
                <User size={16} />
                Dashboard
              </NavLink>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-red-500 hover:bg-red-600 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `inline-flex items-center gap-1 px-3 py-2 rounded-full font-semibold transition
                ${
                  isActive
                    ? 'bg-[#94B4C1] text-white'
                    : 'bg-[#6ea5bb] text-[#213448] hover:bg-[#94B4C1] hover:text-white'
                }`
              }
            >
              <LogIn size={16} />
              Login / Sign Up
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
