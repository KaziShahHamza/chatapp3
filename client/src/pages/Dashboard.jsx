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

  const [open, setOpen] = useState({
    posts: false,
    requests: false,
    events: false,
  });

  const toggle = (key) => {
    setOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (!user) return;

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-gray-500">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="space-y-4">
        {/* POSTS CARD */}
          <div
            onClick={() => toggle('posts')}
            className="cursor-pointer bg-white border rounded-lg p-4 shadow-sm hover:shadow transition border-gray-300"
          >
            <h3 className="text-lg font-medium">My Posts & Complaints</h3>
            <p className="text-sm text-gray-400 mt-1">
              Total: {posts.length}
            </p>

            {/* POSTS LIST */}
          <div
            className={`transition-all duration-300 overflow-hidden
              ${open.posts ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="space-y-4 pt-4">
              {posts.length === 0 && (
                <p className="text-sm text-gray-500">
                  You haven’t posted anything yet.
                </p>
              )}
              {posts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  token={token}
                  onUpdate={setPosts}
                />
              ))}
            </div>
          </div>
        </div>

        {/* REQUESTS CARD */}
        <div
          onClick={() => toggle('requests')}
          className="cursor-pointer bg-white border  border-gray-300 rounded-lg p-4 shadow-sm hover:shadow transition"
        >
          <h3 className="text-lg font-medium">My Requests</h3>
          <p className="text-sm text-gray-500 mt-1">
            Total: {requests.length}
          </p>

          {/* REQUESTS LIST */}
          <div
            className={`transition-all duration-300 overflow-hidden
              ${open.requests ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="space-y-4 pt-4">
              {requests.length === 0 && (
                <p className="text-sm text-gray-500">
                  You haven’t created any requests yet.
                </p>
              )}
              {requests.map(request => (
                <RequestCard
                  key={request._id}
                  request={request}
                  token={token}
                  onUpdate={setRequests}
                />
              ))}
            </div>
          </div>
        </div>

        {/* EVENTS CARD */}
        <div
          onClick={() => toggle('events')}
          className="cursor-pointer bg-white border  border-gray-300 rounded-lg p-4 shadow-sm hover:shadow transition"
        >
          <h3 className="text-lg font-medium">My Events</h3>
          <p className="text-sm text-gray-500 mt-1">
            Total: {events.length}
          </p>
          {/* EVENTS LIST */}
          <div
            className={`transition-all duration-300 overflow-hidden
              ${open.events ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="space-y-4 pt-4">
              {events.length === 0 && (
                <p className="text-sm text-gray-500">
                  You haven’t created any events yet.
                </p>
              )}
              {events.map(event => (
                <EventCard
                  key={event._id}
                  event={event}
                  token={token}
                  onUpdate={setEvents}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
