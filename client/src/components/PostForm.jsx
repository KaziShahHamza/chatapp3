// client/src/components/PostForm.jsx
import { useState } from 'react';
import { createPost } from '../services/postApi';

export default function PostForm({ token, onPostCreated }) {
  const [form, setForm] = useState({
    title: '',
    body: '',
    category: 'general',
    department: 'CSE & CSIT',
  });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.title.length > 40) {
      return setError('Title must be at most 40 characters');
    }

    if (form.body.trim().split(/\s+/).length > 100) {
      return setError('Body must be at most 100 words');
    }

    try {
      const newPost = await createPost(form, token);
      onPostCreated(newPost);
      setForm({
        title: '',
        body: '',
        category: 'general',
        department: 'CSE & CSIT',
      });
    } catch (err) {
      setError(err.message || 'Failed to create post');
    }
  };

  return (
    <>
    {!token && (
      <p className="text-sm text-red-600 mb-2">
        Login to publish a post and interact with others.
      </p>
    )}

    <form onSubmit={submit} className="card-shell space-y-4">
      {error && (
        <p className="text-sm text-red-600">{error}</p>
        
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">Title</label>
        <input
          className="input-shell"
          placeholder="Short, clear title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="input-shell"
          rows={4}
          placeholder="Describe your issue, idea, or experience"
          value={form.body}
          onChange={(e) =>
            setForm({ ...form, body: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Category</label>
          <select
            className="input-shell"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="general">General</option>
            <option value="academic">Academic</option>
            <option value="faculty">Faculty</option>
            <option value="hostel">Hostel</option>
            <option value="transport">Transport</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Department</label>
          <select
            className="input-shell"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
          >
            <option value="CSE & CSIT">CSE & CSIT</option>
            <option value="GDM">GDM</option>
            <option value="FDT">FDT</option>
            <option value="BBA">BBA</option>
            <option value="AMMT">AMMT</option>
            <option value="ENGLISH">ENGLISH</option>
          </select>
        </div>
      </div>

      <button
        disabled={!token}
        title={!token ? 'Login to publish a post' : ''}
        className={`btn-primary text-sm w-full text-center ${!token ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Publish Post
      </button>
    </form>
    </>
  );
}
