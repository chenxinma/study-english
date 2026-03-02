// src/pages/Achievements.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '../contexts/GamificationContext';
import AchievementBadge from '../components/Gamification/AchievementBadge';

const AchievementsPage = () => {
  const { achievements, isLoading } = useGamification();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="glass-morphism rounded-2xl p-6 text-white text-center">
          <div className="py-10">加载中...</div>
        </div>
      </div>
    );
  }
  
  const unlockedCount = achievements.filter(a => a.unlocked).length || 0;
  const totalAchievements = achievements.length || 0;
  
  return (
    <div className="space-y-6">
      <div className="glass-morphism rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">成就徽章</h1>
            <p className="text-white/80">{unlockedCount}/{totalAchievements} 已解锁</p>
          </div>
          <button 
            onClick={() => navigate('/learning')} 
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm whitespace-nowrap"
          >
            返回学习
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {achievements.map(achievement => (
          <AchievementBadge 
            key={achievement.id} 
            achievement={achievement} 
            size="large" 
          />
        ))}
      </div>
      
      <div className="glass-morphism rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold mb-4">成就说明</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">✓</div>
            <span>完成特定学习目标即可解锁成就</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">+</div>
            <span>每个成就都会奖励额外经验值</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">🔥</div>
            <span>保持连胜可以获得更高的经验倍数</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;