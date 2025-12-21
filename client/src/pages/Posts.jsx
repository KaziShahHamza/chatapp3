// client/src/pages/Posts.jsx
import { useEffect, useState } from 'react';
import { fetchPosts, createPost } from '../services/postApi';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Posts() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: '',
    body: '',
    category: 'general',
  });

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const newPost = await createPost(form, token);
    setPosts([newPost, ...posts]);
    setForm({ title: '', body: '', category: 'general' });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Create Post</h2>

      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="Body"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />

        <select
          className="border px-3 py-2 rounded"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="general">General</option>
          <option value="academic">Academic</option>
          <option value="hostel">Hostel</option>
        </select>

        <button className="px-4 py-1 border rounded">
          Create
        </button>
      </form>

      <hr className="my-6" />

      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p._id} className="border rounded p-3">
            <Link
              to={`/posts/${p._id}`}
              className="font-medium hover:underline"
            >
              {p.title}
            </Link>
            <p className="text-sm text-gray-700">{p.body}</p>
            <small className="text-gray-500">{p.category}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
