import React, { useState, useEffect, useRef } from 'react';
import Message from '../components/Message';
import EmojiPicker from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';
import notificationSound from '../assets/sounds/notification.mp3';
import ActiveUsers from '../components/ActiveUsers';
import { format, isToday, isYesterday } from 'date-fns';

const Chat = ({ socket, user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // Changed to true by default
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const observerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const notificationAudio = useRef(new Audio(notificationSound));

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const loadMoreMessages = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    socket.emit('request-messages', { page }, (response) => {
      if (response.error) {
        setError(response.error);
        setTimeout(() => setError(''), 3000);
      } else {
        setMessages((prev) => [...response.messages, ...prev]);
        setHasMore(response.hasMore);
        setPage((prev) => prev + 1);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('chat-message', (message) => {
      if (message.user.id !== user.id && message.user.id !== 'system') {
        notificationAudio.current.play().catch(() => {});
      }
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    socket.on('error', (errorMessage) => {
      setError(errorMessage);
      setTimeout(() => setError(''), 3000);
    });

    socket.on('user-typing', (typingUser) => {
      setTypingUsers((prev) => new Set(prev).add(typingUser.name));
    });

    socket.on('user-stopped-typing', (typingUser) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(typingUser.name);
        return newSet;
      });
    });

    socket.emit('request-messages', { page: 0 }, (response) => {
      if (response.error) {
        setError(response.error);
      } else {
        setMessages(response.messages);
        setHasMore(response.hasMore);
        setPage(1);
        scrollToBottom('instant');
      }
    });

    return () => {
      socket.off('chat-message');
      socket.off('error');
      socket.off('user-typing');
      socket.off('user-stopped-typing');
    };
  }, [socket]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreMessages();
        }
      },
      { threshold: 0.1 }
    );
    if (messagesContainerRef.current) {
      observer.observe(messagesContainerRef.current);
    }
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = () => {
      if (input.length > 0 && !isTyping) {
        socket.emit('typing-start');
        setIsTyping(true);
      } else if (input.length === 0 && isTyping) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit('typing-stop');
          setIsTyping(false);
        }, 1000);
      }
    };

    handleTyping();
    return () => clearTimeout(typingTimeoutRef.current);
  }, [input, isTyping, socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const messageData = {
      text: input.trim(),
      user: {
        id: user.id,
        name: user.name,
        profileImage: user.profileImage,
      },
    };
    socket.emit('send-chat-message', messageData, (response) => {
      if (response.error) {
        setError(response.error);
        setTimeout(() => setError(''), 3000);
      }
    });
    setInput('');
    setShowEmojiPicker(false);
    socket.emit('typing-stop');
    setIsTyping(false);
  };

  const handleEmojiClick = (emojiObject) => {
    setInput((prev) => prev + emojiObject.emoji);
  };

  const getMessageDate = (date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const groupMessagesByDate = () => {
    const groups = [];
    let currentDate = null;

    messages.forEach((msg) => {
      const messageDate = getMessageDate(new Date(msg.timestamp));
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ type: 'date', date: currentDate });
      }
      groups.push({ type: 'message', message: msg });
    });
    return groups;
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex h-full overflow-hidden">
      <motion.div
        className="flex-1 flex flex-col h-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between p-4 border-b bg-white/90">
       
          <h1 className="text-[1.3vw] font-semibold text-purple-600"> AnonyChat</h1>
          <button
            onClick={toggleSidebar}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d={showSidebar ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} 
              />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth"
        >
          {loading && (
            <div className="text-center py-4">
              <svg
                className="animate-spin h-6 w-6 text-purple-600 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
          {groupMessagesByDate().map((item, idx) => (
            item.type === 'date' ? (
              <div key={`date-${idx}`} className="flex items-center gap-4 my-6">
                <div className="h-px flex-1 bg-gray-200"></div>
                <span className="text-sm font-medium text-gray-500">{item.date}</span>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
            ) : (
              <Message
                key={`msg-${idx}`}
                message={item.message}
                isCurrentUser={item.message.user.id === user.id}
              />
            )
          ))}
          <div ref={messagesEndRef} />
        </div>

        {typingUsers.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-4 py-2 text-sm text-gray-500 italic"
          >
            {Array.from(typingUsers).join(', ')} {typingUsers.size > 1 ? 'are' : 'is'} typing...
          </motion.div>
        )}

        <form onSubmit={sendMessage} className="p-4 bg-white border-t">
          <div className="flex items-center gap-2 max-w-5xl mx-auto relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-600 hover:text-purple-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-0 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              placeholder="Type a message..."
              maxLength={255}
            />
            <motion.button
              type="submit"
              disabled={!input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50"
            >
              Send
            </motion.button>
          </div>
        </form>
      </motion.div>

      <div className="relative w-80 hidden lg:block">
        <ActiveUsers socket={socket} isOpen={showSidebar} onToggle={toggleSidebar} />
      </div>

      <AnimatePresence>
        {showSidebar && (
          <motion.div
            className="fixed right-0 top-0 h-full w-80 z-40 lg:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <ActiveUsers socket={socket} isOpen={showSidebar} onToggle={toggleSidebar} />
          </motion.div>
        )}
      </AnimatePresence>

      {showSidebar && (
        <motion.div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Chat;