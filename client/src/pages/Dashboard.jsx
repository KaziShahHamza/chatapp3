import { logout } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <p>Welcome, {user.name}</p>

      <button onClick={() => navigate('/chat')}>
        Go to Chat
      </button>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
