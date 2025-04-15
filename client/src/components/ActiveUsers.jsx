import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ActiveUsers = ({ socket, isOpen, onToggle }) => {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    if (!socket) return;

    socket.on('active-users-update', (activeUsers) => {
      setUsers(activeUsers);
    });

    return () => {
      socket.off('active-users-update');
    };
  }, [socket]);

  return (
    <motion.div
      className="h-full flex mx-1 flex-col bg-white shadow-xl"
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center  justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-purple-600">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          Active Users ({users.length})
        </h2>
        <button
          onClick={onToggle}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {users.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-500 text-center py-4"
            >
              No active users
            </motion.p>
          ) : (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative">
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-purple-200"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">{user.name}</span>
                    <span className="text-xs text-green-500">Online</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ActiveUsers;