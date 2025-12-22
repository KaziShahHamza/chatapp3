import { useNavigate } from 'react-router-dom';
import VoteButtons from './VoteButtons';
import { voteRequest } from '../services/requestApi';
import { optimisticVote } from '../hooks/useOptimisticVote';
import { timeAgo } from '../utils/time';

export default function RequestCard({ request, token, onUpdate, label }) {
  const navigate = useNavigate();

  const handleVote = async (e, value) => {
    e.stopPropagation();
    if (!token) return;

    onUpdate(prev =>
      prev.map(r => (r._id === request._id ? optimisticVote(r, value) : r))
    );

    try {
      const updated = await voteRequest(request._id, value, token);
      if (!updated?._id) return;

      onUpdate(prev =>
        prev.map(r => (r._id === updated._id ? updated : r))
      );
    } catch {}
  };

  return (
    <div
      onClick={() => navigate(`/requests/${request._id}`)}
      className="border rounded p-4 hover:bg-gray-50 cursor-pointer flex flex-col h-full transition"
    >
      {label && (
        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded mb-2 w-max">
          {label}
        </span>
      )}

      <div className="flex-1">
        <h3 className="text-lg font-semibold">{request.title}</h3>
        <p className="text-sm text-gray-600 mt-1">
          <span className="capitalize">{request.category}</span> •{' '}
          <span className="capitalize">{request.department}</span> •{' '}
          {request.author?.name} • <span>{timeAgo(request.createdAt)}</span>
        </p>

        <p className="mt-2 text-gray-800 line-clamp-3">{request.body}</p>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <VoteButtons
          likeCount={request.likeCount}
          dislikeCount={request.dislikeCount}
          myVote={request.myVote}
          disabled={!token}
          onLike={(e) => handleVote(e, 1)}
          onDislike={(e) => handleVote(e, -1)}
        />
        <span>{request.comments.length} comments</span>
      </div>

      {request.resolved && <span className="text-green-600 text-sm mt-1">Resolved</span>}
    </div>
  );
}
