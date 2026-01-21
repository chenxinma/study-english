/**
 * Word data model representing a vocabulary word with learning metadata
 */
class Word {
  constructor(chinese, english) {
    this.id = this.generateId();
    this.chinese = chinese;
    this.english = english;
    this.boxNumber = 1; // Start in Box 1 (newbie box)
    this.lastReviewed = null;
    this.correctCount = 0;
    this.incorrectCount = 0;
  }

  /**
   * Generate a unique ID for the word
   */
  generateId() {
    return `word_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
  }

  /**
   * Get the next review date based on the current box
   */
  getNextReviewDate() {
    const now = new Date();
    switch(this.boxNumber) {
      case 1:
        // Box 1: review daily
        now.setDate(now.getDate() + 1);
        break;
      case 2:
        // Box 2: review every 2 days
        now.setDate(now.getDate() + 2);
        break;
      case 3:
        // Box 3: review weekly
        now.setDate(now.getDate() + 7);
        break;
      case 4:
        // Box 4: review every 2 weeks
        now.setDate(now.getDate() + 14);
        break;
      case 5:
        // Box 5: review every month
        now.setMonth(now.getMonth() + 1);
        break;
      default:
        // Default to daily review
        now.setDate(now.getDate() + 1);
    }
    return now;
  }

  /**
   * Move the word to the next box (if possible)
   */
  promote() {
    if (this.boxNumber < 5) {
      this.boxNumber++;
      this.correctCount++;
      this.updateLastReviewed();
    }
  }

  /**
   * Move the word to the previous box (if possible)
   */
  demote() {
    if (this.boxNumber > 1) {
      this.boxNumber--;
      this.incorrectCount++;
      this.updateLastReviewed();
    } else {
      // If already in box 1, stay in box 1 but update stats
      this.incorrectCount++;
      this.updateLastReviewed();
    }
  }

  /**
   * Update the last reviewed timestamp
   */
  updateLastReviewed() {
    this.lastReviewed = new Date();
  }

  /**
   * Get the review interval for this word's box
   */
  getReviewInterval() {
    switch(this.boxNumber) {
      case 1: return 1; // Daily
      case 2: return 2; // Every 2 days
      case 3: return 7; // Weekly
      case 4: return 14; // Every 2 weeks
      case 5: return 30; // Monthly
      default: return 1; // Default to daily
    }
  }

  /**
   * Convert word object to plain JSON object
   */
  toJSON() {
    return {
      id: this.id,
      chinese: this.chinese,
      english: this.english,
      boxNumber: this.boxNumber,
      lastReviewed: this.lastReviewed ? this.lastReviewed.toISOString() : null,
      correctCount: this.correctCount,
      incorrectCount: this.incorrectCount
    };
  }

  /**
   * Create a Word instance from a JSON object
   */
  static fromJSON(json) {
    const word = new Word(json.chinese, json.english);
    word.id = json.id;
    word.boxNumber = json.boxNumber || 1;
    word.lastReviewed = json.lastReviewed ? new Date(json.lastReviewed) : null;
    word.correctCount = json.correctCount || 0;
    word.incorrectCount = json.incorrectCount || 0;
    return word;
  }
}

export default Word;
