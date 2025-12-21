import { useEffect, useState } from 'react';
import { fetchPosts } from '../services/postApi';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-1">Campus Feed</h2>
      <p className="text-gray-600 mb-4">
        Latest updates from across the campus
      </p>

      <div className="space-y-4">
        {posts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            token={token}
            onUpdate={setPosts}
          />
        ))}
      </div>
    </div>
  );
}
