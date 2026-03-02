// src/components/Gamification/LevelProgress.jsx
import React from 'react';
import { useGamification } from '../../contexts/GamificationContext';

const LevelProgress = ({ size = 'medium' }) => {
  const { level, isLoading } = useGamification();
  
  if (isLoading) return null;
  
  const xpToNext = level.current * 1000 - (level.total % 1000);
  const progress = level.current > 0 ? ((level.total % 1000) / 1000) * 100 : 0;
  
  const sizeClasses = {
    small: 'text-sm p-2 rounded',
    medium: 'text-base p-3 rounded-lg',
    large: 'text-lg p-4 rounded-lg'
  };
  
  return (
    <div className={`bg-purple-100 ${sizeClasses[size]} border border-purple-200`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-purple-800 font-bold">等级 {level.current}</span>
        <span className="text-purple-600 text-sm">
          {(level.total % 1000)}/{Math.max(1000, level.current * 1000)} XP
        </span>
      </div>
      <div className="w-full bg-white rounded-full h-2 border border-purple-300 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {level.current > 1 && (
        <div className="mt-1 text-xs text-purple-600">
          距离下一等级还需 {xpToNext} XP
        </div>
      )}
    </div>
  );
};

export default LevelProgress;