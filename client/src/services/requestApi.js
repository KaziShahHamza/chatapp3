const API = 'http://localhost:5000/api/requests';

const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const fetchRequests = async () => {
  const res = await fetch(API);
  return res.json();
};

export const fetchRequest = async (id) => {
  const res = await fetch(`${API}/${id}`);
  return res.json();
};

export const createRequest = async (data, token) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const voteRequest = async (id, value, token) => {
  const res = await fetch(`${API}/${id}/vote`, {
    method: 'PATCH',
    headers: authHeader(token),
    body: JSON.stringify({ value }),
  });

  if (!res.ok) throw new Error('Vote failed');
  return res.json();
};

export const commentRequest = async (id, content, token) => {
  await fetch(`${API}/${id}/comments`, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify({ content }),
  });
};

export const voteRequestComment = async (
  requestId,
  commentId,
  value,
  token
) => {
  await fetch(
    `${API}/${requestId}/comments/${commentId}/vote`,
    {
      method: 'PATCH',
      headers: authHeader(token),
      body: JSON.stringify({ value }),
    }
  );
};

export const toggleResolved = async (id, token) => {
  await fetch(`${API}/${id}/resolve`, {
    method: 'PATCH',
    headers: authHeader(token),
  });
};
