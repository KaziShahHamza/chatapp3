// client/src/components/ChatHeader.jsx
import { Hash, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ChatHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-[#4f7baa] text-white px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <Hash />
        <p className="font-bold text-lg ">Global Chat Room</p>
      </div>

      {user && (
        <div className="flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-full">
          <User size={16} />
          {user.name}
        </div>
      )}
    </header>
  );
}
