import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chat from './pages/Chat';
import UserProfile from './pages/UserProfile';
import ActiveUsers from './components/ActiveUsers';
import UserGuidelines from './components/UserGuidelines';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    const newSocket = io(API_URL, {
      reconnectionAttempts: 5, // Retry connection up to 5 times
      timeout: 5000, // Timeout after 5 seconds
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setSocket(newSocket);
      setLoading(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setLoading(false);
    });

    newSocket.on('active-users', (users) => {
      setActiveUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleUserSet = (newUser) => {
    setUser(newUser);
    if (socket) {
      socket.emit('user-joined', newUser);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-xl">
        Connecting to server...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 h-screen">
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden h-full">
          <UserGuidelines isOpen={showGuidelines} onClose={() => setShowGuidelines(false)} />
          {!user ? (
            <UserProfile setUser={handleUserSet} />
          ) : (
            <div className="flex h-full relative">
              <div className="flex-1 flex flex-col">
                <Chat socket={socket} user={user} />
              </div>
              {/* Desktop sidebar */}
              <div className="w-80 border-l border-gray-200 hidden lg:block">
                <div className="h-full p-4">
                  <ActiveUsers socket={socket} />
                </div>
              </div>
              {/* Mobile active users panel */}
              <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${showUsers ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${showUsers ? 'translate-x-0' : 'translate-x-full'}`}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Active Users</h2>
                      <button
                        onClick={() => setShowUsers(false)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <ActiveUsers socket={socket} />
                  </div>
                </div>
              </div>
              {/* Mobile toggle button */}
              <button
                onClick={() => setShowUsers(!showUsers)}
                className="fixed bottom-20 right-4 lg:hidden z-40 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg transform transition-transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
