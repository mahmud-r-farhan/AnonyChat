import React, { useState, useEffect } from 'react';

const ActiveUsers = ({ socket }) => {
  const [users, setUsers] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    socket.on('active-users-update', (activeUsers) => {
      setUsers(activeUsers);
    });

    return () => socket.off('active-users-update');
  }, [socket]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-300">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-lg font-semibold text-gray-800">
            Active ({users.length})
          </h2>
        </div>
        <button className="lg:hidden">
          <svg className={`w-6 h-6 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div className={`${isCollapsed ? 'hidden' : 'block'} lg:block`}>
        <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-purple-200"
              />
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">{user.name}</span>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveUsers;