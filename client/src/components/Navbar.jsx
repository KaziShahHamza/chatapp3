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
    <nav style={{ display: 'flex', gap: 20, padding: 16, borderBottom: '1px solid #ddd' }}>
      <h3>CampusBoard</h3>

      <Link to="/">Home</Link>
      <Link to="/posts">Posts</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/chat">Chat</Link>

      <div style={{ marginLeft: 'auto' }}>
        <span style={{ marginRight: 10 }}>{user?.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
