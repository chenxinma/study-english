// src/services/gamification/AchievementManager.js
export class AchievementManager {
  constructor(achievements = []) {
    this.achievements = achievements.map(achievement => ({
      ...achievement,
      unlocked: achievement.unlocked || false,
      unlockDate: achievement.unlockDate || null
    }));
  }

  checkAchievement(achievement, eventData) {
    if (achievement.unlocked) return false;
    
    const { type, threshold, operator } = achievement.condition;
    let valueToCheck;
    
    switch (type) {
      case 'streak':
        valueToCheck = eventData.streak?.current || 0;
        break;
      case 'words_learned':
        valueToCheck = eventData.wordsLearned || 0;
        break;
      case 'total_days':
        valueToCheck = eventData.totalDays || 0;
        break;
      case 'perfect_session':
        valueToCheck = eventData.perfect ? 1 : 0;
        break;
      case 'first_study':
        valueToCheck = eventData.firstStudy ? 1 : 0;
        break;
      default:
        return false;
    }
    
    let conditionMet = false;
    switch (operator) {
      case '>=':
        conditionMet = valueToCheck >= threshold;
        break;
      case '>':
        conditionMet = valueToCheck > threshold;
        break;
      case '==':
        conditionMet = valueToCheck === threshold;
        break;
      default:
        conditionMet = valueToCheck >= threshold;
    }
    
    if (conditionMet) {
      achievement.unlocked = true;
      achievement.unlockDate = new Date().toISOString();
      return true;
    }
    
    return false;
  }

  checkAllAchievements(eventData) {
    const unlockedAchievements = [];
    
    for (const achievement of this.achievements) {
      if (this.checkAchievement(achievement, eventData)) {
        unlockedAchievements.push(achievement);
      }
    }
    
    return unlockedAchievements;
  }

  getAchievements() {
    return this.achievements;
  }

  getUnlockedAchievements() {
    return this.achievements.filter(a => a.unlocked);
  }

  getState() {
    return this.achievements;
  }
}