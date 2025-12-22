import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchRequest,
  voteRequest,
  commentRequest,
  voteRequestComment,
  toggleResolved,
} from '../services/requestApi';
import { useAuth } from '../context/AuthContext';
import VoteButtons from '../components/VoteButtons';
import { timeAgo } from '../utils/time';
import Tooltip from '../components/Tooltip';

export default function RequestDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [request, setRequest] = useState(null);
  const [comment, setComment] = useState('');

  const load = async () => {
    const data = await fetchRequest(id);
    setRequest(data);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!request) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Request header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          {request.title}
          {request.resolved && (
            <span className="text-xs text-green-600 border px-2 py-0.5 rounded">
              Resolved
            </span>
          )}
        </h2>

        <p className="text-sm text-gray-600">
          <span className="capitalize">{request.category}</span> •{' '}
          <Link
            to={`/profile/${request.author._id}`}
            className="hover:underline"
          >
            {request.author.name}
          </Link>{' '}
          • {timeAgo(request.createdAt)}
        </p>
      </div>

      {/* Request body */}
      <p className="text-gray-800 leading-relaxed">{request.body}</p>

      {/* Votes */}
      <VoteButtons
        likeCount={request.likeCount}
        dislikeCount={request.dislikeCount}
        myVote={request.myVote}
        disabled={!token}
        onLike={() => voteRequest(id, 1, token).then(load)}
        onDislike={() => voteRequest(id, -1, token).then(load)}
      />

      {/* Comments */}
      <div className="pt-6 border-t space-y-4">
        <h3 className="text-lg font-semibold">
          Comments ({request.comments.length})
        </h3>

        {request.comments.map((c) => (
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
              onLike={() =>
                voteRequestComment(id, c._id, 1, token).then(load)
              }
              onDislike={() =>
                voteRequestComment(id, c._id, -1, token).then(load)
              }
            />
          </div>
        ))}
      </div>

      {/* Add comment */}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!comment.trim()) return;
            commentRequest(id, comment, token).then(() => {
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

      {/* Toggle resolved (only author) */}
      {token && request.author._id === JSON.parse(atob(token.split('.')[1])).id && (
        <button
          onClick={() => toggleResolved(id, token).then(load)}
          className="mt-4 border rounded px-4 py-1 text-sm bg-gray-100 hover:bg-gray-200"
        >
          {request.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
        </button>
      )}
    </div>
  );
}
