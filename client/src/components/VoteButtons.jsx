import { ThumbsUp, ThumbsDown } from 'lucide-react';
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
          className={`
            flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm
            transition-all duration-150
            ${myVote === 1 ? 'bg-green-50 text-green-600 border-green-500' : 'hover:bg-gray-100'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
          `}
        >
          <ThumbsUp size={16} />
          <span>{likeCount}</span>
        </button>
      </Tooltip>

      <Tooltip disabled={disabled} text="Login to vote">
        <button
          disabled={disabled}
          onClick={onDislike}
          className={`
            flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm
            transition-all duration-150
            ${myVote === -1 ? 'bg-red-50 text-red-600 border-red-500' : 'hover:bg-gray-100'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
          `}
        >
          <ThumbsDown size={16} />
          <span>{dislikeCount}</span>
        </button>
      </Tooltip>
    </div>
  );
}
