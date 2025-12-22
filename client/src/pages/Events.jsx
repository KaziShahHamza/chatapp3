import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/eventApi';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import EventForm from '../components/EventForm';

export default function Events() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Campus Events</h2>
        <p className="text-gray-600 text-sm mt-1">
          See upcoming events or create one if you have the token.
        </p>
      </div>

   
        <EventForm
          token={token}
          onEventCreated={(newEvent) =>
            setEvents((prev) => [newEvent, ...prev])
          }
        />
      

      <div className="space-y-4">
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            token={token}
            onUpdate={setEvents}
          />
        ))}
      </div>
    </div>
  );
}
