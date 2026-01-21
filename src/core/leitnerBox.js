import FileReader from '../io/fileReader';

class LeitnerBox {
  constructor() {
    // Create 5 boxes for the Leitner system
    this.boxes = {
      1: [], // New words - daily review
      2: [], // Learned words - every 2 days
      3: [], // Well learned - weekly review
      4: [], // Familiar - bi-weekly review
      5: []  // Mastered - monthly review
    };
    
    // Statistics
    this.stats = {
      totalStudied: 0,
      totalCorrect: 0,
      currentStreak: 0
    };
    
    this.lastAccessed = new Date();
  }

  /**
   * Add a word to the first box (new words box)
   * @param {Word} word - Word object to add
   */
  addWord(word) {
    // Ensure the word starts in box 1
    word.boxNumber = 1;
    this.boxes[1].push(word);
  }

  /**
   * Add multiple words to the first box
   * @param {Array<Word>} words - Array of Word objects to add
   */
  addWords(words) {
    words.forEach(word => this.addWord(word));
  }

  /**
   * Move a word to a different box
   * @param {Word} word - Word object to move
   * @param {number} targetBox - Target box number (1-5)
   */
  moveWord(word, targetBox) {
    if (targetBox < 1 || targetBox > 5) {
      throw new Error('Target box must be between 1 and 5');
    }

    // Remove word from its current box
    const currentBox = this.boxes[word.boxNumber];
    if (currentBox) {
      const index = currentBox.findIndex(w => w.id === word.id);
      if (index !== -1) {
        currentBox.splice(index, 1);
      }
    }

    // Add word to the target box
    word.boxNumber = targetBox;
    word.updateLastReviewed();
    this.boxes[targetBox].push(word);
  }

  /**
   * Get words ready for review based on their scheduled review dates
   * @returns {Array<Word>} Array of words ready for review
   */
  getWordsForReview() {
    const now = new Date();
    const wordsForReview = [];
    
    // Go through all boxes and collect words that need review
    for (let boxNum = 1; boxNum <= 5; boxNum++) {
      const box = this.boxes[boxNum];
      for (const word of box) {
        // If lastReviewed is null or empty, include the word (new words that haven't been reviewed)
        if (!word.lastReviewed) {
          wordsForReview.push(word);
          continue;
        }
        
        const nextReview = new Date(word.lastReviewed);
        nextReview.setDate(nextReview.getDate() + word.getReviewInterval());
        
        // If the next review date is today or in the past, it's time to review
        if (nextReview <= now) {
          wordsForReview.push(word);
          word.updateLastReviewed();
        }
      }
    }
    
    return wordsForReview;
  }

  /**
   * Get a specific number of words for practice from boxes
   * Distribute words across boxes proportionally (more from lower boxes)
   * @param {number} count - Number of words to get
   * @returns {Array<Word>} Array of words for practice
   */
  getNextWords(count = 10) {
    const wordsForReview = this.getWordsForReview();

    // If we have enough words for review, just return them (up to count)
    if (wordsForReview.length <= count) {
      return wordsForReview;
    }
    
    // Otherwise, distribute requested count across boxes based on the Leitner system
    // Prioritize lower-numbered boxes (which need more frequent review)
    const result = [];
    
    // Calculate distribution: e.g., if count=10, try to get ~4 from box1, ~3 from box2, ~2 from box3, ~1 from box4, ~0 from box5
    let remaining = count;
    for (let boxNum = 1; boxNum <= 5 && remaining > 0; boxNum++) {
      const box = this.boxes[boxNum];
      if (box.length === 0) continue;
      
      // Calculate how many words to take from this box
      // Boxes with lower numbers get higher priority
      const ratio = (6 - boxNum) / 15; // Box 1: 5/15, Box 2: 4/15, Box 3: 3/15, Box 4: 2/15, Box 5: 1/15
      const targetFromThisBox = Math.min(
        Math.ceil(count * ratio),
        box.length,
        remaining
      );
      
      // Filter words that are ready for review in this box
      const readyForReview = box.filter(word => {
        const nextReview = new Date(word.lastReviewed);
        nextReview.setDate(nextReview.getDate() + word.getReviewInterval());
        return nextReview <= new Date();
      });
      
      // Take words from this box (random selection if more available than needed)
      const wordsToAdd = readyForReview.slice(0, targetFromThisBox);
      result.push(...wordsToAdd);
      remaining -= wordsToAdd.length;
    }
    
    // If we still need more words and didn't reach the count, get additional random words
    if (result.length < count) {
      // Get all remaining words that need review
      const allRemaining = this.getWordsForReview().filter(
        w => !result.some(r => r.id === w.id)
      );
      
      // Add random remaining words to reach the desired count
      const shortfall = count - result.length;
      for (let i = 0; i < Math.min(shortfall, allRemaining.length); i++) {
        const randomIndex = Math.floor(Math.random() * allRemaining.length);
        result.push(allRemaining[randomIndex]);
        // Remove selected word to avoid duplicates
        allRemaining.splice(randomIndex, 1);
      }
    }
    
    return result.slice(0, count);
  }

  /**
   * Update word status based on user's answer
   * @param {Word} word - Word object that was tested
   * @param {boolean} correct - Whether the user answered correctly
   */
  updateWordStatus(word, correct) {
    // Update statistics
    this.stats.totalStudied += 1;
    if (correct) {
      this.stats.totalCorrect += 1;
      this.stats.currentStreak += 1;
      
      // Promote the word to the next box if answered correctly
      if (word.boxNumber < 5) {
        this.moveWord(word, word.boxNumber + 1);
      } else {
        // If word is already in the highest box, just update the review date
        word.updateLastReviewed();
      }
    } else {
      this.stats.currentStreak = 0;
      
      // Demote the word to the previous box if answered incorrectly
      if (word.boxNumber > 1) {
        this.moveWord(word, word.boxNumber - 1);
      } else {
        // If word is in the first box, keep it there but update the review date
        word.updateLastReviewed();
      }
    }
  }

  /**
   * Get the total number of words across all boxes
   * @returns {number} Total count of words
   */
  getTotalWordCount() {
    return Object.values(this.boxes).reduce((total, box) => total + box.length, 0);
  }

  /**
   * Get statistics for a specific box
   * @param {number} boxNumber - Box number (1-5)
   * @returns {Object} Statistics for the box
   */
  getBoxStats(boxNumber) {
    if (boxNumber < 1 || boxNumber > 5) {
      throw new Error('Box number must be between 1 and 5');
    }
    
    const box = this.boxes[boxNumber];
    return {
      count: box.length,
      totalCorrect: box.reduce((sum, word) => sum + word.correctCount, 0),
      totalIncorrect: box.reduce((sum, word) => sum + word.incorrectCount, 0)
    };
  }

  /**
   * Save the current state to a file
   * @param {string} filePath - Path to save the state
   */
  saveState(filePath = './data/state.json') {
    const state = {
      words: Object.values(this.boxes).flat().map(word => word.toJSON()),
      stats: this.stats,
      lastAccessed: new Date().toISOString()
    };
    
    FileReader.saveState(state, filePath);
  }

  /**
   * Load state from a file
   * @param {string} filePath - Path to load the state from
   */
  loadState(filePath = './data/state.json') {
    const state = FileReader.loadState(filePath);
    
    // Clear current boxes
    this.boxes = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    
    // Populate boxes with loaded words
    if (state.words) {
      state.words.forEach(wordData => {
        const word = typeof wordData.toJSON === 'function' ? wordData : Word.fromJSON(wordData);
        this.boxes[word.boxNumber].push(word);
      });
    }
    
    this.stats = state.stats || {
      totalStudied: 0,
      totalCorrect: 0,
      currentStreak: 0
    };
    
    this.lastAccessed = state.lastAccessed ? new Date(state.lastAccessed) : new Date();
  }
}

export default LeitnerBox;