import React, { useState } from 'react';
import { Send } from 'lucide-react';
import socket from '../services/socket';
import { getStoredUser } from '../services/auth';

const MessageInput = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const user = getStoredUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    } else {
      // Emit typing event
      socket.emit('typing', user.name);
    }
  };

  return (
    <div className="p-4 bg-white border-t border-slate-200">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700"
        />
        <button
          disabled={!text.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;