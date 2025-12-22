// client/src/components/MessageInput.jsx
import { useState } from 'react';
import { Send, Lock } from 'lucide-react';
import socket from '../services/socket';
import { useAuth } from '../context/AuthContext';

export default function MessageInput({ onSendMessage, disabled }) {
  const { user } = useAuth();
  const [text, setText] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text);
    setText('');
  };

  const handleTyping = () => {
    if (user) socket.emit('typing', user.name);
  };

  return (
    <div className="p-4 bg-white border-t">
      <form onSubmit={submit} className="flex gap-2 relative group">
        <input
          disabled={disabled}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleTyping}
          placeholder={
            disabled ? 'Login to participate in chat' : 'Type a message...'
          }
          className={`flex-1 rounded-xl px-4 py-3 text-sm
            ${disabled
              ? 'bg-slate-200 cursor-not-allowed'
              : 'bg-slate-100 focus:ring-2 focus:ring-blue-500'
            }`}
        />

        <button
          disabled={disabled || !text.trim()}
          className="bg-blue-600 disabled:bg-slate-300 text-white p-3 rounded-xl"
        >
          {disabled ? <Lock size={18} /> : <Send size={18} />}
        </button>

        {disabled && (
          <div className="absolute -top-9 left-1/2 -translate-x-1/2
            bg-black text-white text-xs px-3 py-1 rounded opacity-0
            group-hover:opacity-100 transition">
            Login to chat
          </div>
        )}
      </form>
    </div>
  );
}
