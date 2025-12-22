import { useEffect, useState } from 'react';
import { fetchRequests } from '../services/requestApi';
import { useAuth } from '../context/AuthContext';
import RequestCard from '../components/RequestCard';
import RequestForm from '../components/RequestForm';

export default function Requests() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests().then(setRequests);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">
          Submit your campus information requests
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Ask questions, request course or syllabus info, or other guidance
        </p>
      </div>

      {token && (
        <RequestForm
          token={token}
          onRequestCreated={(newRequest) =>
            setRequests((prev) => [newRequest, ...prev])
          }
        />
      )}

      <div className="space-y-4">
        {requests.map((request) => (
          <RequestCard
            key={request._id}
            request={request}
            token={token}
            onUpdate={setRequests}
          />
        ))}
      </div>
    </div>
  );
}
