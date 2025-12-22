// client/src/pages/Chat.jsx
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import socket from '../services/socket';
import { useAuth } from '../context/AuthContext';

import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

export default function Chat() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/messages');
        setMessages(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('user_typing', (username) => {
      setTypingUser(username);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2500);
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_typing');
    };
  }, []);

  const handleSendMessage = (text) => {
    if (!user) return;

    socket.emit('send_message', {
      userId: user._id || user.id,
      username: user.name,
      text,
    });
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto h-screen bg-slate-50">
      <ChatHeader />

      <main className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">Loading...</div>
        ) : (
          <MessageList
            messages={messages}
            currentUser={user}
            typingUser={typingUser}
          />
        )}
      </main>

      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={!user}
      />
    </div>
  );
}
