const adjectives = ['Happy', 'Clever', 'Brave', 'Swift', 'Bright', 'Cool', 'Epic', 'Wild', 'Chill', 'Vivid'];
const nouns = ['Panda', 'Tiger', 'Eagle', 'Fox', 'Wolf', 'Bear', 'Lion', 'Hawk', 'Otter', 'Falcon'];

export const generateUsername = () => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  return `${adjective}${noun}${number}`;
};
