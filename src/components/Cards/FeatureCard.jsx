import React from 'react';

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  buttonText, 
  onClick, 
  stat = null,
  className = ''
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'play':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'upload':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-xl">
          {getIcon()}
        </div>
        {stat && (
          <div className="text-right">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-white/70">{stat.label}</div>
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/80 mb-6 text-sm leading-relaxed">{description}</p>
      
      <button 
        onClick={onClick}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default FeatureCard;