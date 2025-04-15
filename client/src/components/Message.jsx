import React from 'react';
import { motion } from 'framer-motion';

const Message = ({ message, isCurrentUser }) => {
  return (
    <motion.div
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} w-full px-2 sm:px-4 mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`flex items-end gap-2 max-w-[80%] sm:max-w-[60%] ${
          isCurrentUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div className="relative flex-shrink-0">
          <img
            src={message.user.profileImage}
            alt={message.user.name}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md"
            loading="lazy"
          />
        </div>
        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          <span className="text-xs text-gray-500 mb-1 px-2">{message.user.name}</span>
          <div
            className={`relative p-3 rounded-2xl ${
              isCurrentUser
                ? 'bg-purple-600 text-white rounded-tr-none'
                : 'bg-white text-gray-800 rounded-tl-none shadow-sm border'
            }`}
          >
            <p className="break-words text-sm sm:text-base">{message.text}</p>
            <span
              className={`text-xs mt-1 block ${isCurrentUser ? 'text-white/75' : 'text-gray-500'}`}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Message;