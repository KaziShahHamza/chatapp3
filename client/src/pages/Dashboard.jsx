// client/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { fetchPosts } from '../services/postApi';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then((allPosts) => {
        const mine = allPosts.filter(
          (p) => p.author?._id === user.id
        );
        setPosts(mine);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* USER HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">
          Dashboard
        </h2>
        <p className="text-sm text-gray-500">
          Welcome back, {user.name}
        </p>
      </div>

      {/* SUMMARY */}
      <div className="flex gap-6 text-sm text-gray-600">
        <div>Posts: {posts.length}</div>
        <div>Comments: —</div>
        <div>Requests: —</div>
        <div>Events: —</div>
      </div>

      {/* USER POSTS */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">
          My Posts & Complaints
        </h3>

        {posts.length === 0 && (
          <p className="text-sm text-gray-500">
            You haven’t posted anything yet.
          </p>
        )}

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            token={token}
            onUpdate={setPosts}
          />
        ))}
      </section>

      {/* FUTURE SECTIONS */}
      <section className="text-sm text-gray-400 pt-4 border-t">
        Events and requests will appear here.
      </section>
    </div>
  );
}
