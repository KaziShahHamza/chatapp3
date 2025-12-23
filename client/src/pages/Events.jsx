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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Campus Events</h2>
        <p className="text-gray-600 text-sm">
          See upcoming events or create one if you have the token.
        </p>
      </div>

      {/* Time filter */}
      <div className="flex gap-2 flex-wrap bg-white border border-gray-200 rounded-md p-3 shadow-sm">
        {Object.entries(TIME_FILTERS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterTime(key)}
            className={`${filterTime === key ? 'btn-primary' : 'btn-secondary'} text-sm`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
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
        <div className="sticky top-6">
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
