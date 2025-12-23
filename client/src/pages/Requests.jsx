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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Campus Requests</h2>
        <p className="text-gray-600 text-sm">
          Ask questions, request course or syllabus info, or other guidance.
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
        <div className="sticky top-6">
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
