import { useState } from 'react';
import { createRequest } from '../services/requestApi';

export default function RequestForm({ token, onRequestCreated }) {
  const [form, setForm] = useState({
    title: '',
    body: '',
    category: 'general',
  });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) return setError('Title is required');
    if (!form.body.trim()) return setError('Body is required');

    try {
      const newRequest = await createRequest(form, token);
      onRequestCreated(newRequest);
      setForm({ title: '', body: '', category: 'general' });
    } catch (err) {
      setError(err.message || 'Failed to create request');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 border rounded p-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-1">
        <label className="text-sm font-medium">Title</label>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Short, clear title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={4}
          placeholder="Describe your question or request"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Category</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="courses">Courses</option>
          <option value="syllabus">Syllabus</option>
          <option value="exam">Exam</option>
          <option value="general">General</option>
        </select>
      </div>

      <button className="border rounded px-4 py-1 text-sm">
        Submit Request
      </button>
    </form>
  );
}
