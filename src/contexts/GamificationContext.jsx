// src/contexts/GamificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import GamificationService from '../services/gamification/GamificationService';

const GamificationContext = createContext();

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }) => {
  const [gamificationState, setGamificationState] = useState({
    streak: { current: 0, longest: 0 },
    level: { current: 1, experience: 0, total: 0 },
    achievements: [],
    isLoading: true
  });

  useEffect(() => {
    const initialize = async () => {
      await GamificationService.initialize();
      setGamificationState({
        streak: GamificationService.getStreak(),
        level: GamificationService.getLevel(),
        achievements: GamificationService.getAchievements(),
        isLoading: false
      });
    };
    
    initialize();
  }, []);

  const value = {
    ...gamificationState,
    earnXP: async (amount, context = {}) => {
      const result = await GamificationService.earnXP(amount, context);
      setGamificationState(prev => ({
        ...prev,
        level: GamificationService.getLevel()
      }));
      return result;
    },
    checkAchievements: async (eventType, eventData) => {
      const result = await GamificationService.checkAchievements(eventType, eventData);
      setGamificationState(prev => ({
        ...prev,
        achievements: GamificationService.getAchievements()
      }));
      return result;
    },
    refreshData: () => {
      setGamificationState({
        streak: GamificationService.getStreak(),
        level: GamificationService.getLevel(),
        achievements: GamificationService.getAchievements(),
        isLoading: false
      });
    }
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};