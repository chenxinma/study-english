// src/services/gamification/GamificationService.js
import GameEventBus from './GameEventBus';
import webStorage from '../webStorage';

class GamificationService {
  constructor() {
    this.storageKey = 'gamification_state';
    this.state = {
      streak: { current: 0, longest: 0, lastStudyDate: null },
      level: { current: 1, experience: 0, total: 0 },
      achievements: this.getDefaultAchievements(),
      initialized: false
    };
    
    // Load existing managers on initialization (will be loaded in initialize())
    this.streakManager = null;
    this.levelSystem = null;
    this.achievementManager = null;
  }

  getDefaultAchievements() {
    return [
      {
        id: 'beginner',
        name: '新手上路',
        description: '完成首次学习',
        icon: '🎯',
        condition: { type: 'first_study', threshold: 1, operator: '>=' },
        reward: { xp: 50, badge: true },
        unlocked: false
      },
      {
        id: 'hot_streak',
        name: '火热状态',
        description: '达成7天连胜',
        icon: '🔥',
        condition: { type: 'streak', threshold: 7, operator: '>=' },
        reward: { xp: 200, badge: true },
        unlocked: false
      },
      {
        id: 'word_master',
        name: '词汇大师',
        description: '学习100个单词',
        icon: '📚',
        condition: { type: 'words_learned', threshold: 100, operator: '>=' },
        reward: { xp: 150, badge: true },
        unlocked: false
      },
      {
        id: 'perfect_score',
        name: '完美表现',
        description: '单次练习全对',
        icon: '✅',
        condition: { type: 'perfect_session', threshold: 1, operator: '>=' },
        reward: { xp: 100, badge: true },
        unlocked: false
      },
      {
        id: 'persistent',
        name: '坚持不懈',
        description: '累计学习30天',
        icon: '🏆',
        condition: { type: 'total_days', threshold: 30, operator: '>=' },
        reward: { xp: 300, badge: true },
        unlocked: false
      }
    ];
  }

  async initialize() {
    if (this.state.initialized) return;
    
    try {
      const savedState = webStorage.getItem(this.storageKey);
      if (savedState) {
        this.state = JSON.parse(savedState);
      }
    } catch (error) {
      console.warn('Failed to load gamification state, using defaults');
    }
    
    // Initialize managers after loading state
    const StreakManager = (await import('./StreakManager')).StreakManager;
    const LevelSystem = (await import('./LevelSystem')).LevelSystem;
    const AchievementManager = (await import('./AchievementManager')).AchievementManager;
    
    this.streakManager = new StreakManager(this.state.streak);
    this.levelSystem = new LevelSystem(this.state.level);
    this.achievementManager = new AchievementManager(this.state.achievements);
    
    this.state.initialized = true;
    this.saveState();
  }

  saveState() {
    try {
      webStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save gamification state:', error);
    }
  }

  getStreak() {
    return this.streakManager ? this.streakManager.getState() : this.state.streak;
  }

  getLevel() {
    return this.levelSystem ? this.levelSystem.getState() : this.state.level;
  }

  getAchievements() {
    return this.achievementManager ? this.achievementManager.getAchievements() : this.state.achievements;
  }

  async earnXP(amount, context = {}) {
    if (!this.streakManager || !this.levelSystem) {
      console.warn('GamificationService not initialized, using basic calculation');
      // Just update basic values without triggering events
      this.state.level.experience += amount;
      this.state.level.total += amount;
      this.state.level.current = Math.floor(this.state.level.total / 1000) + 1;
      this.saveState();
      return { finalAmount: amount, leveledUp: false, newLevel: this.state.level.current };
    }
    
    // Update streak
    const currentDate = context.date || new Date();
    const streakUpdated = this.streakManager.updateStreak(currentDate);
    
    // Apply streak multiplier
    const multiplier = this.streakManager.getMultiplier();
    const finalAmount = Math.round(amount * multiplier);
    
    // Add experience
    const { leveledUp, newLevel } = this.levelSystem.addExperience(finalAmount);
    
    // Save state
    this.state.streak = this.streakManager.getState();
    this.state.level = this.levelSystem.getState();
    this.saveState();
    
    // Emit events
    if (streakUpdated) {
      GameEventBus.emit('streak_updated', this.state.streak);
    }
    if (leveledUp) {
      GameEventBus.emit('level_up', { level: newLevel, totalXP: this.state.level.total });
    }
    
    GameEventBus.emit('xp_earned', { amount: finalAmount, multiplier });
    
    return { finalAmount, leveledUp, newLevel };
  }

  async checkAchievements(eventType, eventData) {
    if (!this.achievementManager) {
      console.warn('GamificationService not initialized, skipping achievement check');
      return [];
    }
    
    // Prepare event data with current state
    const fullEventData = {
      ...eventData,
      streak: this.streakManager.getState(),
      level: this.levelSystem.getState(),
      date: eventData.date || new Date()
    };
    
    const unlockedAchievements = this.achievementManager.checkAllAchievements(fullEventData);
    
    if (unlockedAchievements.length > 0) {
      this.state.achievements = this.achievementManager.getState();
      this.saveState();
      
      unlockedAchievements.forEach(achievement => {
        GameEventBus.emit('achievement_unlocked', achievement);
        if (achievement.reward.xp > 0) {
          this.earnXP(achievement.reward.xp, { achievement: achievement.id });
        }
      });
    }
    
    return unlockedAchievements;
  }
}

export default new GamificationService();