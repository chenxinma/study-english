// src/services/gamification/StreakManager.js
export class StreakManager {
  constructor(initialState = { current: 0, longest: 0, lastStudyDate: null }) {
    this.current = initialState.current || 0;
    this.longest = initialState.longest || 0;
    this.lastStudyDate = initialState.lastStudyDate ? new Date(initialState.lastStudyDate) : null;
  }

  updateStreak(currentDate = new Date()) {
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    if (!this.lastStudyDate) {
      // First study session
      this.current = 1;
      this.lastStudyDate = today;
    } else {
      const lastStudy = new Date(this.lastStudyDate.getFullYear(), this.lastStudyDate.getMonth(), this.lastStudyDate.getDate());
      const daysDifference = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
      
      if (daysDifference === 0) {
        // Already studied today, no change
        return false;
      } else if (daysDifference === 1) {
        // Consecutive day
        this.current += 1;
        this.lastStudyDate = today;
      } else if (daysDifference > 1) {
        // Streak broken
        this.current = 1;
        this.lastStudyDate = today;
      }
    }
    
    // Update longest streak
    if (this.current > this.longest) {
      this.longest = this.current;
    }
    
    return true;
  }

  getMultiplier() {
    if (this.current >= 8) return 2.0;
    if (this.current >= 4) return 1.5;
    return 1.0;
  }

  getState() {
    return {
      current: this.current,
      longest: this.longest,
      lastStudyDate: this.lastStudyDate ? this.lastStudyDate.toISOString().split('T')[0] : null
    };
  }
}