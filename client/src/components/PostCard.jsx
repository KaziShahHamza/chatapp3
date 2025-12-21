import VoteButtons from './VoteButtons';
import { votePost } from '../services/postApi';
import { optimisticVote } from '../hooks/useOptimisticVote';
import { useNavigate } from 'react-router-dom';

export default function PostCard({ post, token, onUpdate }) {
  const navigate = useNavigate();

  const handleVote = async (e, value) => {
    e.stopPropagation();
    if (!token) return;

    // optimistic (LOCAL ONLY)
    onUpdate(prev =>
      prev.map(p =>
        p._id === post._id
          ? optimisticVote(p, value)
          : p
      )
    );

    try {
        const updated = await votePost(post._id, value, token);

        if (!updated || !updated._id) return;

        onUpdate(prev =>
            prev.map(p => (p._id === updated._id ? updated : p))
        );
    } catch {
        // optional rollback
    }

  };

return (
    <div
        onClick={() => navigate(`/posts/${post._id}`)}
        className="border rounded p-4 hover:bg-gray-50 cursor-pointer"
    >
        <div className="flex gap-4">


            <div>
                <h3 className="text-lg font-medium">{post.title}</h3>
                <p className="text-sm text-gray-600">
                    {post.category} • by {post.author?.name}
                </p>

                <p className="mt-2 text-gray-800 line-clamp-2">
                    {post.body.substring(0, 50)}
                </p>

                <div className="mt-3 text-sm text-gray-500 flex gap-4 mx-auto items-center">
                    <VoteButtons
                        likeCount={post.likeCount}
                        dislikeCount={post.dislikeCount}
                        myVote={post.myVote}
                        disabled={!token}
                        onLike={(e) => handleVote(e, 1)}
                        onDislike={(e) => handleVote(e, -1)}
                    />
                    <span>{post.comments.length} comments</span>
                    {post.solved && (
                        <span className="text-green-600">Solved</span>
                    )}
                </div>
            </div>
        </div>
    </div>
);
}
