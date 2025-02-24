import React from 'react';

const Message = ({ message, isCurrentUser }) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} w-full max-w-full px-2 sm:px-4 mb-4`}>
      <div className={`flex items-end gap-2 max-w-[80%] sm:max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar wrapper with online indicator */}
        <div className="relative flex-shrink-0">
          <img 
            src={message.user.profileImage} 
            alt={message.user.name}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md"
            loading="lazy"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* Message content */}
        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          <span className="text-xs text-gray-500 mb-1 px-2">
            {message.user.name}
          </span>
          <div
            className={`
              relative p-3 rounded-2xl 
              ${isCurrentUser 
                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100'
              }
            `}
          >
            <p className="break-words text-sm sm:text-base">{message.text}</p>
            <span className={`text-[10px] sm:text-xs mt-1 block ${isCurrentUser ? 'text-white/75' : 'text-gray-500'}`}>
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </span>

            {/* Message tail */}
            <div 
              className={`absolute top-0 ${isCurrentUser ? '-right-2' : '-left-2'} w-2 h-4 overflow-hidden`}
            >
              <div className={`
                w-4 h-4 transform rotate-45
                ${isCurrentUser 
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                  : 'bg-white border border-gray-100'
                }
              `}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;