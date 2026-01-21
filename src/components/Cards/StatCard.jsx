import React from 'react';

const StatCard = ({ value, label, icon = null, trend = null, trendColor = 'text-green-500' }) => {
  const getIcon = () => {
    if (icon === 'book') {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-white border border-white/20">
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl font-bold">{value}</div>
        {icon && (
          <div className="p-2 bg-white/20 rounded-lg">
            {getIcon()}
          </div>
        )}
      </div>
      <div className="text-sm text-white/70 mb-1">{label}</div>
      {trend && (
        <div className={`text-xs ${trendColor} font-medium`}>{trend}</div>
      )}
    </div>
  );
};

export default StatCard;