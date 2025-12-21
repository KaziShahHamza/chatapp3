// client/src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Profile() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}`)
      .then((res) => res.json())
      .then(setData);
  }, [id]);

  if (!data) return <p className="p-4">Loading...</p>;

  if (!data || data.message) {
    return <p className="p-4 text-red-500">Failed to load profile</p>;
  }

  const { user, posts = [], comments = [] } = data;
  console.log(data);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold">{user.name}</h2>
      <p className="text-sm text-gray-500">
        Joined {new Date(user.createdAt).toDateString()}
      </p>

      {/* POSTS */}
      <section className="mt-6">
        <h3 className="font-medium mb-2">Posts</h3>
        {posts.length === 0 && (
          <p className="text-sm text-gray-500">No posts yet.</p>
        )}
        {posts.map((p) => (
          <Link
            key={p._id}
            to={`/posts/${p._id}`}
            className="block border rounded p-2 mb-2 hover:bg-gray-50"
          >
            <p className="font-medium">{p.title}</p>
            <small className="text-gray-500">{p.category}</small>
          </Link>
        ))}
      </section>

      {/* COMMENTS */}
      <section className="mt-6">
        <h3 className="font-medium mb-2">Comments</h3>
        {comments.length === 0 && (
          <p className="text-sm text-gray-500">No comments yet.</p>
        )}
        {comments.map((c, i) => (
          <p key={i} className="text-sm border-b py-2">
            {c.content}
          </p>
        ))}
      </section>

      {/* EVENTS & REQUESTS (future-ready) */}
      <section className="mt-6 text-gray-500 text-sm">
        Events and requests will appear here.
      </section>
    </div>
  );
}
