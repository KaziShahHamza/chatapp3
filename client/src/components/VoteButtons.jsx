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
      <button
        disabled={disabled}
        onClick={onLike}
        className={`flex items-center gap-1 px-2 py-1 border rounded
          ${myVote === 1 ? 'text-green-600 border-green-600' : ''}
        `}
      >
        👍 {likeCount}
      </button>

      <button
        disabled={disabled}
        onClick={onDislike}
        className={`flex items-center gap-1 px-2 py-1 border rounded
          ${myVote === -1 ? 'text-red-600 border-red-600' : ''}
        `}
      >
        👎 {dislikeCount}
      </button>
    </div>
  );
}
