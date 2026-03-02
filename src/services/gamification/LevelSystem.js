// src/services/gamification/LevelSystem.js
export class LevelSystem {
  constructor(initialState = { current: 1, experience: 0, total: 0 }) {
    this.current = initialState.current || 1;
    this.experience = initialState.experience || 0;
    this.total = initialState.total || 0;
    this.xpPerLevel = 1000;
  }

  addExperience(amount) {
    this.experience += amount;
    this.total += amount;
    
    const newLevel = Math.floor(this.total / this.xpPerLevel) + 1;
    const leveledUp = newLevel > this.current;
    
    this.current = newLevel;
    
    return { leveledUp, newLevel };
  }

  getExperienceToNextLevel() {
    return (this.current * this.xpPerLevel) - (this.total % this.xpPerLevel);
  }

  getState() {
    return {
      current: this.current,
      experience: this.experience,
      total: this.total
    };
  }
}