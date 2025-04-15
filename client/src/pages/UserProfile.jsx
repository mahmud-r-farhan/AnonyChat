import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateUsername } from '../utils/nameGenerator';

const UserProfile = ({ setUser }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const getRandomDiceBearAvatar = () => {
    const styles = ['adventurer', 'bottts', 'micah', 'avataaars'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomSeed = Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${randomSeed}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setUser({
      id: Math.random().toString(36).substring(7),
      name: name.trim() || 'Anonymous',
      profileImage: getRandomDiceBearAvatar(),
    });
    setLoading(false);
  };

  const generateRandomName = () => {
    setName(generateUsername());
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-purple-600 mb-4 text-center">Join AnonyChat</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Display Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anonymous"
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={20}
              />
              <motion.button
                type="button"
                onClick={generateRandomName}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.button>
            </div>
            <p className="text-xs text-gray-500 mt-1">{20 - name.length} characters remaining</p>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Joining...' : 'Join Chat'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default UserProfile;