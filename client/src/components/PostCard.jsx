import { useNavigate } from 'react-router-dom';
import VoteButtons from './VoteButtons';
import { votePost } from '../services/postApi';
import { optimisticVote } from '../hooks/useOptimisticVote';
import { timeAgo } from '../utils/time';

export default function PostCard({ post, token, onUpdate, label }) {
  const navigate = useNavigate();

  const handleVote = async (e, value) => {
    e.stopPropagation();
    if (!token) return;

    onUpdate(prev =>
      prev.map(p => (p._id === post._id ? optimisticVote(p, value) : p))
    );

    try {
      const updated = await votePost(post._id, value, token);
      if (!updated?._id) return;

      onUpdate(prev =>
        prev.map(p => (p._id === updated._id ? updated : p))
      );
    } catch {}
  };

  return (
    <div
      onClick={() => navigate(`/posts/${post._id}`)}
      className="card-shell cursor-pointer flex flex-col max-h-full"
    >
      {/* Label */}
      {label && (
        <span className="badge-soft bg-red-100 text-red-700 border border-red-200 mb-2 w-max">
          {label}
        </span>
      )}

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-[#213448]">{post.title}</h3>
        <p className="text-sm text-gray-600 mt-1">
          <span className="capitalize">{post.category}</span> •{' '}
          <span className="font-medium">{post.department}</span> •{' '}
          {post.author?.name} • <span>{timeAgo(post.createdAt)}</span>
        </p>

        <p className="mt-2 text-gray-700 line-clamp-3 leading-relaxed">{post.body}</p>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <VoteButtons
          likeCount={post.likeCount}
          dislikeCount={post.dislikeCount}
          myVote={post.myVote}
          disabled={!token}
          onLike={(e) => handleVote(e, 1)}
          onDislike={(e) => handleVote(e, -1)}
        />
        <span>{post.comments.length} comments</span>
      </div>

      {post.solved && (
        <span className="text-green-600 text-sm mt-1 font-medium">Solved</span>
      )}
    </div>
  );
}
