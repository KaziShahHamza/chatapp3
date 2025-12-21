// client/src/pages/PostDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchPost,
  votePost,
  commentPost,
  voteComment,
} from '../services/postApi';
import { useAuth } from '../context/AuthContext';

export default function PostDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');

  const load = async () => {
    const data = await fetchPost(id);
    setPost(data);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!post) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold">
        {post.title}
        {post.solved && (
          <span className="ml-2 text-green-600 text-sm">(Solved)</span>
        )}
      </h2>

      <div className="text-sm text-gray-600 mt-1">
        <span className="capitalize">{post.category}</span> • by{' '}
        <Link
          to={`/profile/${post.author._id}`}
          className="font-medium hover:underline"
        >
          {post.author.name}
        </Link>
      </div>

      <p className="mt-4 text-gray-800">{post.body}</p>

      {/* Post votes */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => votePost(id, 1, token).then(load)}
          className="px-2 border rounded"
        >
          ⬆
        </button>
        <span>{post.voteCount}</span>
        <button
          onClick={() => votePost(id, -1, token).then(load)}
          className="px-2 border rounded"
        >
          ⬇
        </button>
      </div>

      {/* Comments */}
      <h3 className="text-lg font-semibold mt-8">Comments</h3>

      <div className="space-y-4 mt-4">
        {post.comments.map((c) => (
          <div key={c._id} className="border-t pt-3">
            <p>{c.content}</p>

            <p className="text-sm text-gray-600">
              by{' '}
              <Link
                to={`/profile/${c.author._id}`}
                className="hover:underline"
              >
                {c.author?.name}
              </Link>
            </p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() =>
                  voteComment(id, c._id, 1, token).then(load)
                }
                className="px-2 border rounded"
              >
                ⬆
              </button>
              <span>{c.voteCount}</span>
              <button
                onClick={() =>
                  voteComment(id, c._id, -1, token).then(load)
                }
                className="px-2 border rounded"
              >
                ⬇
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add comment */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!comment.trim()) return;
          commentPost(id, comment, token).then(() => {
            setComment('');
            load();
          });
        }}
        className="mt-6"
      >
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment"
          className="w-full border rounded px-3 py-2"
        />
        <button className="mt-2 px-4 py-1 border rounded">
          Add Comment
        </button>
      </form>
    </div>
  );
}
