// client/src/pages/Posts.jsx
import { useEffect, useState } from 'react';
import { fetchPosts } from '../services/postApi';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { isWithinInterval, subDays } from 'date-fns';

const TIME_FILTERS = {
  all: 'All Time',
  today: 'Today',
  week: 'Past Week',
  month: 'Past Month',
};

export default function Posts() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filterTime, setFilterTime] = useState('all');

  useEffect(() => {
    fetchPosts().then(res =>
      setPosts(res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    );
  }, []);

  // Filter posts based on selected time
  const filteredPosts = posts.filter(post => {
    if (filterTime === 'all') return true;

    const now = new Date();
    let interval;

    switch (filterTime) {
      case 'today':
        interval = { start: subDays(now, 1), end: now };
        break;
      case 'week':
        interval = { start: subDays(now, 7), end: now };
        break;
      case 'month':
        interval = { start: subDays(now, 30), end: now };
        break;
      default:
        return true;
    }

    return isWithinInterval(new Date(post.createdAt), interval);
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-2">Campus Complaints & Suggestions</h2>
      <p className="text-gray-600 mb-4 text-sm">
        Share campus problems, ideas, or experiences and see what others have posted.
      </p>

      {/* Time filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(TIME_FILTERS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterTime(key)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition
              ${filterTime === key
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left: Posts */}
        <div className="space-y-4">
          {filteredPosts.length ? (
            filteredPosts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                token={token}
                onUpdate={setPosts}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No posts to display for this time filter.</p>
          )}
        </div>

        {/* Right: Post form */}
        <div>
          <PostForm
            token={token}
            onPostCreated={newPost =>
              setPosts(prev => [newPost, ...prev])
            }
          />
        </div>
      </div>
    </div>
  );
}
