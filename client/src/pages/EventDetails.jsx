import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEvent, voteEvent, commentEvent, voteEventComment } from '../services/eventApi';
import { useAuth } from '../context/AuthContext';
import VoteButtons from '../components/VoteButtons';
import { timeAgo } from '../utils/time';
import Tooltip from '../components/Tooltip';

export default function EventDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [event, setEvent] = useState(null);
  const [comment, setComment] = useState('');

  const load = async () => {
    const data = await fetchEvent(id);
    setEvent(data);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!event) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">{event.title}</h2>
        <p className="text-sm text-gray-600">
          Organizer: {event.organizer?.name} • {event.department} • {event.place} • {new Date(event.startAt).toLocaleString()}
        </p>
      </div>

      <p className="text-gray-800 leading-relaxed">{event.description}</p>

      <VoteButtons
        likeCount={event.likeCount}
        dislikeCount={event.dislikeCount}
        myVote={event.myVote}
        disabled={!token}
        onLike={() => voteEvent(id, 1, token).then(load)}
        onDislike={() => voteEvent(id, -1, token).then(load)}
      />

      <div className="pt-6 border-t space-y-4">
        <h3 className="text-lg font-semibold">Comments ({event.comments.length})</h3>

        {event.comments.map((c) => (
          <div key={c._id} className="space-y-1 border rounded p-3">
            <p className="text-gray-800">{c.content}</p>
            <p className="text-xs text-gray-500">
              <Link to={`/profile/${c.author._id}`} className="hover:underline font-medium">
                {c.author?.name}
              </Link> • {timeAgo(c.createdAt)}
            </p>
            <VoteButtons
              likeCount={c.likeCount}
              dislikeCount={c.dislikeCount}
              myVote={c.myVote}
              disabled={!token}
              onLike={() => voteEventComment(id, c._id, 1, token).then(load)}
              onDislike={() => voteEventComment(id, c._id, -1, token).then(load)}
            />
          </div>
        ))}
      </div>


        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!comment.trim()) return;
            commentEvent(id, comment, token).then(() => {
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

          <Tooltip disabled={!token} text="Login to comment">
            <button
              disabled={!token}
              className={`border rounded px-4 py-1 text-sm
                ${!token ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              Add Comment
            </button>
          </Tooltip>

        </form>

    </div>
  );
}
