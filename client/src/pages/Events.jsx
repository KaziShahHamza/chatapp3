import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/eventApi';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import EventForm from '../components/EventForm';
import { isWithinInterval, subDays } from 'date-fns';

const TIME_FILTERS = {
  all: 'All Time',
  today: 'Today',
  week: 'Past Week',
  month: 'Past Month',
};

export default function Events() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [filterTime, setFilterTime] = useState('all');

  useEffect(() => {
    fetchEvents().then(res =>
      setEvents(res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    );
  }, []);

  const filteredEvents = events.filter(ev => {
    if (filterTime === 'all') return true;

    const now = new Date();
    let interval;

    switch (filterTime) {
      case 'today':
        interval = { start: subDays(now, 1), end: now };
        break;
      case 'week':
        interval = { start: subDays(now, 7), end: now };
        break;
      case 'month':
        interval = { start: subDays(now, 30), end: now };
        break;
      default:
        return true;
    }

    return isWithinInterval(new Date(ev.createdAt), interval);
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-2">Campus Events</h2>
      <p className="text-gray-600 mb-4 text-sm">
        See upcoming events or create one if you have the token.
      </p>

      {/* Time filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.entries(TIME_FILTERS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterTime(key)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition
              ${filterTime === key
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left: Events */}
        <div className="space-y-4">
          {filteredEvents.length ? (
            filteredEvents.map(ev => (
              <EventCard
                key={ev._id}
                event={ev}
                token={token}
                onUpdate={setEvents}
                label="Event"
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No events for this time filter.</p>
          )}
        </div>

        {/* Right: Event form */}
        <div>
          <EventForm
            token={token}
            onEventCreated={newEv =>
              setEvents(prev => [newEv, ...prev])
            }
          />
        </div>
      </div>
    </div>
  );
}
