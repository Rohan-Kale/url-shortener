import React from 'react';

const BackgroundCard = ({ children }) => {
  return (
    <div className="rounded-lg p-6 shadow-lg backdrop-blur-sm bg-white/10 border border-gray-300/20">
      {children}
    </div>
  );
};

export default BackgroundCard;