import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chat from './pages/Chat';
import UserProfile from './pages/UserProfile';
import UserGuidelines from './components/UserGuidelines';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5007';

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [loading, setLoading] = useState(true);
  const [background, setBackground] = useState(0);
  const backgrounds = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', // Beach sunset
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', // Ocean waves
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e', // Mountain lake
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e', // Forest path
    'https://images.unsplash.com/photo-1501854140801-50d01608902b', // Desert dunes
    'https://images.unsplash.com/photo-1518495973543-1db035e7e3eb', // Starry night
    'https://images.unsplash.com/photo-1444080748397-f442aa95eb45', // Aurora borealis
    'https://images.unsplash.com/photo-1511300636408-a54c5ed3bc01', // Misty mountains
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e206', // Tropical beach
    'https://images.unsplash.com/photo-1519681393784-d120267933ba', // Snowy peak
  ];

  useEffect(() => {
    const newSocket = io(API_URL, {
      reconnectionAttempts: 5,
      timeout: 5000,
    });

    newSocket.on('connect', () => {
      setSocket(newSocket);
      setLoading(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setLoading(false);
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

  const changeBackground = () => {
    setBackground((prev) => (prev + 1) % backgrounds.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-xl">
        Connecting to server...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-500"
      style={{ backgroundImage: `url(${backgrounds[background]})` }}
    >
      <div className="container mx-auto px-4 py-8 h-screen">
        <UserGuidelines isOpen={showGuidelines} onClose={() => setShowGuidelines(false)} />
        {!user ? (
          <UserProfile setUser={handleUserSet} />
        ) : (
          <div className="relative h-full">
            <Chat socket={socket} user={user} />
            <button
              onClick={changeBackground}
              className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105 z-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;