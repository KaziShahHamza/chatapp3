import { useEffect, useState } from 'react';
import { fetchRequests } from '../services/requestApi';
import { useAuth } from '../context/AuthContext';
import RequestCard from '../components/RequestCard';
import RequestForm from '../components/RequestForm';
import { isWithinInterval, subDays } from 'date-fns';

const TIME_FILTERS = {
  all: 'All Time',
  today: 'Today',
  week: 'Past Week',
  month: 'Past Month',
};

export default function Requests() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filterTime, setFilterTime] = useState('all');

  useEffect(() => {
    fetchRequests().then(res =>
      setRequests(res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    );
  }, []);

  const filteredRequests = requests.filter(r => {
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

    return isWithinInterval(new Date(r.createdAt), interval);
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-2">Campus Requests</h2>
      <p className="text-gray-600 mb-4 text-sm">
        Ask questions, request course or syllabus info, or other guidance.
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
        {/* Left: Requests */}
        <div className="space-y-4">
          {filteredRequests.length ? (
            filteredRequests.map(req => (
              <RequestCard
                key={req._id}
                request={req}
                token={token}
                onUpdate={setRequests}
                label="Request"
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No requests for this time filter.</p>
          )}
        </div>

        {/* Right: Request form */}
        <div>
          <RequestForm
            token={token}
            onRequestCreated={newReq =>
              setRequests(prev => [newReq, ...prev])
            }
          />
        </div>
      </div>
    </div>
  );
}
