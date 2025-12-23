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
    <nav className="bg-[#4f7baa] text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
        {/* Left: Brand */}
        <Link
          to="/"
          className="font-semibold text-xl tracking-tight hover:text-[#9acbdf] transition"
        >
          CampusBoard
        </Link>

        {/* Center: Navigation */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-[#94B4C1] transition">
            Home
          </Link>
          <Link to="/posts" className="hover:text-[#94B4C1] transition">
            Complaints
          </Link>
          <Link to="/requests" className="hover:text-[#94B4C1] transition">
            Requests
          </Link>
          <Link to="/events" className="hover:text-[#94B4C1] transition">
            Events
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="ml-auto flex items-center gap-3 text-sm">
          <Link
            to="/chat"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-white/30 hover:border-white/60 hover:bg-white/10 transition"
          >
            <MessageSquare size={16} />
            Live Chat
          </Link>

          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-1 text-white/80">
                <span>Welcome, {user.name}</span>
              </div>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 transition"
              >
                <User size={16} />
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-red-500 hover:bg-red-600 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-white text-[#213448] font-semibold hover:bg-[#94B4C1] hover:text-white transition"
            >
              <LogIn size={16} />
              Login/SignUp
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
