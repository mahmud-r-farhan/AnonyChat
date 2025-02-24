import React, { useState, useEffect, useRef } from 'react';
import Message from '../components/Message';

const Chat = ({ socket, user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.on('chat-message', (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    socket.on('error', (errorMessage) => {
      setError(errorMessage);
      setTimeout(() => setError(''), 3000);
    });

    // Request previous messages when component mounts
    socket.emit('get-messages');

    return () => {
      socket.off('chat-message');
      socket.off('error');
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageData = {
      text: input.trim(),
      user: {
        id: user.id,
        name: user.name,
        profileImage: user.profileImage
      }
    };

    socket.emit('send-chat-message', messageData);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-2 py-4 sm:px-4 space-y-6 scroll-smooth">
        {messages.map((msg, idx) => (
          <Message 
            key={idx} 
            message={msg} 
            isCurrentUser={msg.user.id === user.id} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 bg-white border-t shadow-lg">
        <div className="flex gap-2 max-w-5xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            placeholder="Type a message..."
            maxLength={255}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity shadow-lg"
          >
            <span className="hidden sm:inline">Send</span>
            <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;