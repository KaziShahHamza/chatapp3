// client/src/pages/Chat.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../services/socket';
import { logout } from '../services/auth';
import axios from 'axios';

import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

const Chat = ({user}) => {
  console.log("Current User Object:", user); // Check your browser console!

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  
  const navigate = useNavigate();
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // 1. Fetch History
    const fetchMessages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/messages');
        setMessages(res.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load chat history.');
        setLoading(false);
      }
    };

    fetchMessages();

    // 2. Socket Listeners
    socket.on('receive_message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on('user_typing', (username) => {
      setTypingUser(username);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_typing');
    };
  }, [user, navigate]);

const handleSendMessage = (text) => {
  // Use optional chaining and check both common ID fields
  const currentUserId = user?._id || user?.id;

  if (!currentUserId) {
    console.error("No User ID found! Check the login response structure.");
    return;
  }

  const messageData = {
    userId: currentUserId, 
    username: user.name,
    text: text,
  };
  
  socket.emit('send_message', messageData);
};

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex flex-col max-w-3xl mx-auto h-screen bg-slate-50">
      <ChatHeader user={user} onLogout={handleLogout} />
      
      <main className="flex-1 overflow-hidden flex flex-col relative">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>
        ) : (
          <MessageList messages={messages} currentUser={user} typingUser={typingUser} />
        )}
      </main>

      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;