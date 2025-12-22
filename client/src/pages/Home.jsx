import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import EventCard from '../components/EventCard';
import RequestCard from '../components/RequestCard';
import { fetchPosts } from '../services/postApi';
import { fetchRequests } from '../services/requestApi';
import { fetchEvents } from '../services/eventApi';
import { isWithinInterval, subDays } from 'date-fns';

const TIME_FILTERS = {
  all: 'All Time',
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
};

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem('token');

  const [filterCategory, setFilterCategory] = useState('all'); // all / posts / requests / events
  const [filterTime, setFilterTime] = useState('all'); // all / today / week / month

  useEffect(() => {
    fetchPosts().then(res => setPosts(res));
    fetchRequests().then(res => setRequests(res));
    fetchEvents().then(res => setEvents(res));
  }, []);

  const filterByTime = (item) => {
    if (filterTime === 'all') return true;
    const createdAt = new Date(item.createdAt);
    const now = new Date();

    if (filterTime === 'today') {
      return isWithinInterval(createdAt, { start: subDays(now, 1), end: now });
    } else if (filterTime === 'week') {
      return isWithinInterval(createdAt, { start: subDays(now, 7), end: now });
    } else if (filterTime === 'month') {
      return isWithinInterval(createdAt, { start: subDays(now, 30), end: now });
    }
    return true;
  };

  const renderCards = () => {
    let items = [];

    if (filterCategory === 'all' || filterCategory === 'posts') {
      posts.filter(filterByTime).forEach(post => items.push(
        <PostCard key={post._id} post={post} token={token} onUpdate={setPosts} label="Complaint" />
      ));
    }
    if (filterCategory === 'all' || filterCategory === 'requests') {
      requests.filter(filterByTime).forEach(req => items.push(
        <RequestCard key={req._id} request={req} token={token} onUpdate={setRequests} label="Request" />
      ));
    }
    if (filterCategory === 'all' || filterCategory === 'events') {
      events.filter(filterByTime).forEach(ev => items.push(
        <EventCard key={ev._id} event={ev} token={token} onUpdate={setEvents} label="Event" />
      ));
    }

    // Sort latest first
    return items.sort((a, b) => new Date(b.props.post?.createdAt || b.props.request?.createdAt || b.props.event?.createdAt) - 
                                new Date(a.props.post?.createdAt || a.props.request?.createdAt || a.props.event?.createdAt));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-2">Campus Feed</h2>
      <p className="text-gray-600 mb-4">Latest updates from across the campus</p>

      {/* Category filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'posts', 'requests', 'events'].map(f => (
          <button
            key={f}
            onClick={() => setFilterCategory(f)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition
              ${filterCategory === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {f === 'all' ? 'All' : f === 'posts' ? 'Complaints' : f === 'requests' ? 'Requests' : 'Events'}
          </button>
        ))}
      </div>

      {/* Time filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(TIME_FILTERS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterTime(key)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition
              ${filterTime === key ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderCards()}
      </div>
    </div>
  );
}
