// src/components/Gamification/GamificationNotifications.jsx
import React, { useState, useEffect } from 'react';
import { useGamification } from '../../contexts/GamificationContext';
import GameEventBus from '../../services/gamification/GameEventBus';

const GamificationNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { refreshData } = useGamification();
  
  useEffect(() => {
    const handleLevelUp = (data) => {
      addNotification({
        id: Date.now(),
        type: 'level_up',
        title: '等级提升！',
        message: `恭喜！你已升到等级 ${data.level}`,
        icon: '🎉'
      });
    };
    
    const handleAchievement = (achievement) => {
      addNotification({
        id: Date.now(),
        type: 'achievement',
        title: '成就解锁！',
        message: achievement.name,
        icon: achievement.icon
      });
    };
    
    const handleStreak = (streak) => {
      if (streak.current > 1 && streak.current % 7 === 0) {
        addNotification({
          id: Date.now(),
          type: 'streak',
          title: '连胜里程碑！',
          message: `连续学习 ${streak.current} 天！`,
          icon: '🔥'
        });
      }
    };
    
    GameEventBus.on('level_up', handleLevelUp);
    GameEventBus.on('achievement_unlocked', handleAchievement);
    GameEventBus.on('streak_updated', handleStreak);
    
    return () => {
      GameEventBus.off('level_up', handleLevelUp);
      GameEventBus.off('achievement_unlocked', handleAchievement);
      GameEventBus.off('streak_updated', handleStreak);
    };
  }, []);
  
  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg animate-fade-in max-w-xs w-full"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{notification.icon}</span>
            <div>
              <div className="font-bold">{notification.title}</div>
              <div className="text-sm opacity-90">{notification.message}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GamificationNotifications;