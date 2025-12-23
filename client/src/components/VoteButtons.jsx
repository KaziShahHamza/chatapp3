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
            inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium shadow-sm
            transition-all duration-150 bg-white
            ${myVote === 1 ? 'bg-green-100 text-green-700 border-green-300' : 'border-gray-200 hover:bg-gray-50'}
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
            inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium shadow-sm
            transition-all duration-150 bg-white
            ${myVote === -1 ? 'bg-red-100 text-red-600 border-red-300' : 'border-gray-200 hover:bg-gray-50'}
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
