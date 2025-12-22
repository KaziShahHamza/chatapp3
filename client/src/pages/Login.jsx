import { useState } from 'react';
import { loginUser } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await loginUser(email, password);
      setUser(user);
      navigate('/'); // ✅ go to home
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border rounded p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">
          Login
        </h2>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full border rounded py-2 text-sm">
          Login
        </button>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="underline hover:text-black"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
