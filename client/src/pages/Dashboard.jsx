import { useEffect, useState } from 'react';
import { fetchPosts } from '../services/postApi';
import { fetchRequests } from '../services/requestApi';
import { fetchEvents } from '../services/eventApi';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import RequestCard from '../components/RequestCard';
import EventCard from '../components/EventCard';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([fetchPosts(), fetchRequests(), fetchEvents()])
      .then(([allPosts, allRequests, allEvents]) => {
        setPosts(allPosts.filter(p => p.author?._id === user.id));
        setRequests(allRequests.filter(r => r.author?._id === user.id));
        setEvents(allEvents.filter(e => e.organizer?._id === user.id));
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* USER HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
      </div>

      {/* SUMMARY */}
      <div className="flex gap-6 text-sm text-gray-600">
        <div>Posts: {posts.length}</div>
        <div>Requests: {requests.length}</div>
        <div>Events: {events.length}</div>
        <div>Comments: —</div>
      </div>

      {/* USER POSTS */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">My Posts & Complaints</h3>
        {posts.length === 0 && (
          <p className="text-sm text-gray-500">You haven’t posted anything yet.</p>
        )}
        {posts.map(post => (
          <PostCard key={post._id} post={post} token={token} onUpdate={setPosts} />
        ))}
      </section>

      {/* USER REQUESTS */}
      <section className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-medium">My Requests</h3>
        {requests.length === 0 && (
          <p className="text-sm text-gray-500">You haven’t created any requests yet.</p>
        )}
        {requests.map(request => (
          <RequestCard key={request._id} request={request} token={token} onUpdate={setRequests} />
        ))}
      </section>

      {/* USER EVENTS */}
      <section className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-medium">My Events</h3>
        {events.length === 0 && (
          <p className="text-sm text-gray-500">You haven’t created any events yet.</p>
        )}
        {events.map(event => (
          <EventCard key={event._id} event={event} token={token} onUpdate={setEvents} />
        ))}
      </section>
    </div>
  );
}
