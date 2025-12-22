// client/src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Profile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ message: 'Failed to load profile' }));
  }, [id]);

  if (!data) return <p className="p-4">Loading...</p>;

  if (data.message) {
    return <p className="p-4 text-red-500">{data.message}</p>;
  }

  const { user, posts = [] } = data;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* USER HEADER */}
      <div>
        <h2 className="text-2xl font-semibold"> Username: {user.name}</h2>
      </div>

      {/* USER POSTS / COMPLAINTS / EVENTS */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">
          Posts & Complaints
        </h3>

        {posts.length === 0 && (
          <p className="text-sm text-gray-500">
            No posts yet.
          </p>
        )}

        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            token={token}
            onUpdate={(updater) =>
              setData((prev) => ({
                ...prev,
                posts: updater(prev.posts),
              }))
            }
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
