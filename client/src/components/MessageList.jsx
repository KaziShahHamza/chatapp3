// client/src/components/MessageList.jsx
import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages, currentUser, typingUser }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      if (!Array.isArray(messages)) return null;

      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-slate-400">
          <p className="text-lg">No messages yet</p>
          <p className="text-sm">Be the first to say hello!</p>
        </div>
      ) : (
        messages.map((msg, idx) => {
          const currentUserId = currentUser?._id || currentUser?.id;
          const isMe = currentUserId && msg.userId === currentUserId;
          return (
            <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] sm:max-w-[70%] group`}>
                {!isMe && (
                  <span className="text-xs font-bold text-slate-500 ml-1 mb-1 block">
                    {msg.username}
                  </span>
                )}
                <div className={`
                  px-4 py-2.5 rounded-2xl shadow-sm text-sm
                  ${isMe 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}
                `}>
                  <p className="leading-relaxed break-words">{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right opacity-70`}>
                    {formatTime(msg.createdAt || new Date())}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
      
      {typingUser && (
        <div className="text-xs text-slate-400 italic animate-pulse">
          {typingUser} is typing...
        </div>
      )}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageList;