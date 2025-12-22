import { useNavigate } from 'react-router-dom';
import VoteButtons from './VoteButtons';
import { voteEvent } from '../services/eventApi';
import { optimisticVote } from '../hooks/useOptimisticVote';
import { timeAgo } from '../utils/time';

export default function EventCard({ event, token, onUpdate, label }) {
  const navigate = useNavigate();

  const handleVote = async (e, value) => {
    e.stopPropagation();
    if (!token) return;

    onUpdate(prev =>
      prev.map(ev => (ev._id === event._id ? optimisticVote(ev, value) : ev))
    );

    try {
      const updated = await voteEvent(event._id, value, token);
      if (!updated?._id) return;

      onUpdate(prev =>
        prev.map(ev => (ev._id === updated._id ? updated : ev))
      );
    } catch {}
  };

  const eventDate = new Date(event.startAt);
  const formattedDate = eventDate.toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className="border rounded p-4 hover:bg-gray-50 cursor-pointer flex flex-col max-h-full transition"
    >
      {label && (
        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded mb-2 w-max">
          {label}
        </span>
      )}

      <div className="flex-1">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {event.organizer?.name} • {event.department} • <span className="italic">{timeAgo(event.createdAt)}</span>
        </p>

        {/* Event highlights */}
        <div className="flex flex-wrap gap-2 mt-2 text-sm">
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{formattedDate.split(', ')[0]}, {formattedDate.split(', ')[1]}</span>
         
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">{event.place}</span>
        </div>

        <p className="mt-2 text-gray-800 line-clamp-3">{event.description}</p>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
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
