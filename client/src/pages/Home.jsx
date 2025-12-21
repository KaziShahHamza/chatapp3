// client/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { fetchPosts } from '../services/postApi';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-1">Campus Feed</h2>
      <p className="text-gray-600 mb-4">
        Latest updates from across the campus
      </p>

      {/* Filters (future ready) */}
      <div className="flex gap-2 mb-6">
        {['All', 'Complaints', 'Requests', 'Events'].map((f) => (
          <button
            key={f}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
          >
            {f}
          </button>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-gray-500">No posts yet.</p>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() => navigate(`/posts/${post._id}`)}
            className="border rounded p-4 cursor-pointer hover:bg-gray-50"
          >
            <h3 className="text-lg font-medium">{post.title}</h3>

            <p className="text-sm text-gray-600">
              {post.category} • by{' '}
              <span className="font-medium">
                {post.author?.name}
              </span>
            </p>

            <p className="mt-2 text-gray-800 line-clamp-2">
              {post.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
