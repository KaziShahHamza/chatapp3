// client/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { fetchPosts } from '../services/postApi';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then((allPosts) => {
      const mine = allPosts.filter(
        (p) => p.author?._id === user.id
      );
      setMyPosts(mine);
    });
  }, [user]);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>
        Welcome back, <strong>{user.name}</strong>
      </p>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 20, margin: '20px 0' }}>
        <div>Posts: {myPosts.length}</div>
        <div>Comments: {/* later */} —</div>
        <div>Requests: —</div>
        <div>Events: —</div>
      </div>

      {/* User Posts */}
      <h3>My Posts</h3>

      {myPosts.length === 0 && <p>You haven’t posted yet.</p>}

      {myPosts.map((post) => (
        <div
          key={post._id}
          style={{
            border: '1px solid #ddd',
            padding: 12,
            marginBottom: 10,
            borderRadius: 6,
          }}
        >
          <h4>{post.title}</h4>
          <small>{post.category}</small>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}
