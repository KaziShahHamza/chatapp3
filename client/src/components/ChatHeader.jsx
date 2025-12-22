// client/src/components/ChatHeader.jsx
import { Hash, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ChatHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between">
      <div className="flex items-center gap-3">
        <Hash />
        <h1 className="font-bold">Global Chat Room</h1>
      </div>

      {user && (
        <div className="flex items-center gap-2 text-sm">
          <User size={16} />
          {user.name}
        </div>
      )}
    </header>
  );
}
