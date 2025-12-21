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
    <div>
      <h2>Create Post</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Body"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="general">General</option>
          <option value="academic">Academic</option>
          <option value="hostel">Hostel</option>
        </select>
        <button>Create</button>
      </form>

      <hr />

      {posts.map((p) => (
        <div key={p._id}>
          <Link to={`/posts/${p._id}`}>{p.title}</Link>
          <p>{p.body}</p>
          <small>{p.category}</small>
        </div>
      ))}
    </div>
  );
}
