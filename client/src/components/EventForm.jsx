import { useState } from 'react';
import { createEvent } from '../services/eventApi';

export default function EventForm({ token, onEventCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    startAt: '',
    place: '',
    department: 'CSE & CSIT',
  });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.description.trim() || !form.startAt || !form.place.trim()) {
      return setError('All fields are required');
    }

    try {
      const newEvent = await createEvent(form, token);
      onEventCreated(newEvent);
      setForm({
        title: '',
        description: '',
        startAt: '',
        place: '',
        department: 'CSE & CSIT',
      });
    } catch (err) {
      setError(err.message || 'Failed to create event');
    }
  };

  return (
    <>
      {!token && (
        <p className="text-sm text-red-600 mb-2">
          Login to Create an event and interact with others.
        </p>
      )}

      <form onSubmit={submit} className="card-shell space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="space-y-1">
          <label className="text-sm font-medium">Title</label>
          <input
            className="input-shell"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Event title"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="input-shell"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Event description"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Start At</label>
            <input
              type="datetime-local"
              className="input-shell"
              value={form.startAt}
              onChange={(e) => setForm({ ...form, startAt: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Place</label>
            <input
              className="input-shell"
              value={form.place}
              onChange={(e) => setForm({ ...form, place: e.target.value })}
              placeholder="Event location"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Department</label>
          <select
            className="input-shell"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          >
            <option value="Central">Central</option>
            <option value="CSE & CSIT">CSE & CSIT</option>
            <option value="GDM">GDM</option>
            <option value="FDT">FDT</option>
            <option value="BBA">BBA</option>
            <option value="AMMT">AMMT</option>
            <option value="ENGLISH">ENGLISH</option>
          </select>
        </div>

        <button
          disabled={!token}
          title={!token ? 'Login to Create an event' : ''}
          className={`btn-primary text-sm w-full text-center ${!token ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            Create Event
        </button>
      </form>
    </>
  );
}
