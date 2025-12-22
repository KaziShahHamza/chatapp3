const API = 'http://localhost:5000/api/events';

const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// Fetch all events
export const fetchEvents = async () => {
  const res = await fetch(API);
  return res.json();
};

// Fetch single event
export const fetchEvent = async (id) => {
  const res = await fetch(`${API}/${id}`);
  return res.json();
};

// Create new event
export const createEvent = async (data, token) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create event');
  }

  return res.json();
};

// Vote on event
export const voteEvent = async (id, value, token) => {
  const res = await fetch(`${API}/${id}/vote`, {
    method: 'PATCH',
    headers: authHeader(token),
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error('Vote failed');
  return res.json();
};

// Add comment
export const commentEvent = async (id, content, token) => {
  const res = await fetch(`${API}/${id}/comments`, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify({ content }),
  });
  return res.json();
};

// Vote comment
export const voteEventComment = async (eventId, commentId, value, token) => {
  const res = await fetch(`${API}/${eventId}/comments/${commentId}/vote`, {
    method: 'PATCH',
    headers: authHeader(token),
    body: JSON.stringify({ value }),
  });
  return res.json();
};
