// client/src/services/postApi.js
const API = 'http://localhost:5000/api/posts';

const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const fetchPosts = async () => {
  const res = await fetch(API);
  return res.json();
};

export const fetchPost = async (id) => {
  const res = await fetch(`${API}/${id}`);
  return res.json();
};

export const createPost = async (data, token) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || 'Failed to create post');
  }

  return result;
};


export const votePost = async (id, value, token) => {
  const res = await fetch(`${API}/${id}/vote`, {
    method: 'PATCH',
    headers: authHeader(token),
    body: JSON.stringify({ value }),
  });

  if (!res.ok) {
    throw new Error('Vote failed');
  }

  return res.json(); // IMPORTANT
};


export const commentPost = async (id, content, token) => {
  const res = await fetch(`${API}/${id}/comments`, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify({ content }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || 'Failed to add comment');
  }

  return result;
};


export const voteComment = async (postId, commentId, value, token) => {
  await fetch(`${API}/${postId}/comments/${commentId}/vote`, {
    method: 'PATCH',
    headers: authHeader(token),
    body: JSON.stringify({ value }),
  });
};


export const toggleSolved = async (id, token) => {
  await fetch(`${API}/${id}/solve`, {
    method: 'PATCH',
    headers: authHeader(token),
  });
};

