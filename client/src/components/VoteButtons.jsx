import Tooltip from './Tooltip';

export default function VoteButtons({
  likeCount,
  dislikeCount,
  myVote,
  onLike,
  onDislike,
  disabled,
}) {
  return (
    <div className="flex items-center gap-3">
      <Tooltip disabled={disabled} text="Login to vote">
        <button
          disabled={disabled}
          onClick={onLike}
          className={`flex items-center gap-1 px-2 py-1 border rounded
            ${myVote === 1 ? 'text-green-600 border-green-600' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          👍 {likeCount}
        </button>
      </Tooltip>

      <Tooltip disabled={disabled} text="Login to vote">
        <button
          disabled={disabled}
          onClick={onDislike}
          className={`flex items-center gap-1 px-2 py-1 border rounded
            ${myVote === -1 ? 'text-red-600 border-red-600' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          👎 {dislikeCount}
        </button>
      </Tooltip>
    </div>
  );
}
