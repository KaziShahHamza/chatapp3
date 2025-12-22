import { useNavigate } from 'react-router-dom';
import VoteButtons from './VoteButtons';
import { voteRequest } from '../services/requestApi';
import { optimisticVote } from '../hooks/useOptimisticVote';
import { timeAgo } from '../utils/time';

export default function RequestCard({ request, token, onUpdate }) {
  const navigate = useNavigate();

  const handleVote = async (e, value) => {
    e.stopPropagation();
    if (!token) return;

    // Optimistic update
    onUpdate(prev =>
      prev.map(r =>
        r._id === request._id ? optimisticVote(r, value) : r
      )
    );

    try {
      const updated = await voteRequest(request._id, value, token);
      if (!updated || !updated._id) return;

      onUpdate(prev =>
        prev.map(r => (r._id === updated._id ? updated : r))
      );
    } catch {
      // optional rollback
    }
  };

  return (
    <div
      onClick={() => navigate(`/requests/${request._id}`)}
      className="border rounded p-4 hover:bg-gray-50 cursor-pointer"
    >
      <div>
        <h3 className="text-lg font-semibold">{request.title}</h3>
        <p className="text-sm text-gray-600">
          <span className="capitalize">{request.category}</span> •{' '}
          <span className="capitalize">{request.department}</span> •{' '}
          {request.author?.name} • <span>{timeAgo(request.createdAt)}</span>
        </p>

        <p className="mt-2 text-gray-800 line-clamp-2">
          {request.body.substring(0, 50)}
        </p>

        <div className="mt-3 text-sm text-gray-500 flex gap-4 items-center">
          <VoteButtons
            likeCount={request.likeCount}
            dislikeCount={request.dislikeCount}
            myVote={request.myVote}
            disabled={!token}
            onLike={(e) => handleVote(e, 1)}
            onDislike={(e) => handleVote(e, -1)}
          />
          <span>{request.comments.length} comments</span>
          {request.resolved && (
            <span className="text-green-600">Resolved</span>
          )}
        </div>
      </div>
    </div>
  );
}
