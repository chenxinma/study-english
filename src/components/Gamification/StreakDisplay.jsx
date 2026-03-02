// src/components/Gamification/StreakDisplay.jsx
import React from 'react';
import { useGamification } from '../../contexts/GamificationContext';

const StreakDisplay = ({ size = 'medium' }) => {
  const { streak, isLoading } = useGamification();
  
  if (isLoading || !streak.current) return null;
  
  const getStreakColor = (count) => {
    if (count >= 8) return 'text-orange-500';
    if (count >= 4) return 'text-red-500';
    return 'text-yellow-500';
  };
  
  const getBackgroundClass = (count) => {
    if (count >= 8) return 'bg-orange-100 border-orange-300';
    if (count >= 4) return 'bg-red-100 border-red-300';
    return 'bg-yellow-100 border-yellow-300';
  };
  
  const sizeClasses = {
    small: 'text-sm px-2 py-1 rounded',
    medium: 'text-base px-3 py-2 rounded-lg',
    large: 'text-lg px-4 py-2 rounded-lg'
  };
  
  return (
    <div className={`${getBackgroundClass(streak.current)} ${sizeClasses[size]} border flex items-center gap-2`}>
      <svg className={`w-4 h-4 ${getStreakColor(streak.current)}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 0011 0c0-1.12-.072-2.07-.208-2.91-.146-.94-.32-1.78-.52-2.57-.2-1-.42-1.9-.65-2.65a1 1 0 00-.385-1.45z" clipRule="evenodd" />
      </svg>
      <span className={`font-bold ${getStreakColor(streak.current)}`}>{streak.current}天</span>
      <span className="text-gray-600">连胜</span>
    </div>
  );
};

export default StreakDisplay;