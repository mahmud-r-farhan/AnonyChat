export const getRandomDiceBearAvatar = (seed = null) => {
  const styles = [
    'adventurer',
    'avataaars',
    'big-ears',
    'bottts',
    'croodles',
    'fun-emoji',
    'icons',
    'identicon',
    'lorelei',
    'micah',
    'miniavs',
    'personas',
    'pixel-art'
  ];
  
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  const finalSeed = seed || Math.random().toString(36).substring(7);
  
  return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${finalSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};
