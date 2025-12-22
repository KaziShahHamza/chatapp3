import { useState } from 'react';
import { signupUser } from '../services/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signupUser(name, email, password);
      navigate('/'); // ✅ go to home
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border rounded p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">
          Create Account
        </h2>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          Sign up
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="underline hover:text-black"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
