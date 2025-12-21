// client/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: 16,
        borderBottom: '1px solid #ddd',
      }}
    >
      {/* Left: Brand */}
      <Link to="/" style={{ fontWeight: 'bold', fontSize: 18 }}>
        CampusBoard
      </Link>

      {/* Center: Navigation */}
      <div style={{ display: 'flex', gap: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/posts">Complaints</Link>
        <Link to="/requests">Requests</Link>
        <Link to="/events">Events</Link>
      </div>

      {/* Right: User */}
      <div
        style={{
          marginLeft: 'auto',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <Link to="/chat">Live Chat</Link>
        <span>Welcome, {user?.name}</span>
        <Link to="/dashboard">Dashboard</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
