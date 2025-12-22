// client/src/components/ChatHeader.jsx
import { LogOut, Hash, User } from 'lucide-react';

const ChatHeader = ({ user }) => (
  <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
    <div className="flex items-center gap-3">
      <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
        <Hash size={20} />
      </div>
      <div>
        <h1 className="font-bold text-slate-800 text-lg">Global Chat Room</h1>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-xs text-slate-500 font-medium">Live Connection</span>
        </div>
      </div>
    </div>
    
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
        <User size={16} className="text-slate-600" />
        <span className="text-sm font-semibold text-slate-700">{user.name}</span>
      </div>

    </div>
  </header>
);

export default ChatHeader;