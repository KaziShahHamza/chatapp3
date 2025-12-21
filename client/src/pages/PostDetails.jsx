import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchPost,
  votePost,
  commentPost,
  voteComment,
} from '../services/postApi';
import { useAuth } from '../context/AuthContext';

export default function PostDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');

  const load = async () => {
    const data = await fetchPost(id);
    setPost(data);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* TITLE */}
      <h2>
        {post.title}{' '}
        {post.solved && (
          <span style={{ color: 'green', fontSize: 14 }}>(Solved)</span>
        )}
      </h2>

      <p>{post.body}</p>

      {/* POST VOTES */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => votePost(id, 1, token).then(load)}>⬆</button>
        <strong>{post.voteCount}</strong>
        <button onClick={() => votePost(id, -1, token).then(load)}>⬇</button>
      </div>

      {/* COMMENTS */}
      <h3 style={{ marginTop: 30 }}>Comments</h3>

      {post.comments.map((c) => (
        <div
          key={c._id}
          style={{
            borderTop: '1px solid #ddd',
            padding: '10px 0',
          }}
        >
          <p>{c.content}</p>
          <small>by {c.author?.name || 'Unknown'}</small>

          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button
              onClick={() => voteComment(id, c._id, 1, token).then(load)}
            >
              ⬆
            </button>
            <span>{c.voteCount}</span>
            <button
              onClick={() => voteComment(id, c._id, -1, token).then(load)}
            >
              ⬇
            </button>
          </div>
        </div>
      ))}

      {/* ADD COMMENT */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!comment.trim()) return;

          commentPost(id, comment, token).then(() => {
            setComment('');
            load();
          });
        }}
        style={{ marginTop: 20 }}
      >
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment"
          style={{ width: '100%', padding: 8 }}
        />
        <button style={{ marginTop: 10 }}>Add Comment</button>
      </form>
    </div>
  );
}
