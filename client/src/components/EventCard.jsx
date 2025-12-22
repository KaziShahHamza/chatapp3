import VoteButtons from './VoteButtons';
import { voteEvent } from '../services/eventApi';
import { optimisticVote } from '../hooks/useOptimisticVote';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../utils/time';

export default function EventCard({ event, token, onUpdate }) {
  const navigate = useNavigate();

  const handleVote = async (e, value) => {
    e.stopPropagation();
    if (!token) return;

    // Optimistic local update
    onUpdate(prev =>
      prev.map(ev => (ev._id === event._id ? optimisticVote(ev, value) : ev))
    );

    try {
      const updated = await voteEvent(event._id, value, token);
      onUpdate(prev => prev.map(ev => (ev._id === updated._id ? updated : ev)));
    } catch {
      // Optional rollback if needed
    }
  };

  return (
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className="border rounded p-4 hover:bg-gray-50 cursor-pointer"
    >
      <h3 className="text-lg font-semibold">{event.title}</h3>
      <p className="text-sm text-gray-600">
        {event.organizer?.name} • {event.department} • {event.place} •{' '}
        {new Date(event.startAt).toLocaleString()}
      </p>
      <p className="mt-2 text-gray-800 line-clamp-2">{event.description}</p>

      <div className="mt-3 text-sm text-gray-500 flex gap-4 items-center">
        <VoteButtons
          likeCount={event.likeCount}
          dislikeCount={event.dislikeCount}
          myVote={event.myVote}
          disabled={!token}
          onLike={(e) => handleVote(e, 1)}
          onDislike={(e) => handleVote(e, -1)}
        />
        <span>{event.comments.length} comments</span>
      </div>
    </div>
  );
}
