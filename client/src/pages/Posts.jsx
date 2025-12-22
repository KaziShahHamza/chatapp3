// client/src/pages/Posts.jsx
import { useEffect, useState } from 'react';
import { fetchPosts } from '../services/postApi';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';

export default function Posts() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">
          Create complaints, issues, or suggestions
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Share campus problems, ideas, or personal experiences
        </p>
      </div>

      <PostForm
        token={token}
        onPostCreated={(newPost) =>
          setPosts((prev) => [newPost, ...prev])
        }
      />

      <div className="space-y-4">
        {posts.map((post) => (
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
