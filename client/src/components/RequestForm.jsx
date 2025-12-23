import { useState } from 'react';
import { createRequest } from '../services/requestApi';

export default function RequestForm({ token, onRequestCreated }) {
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

    if (!form.title.trim()) return setError('Title is required');
    if (!form.body.trim()) return setError('Body is required');

    try {
      const newRequest = await createRequest(form, token);
      onRequestCreated(newRequest);
      setForm({
        title: '',
        body: '',
        category: 'general',
        department: 'CSE & CSIT',
      });
    } catch (err) {
      setError(err.message || 'Failed to create request');
    }
  };

  return (
    <>
      {!token && (
        <p className="text-sm text-red-600 mb-2">
          Login to Submit a request and interact with others.
        </p>
      )}

          <form onSubmit={submit} className="card-shell space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-1">
        <label className="text-sm font-medium">Title</label>
        <input
          className="input-shell"
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
            <option value="courses">Courses</option>
            <option value="syllabus">Syllabus</option>
            <option value="exam">Exam</option>
            <option value="general">General</option>
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
        title={!token ? 'Login to Submit a request' : ''}
        className={`btn-primary text-sm w-full text-center ${!token ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Submit Request
      </button>
    </form>
    </>

  );
}
