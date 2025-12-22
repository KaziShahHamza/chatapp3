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
import VoteButtons from '../components/VoteButtons';
import { timeAgo } from '../utils/time';

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
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Post header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          {post.title}
          {post.solved && (
            <span className="text-xs text-green-600 border px-2 py-0.5 rounded">
              Solved
            </span>
          )}
        </h2>

        <p className="text-sm text-gray-600">
          <span className="capitalize">{post.category}</span> •{' '}
          <span className="font-medium">{post.department}</span> •{' '}
          <Link
            to={`/profile/${post.author._id}`}
            className="hover:underline"
          >
            {post.author.name}
          </Link>{' '}
          • {timeAgo(post.createdAt)}
        </p>
      </div>

      {/* Post body */}
      <p className="text-gray-800 leading-relaxed">
        {post.body}
      </p>

      {/* Post votes */}
      <VoteButtons
        likeCount={post.likeCount}
        dislikeCount={post.dislikeCount}
        myVote={post.myVote}
        disabled={!token}
        onLike={() => votePost(id, 1, token).then(load)}
        onDislike={() => votePost(id, -1, token).then(load)}
      />

      {/* Comments */}
      <div className="pt-6 border-t space-y-4">
        <h3 className="text-lg font-semibold">
          Comments ({post.comments.length})
        </h3>

        {post.comments.map((c) => (
          <div key={c._id} className="space-y-1 border rounded p-3">
            <p className="text-gray-800">{c.content}</p>

            <p className="text-xs text-gray-500">
              <Link
                to={`/profile/${c.author._id}`}
                className="hover:underline font-medium"
              >
                {c.author?.name}
              </Link>{' '}
              • {timeAgo(c.createdAt)}
            </p>

            <VoteButtons
              likeCount={c.likeCount}
              dislikeCount={c.dislikeCount}
              myVote={c.myVote}
              disabled={!token}
              onLike={() => voteComment(id, c._id, 1, token).then(load)}
              onDislike={() => voteComment(id, c._id, -1, token).then(load)}
            />
          </div>
        ))}
      </div>

      {/* Add comment */}
      {token && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!comment.trim()) return;
            commentPost(id, comment, token).then(() => {
              setComment('');
              load();
            });
          }}
          className="pt-4 space-y-2"
        >
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment"
            className="w-full border rounded px-3 py-2"
          />
          <button className="border rounded px-4 py-1 text-sm">
            Add Comment
          </button>
        </form>
      )}
    </div>
  );
}
