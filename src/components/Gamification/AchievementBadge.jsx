// src/components/Gamification/AchievementBadge.jsx
import React from 'react';

const AchievementBadge = ({ achievement, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-10 h-10 text-lg',
    medium: 'w-14 h-14 text-xl',
    large: 'w-16 h-16 text-2xl'
  };
  
  const outerSizeClasses = {
    small: 'gap-1',
    medium: 'gap-2',
    large: 'gap-2'
  };
  
  const baseClasses = `flex items-center justify-center rounded-full border-2 ${
    achievement.unlocked 
      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-600 text-white shadow-md' 
      : 'bg-gray-100 border-gray-300 text-gray-400'
  } transition-all duration-300 hover:scale-105`;
  
  return (
    <div className={`flex flex-col items-center ${outerSizeClasses[size]}`}>
      <div className={`${baseClasses} ${sizeClasses[size]}`}>
        {achievement.icon}
      </div>
      <div className="mt-1 text-center">
        <div className={`font-semibold text-xs sm:text-sm ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
          {achievement.name}
        </div>
        <div className={`text-xs ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
          {achievement.unlocked ? '已解锁' : '未解锁'}
        </div>
      </div>
    </div>
  );
};

export default AchievementBadge;