import LeitnerBox from '../core/leitnerBox';
import Word from '../models/word';
import webStorage from './webStorage';

class WebLeitnerBox {
  constructor() {
    this.coreBox = new LeitnerBox();
    this.storageKey = 'leitnerBoxState';
    this.loadState();
  }

  async getNextWords(count) {
    return this.coreBox.getNextWords(count);
  }

  async updateWordStatus(word, correct) {
    this.coreBox.updateWordStatus(word, correct);
    await this.saveState();
  }

  async loadState() {
    try {
      const stateData = webStorage.getItem(this.storageKey);
      if (stateData) {
        const state = JSON.parse(stateData);
        
        // Recreate Word objects from JSON
        if (state.words) {
          state.words.forEach(wordData => {
            const word = Word.fromJSON(wordData);
            this.coreBox.boxes[word.boxNumber].push(word);
          });
        }
        
        this.coreBox.stats = state.stats || {
          totalStudied: 0,
          totalCorrect: 0,
          currentStreak: 0
        };
      }
    } catch (error) {
      console.log('未找到之前的练习状态，开始新的练习');
    }
  }

  async saveState() {
    try {
      const state = {
        words: Object.values(this.coreBox.boxes).flat().map(word => word.toJSON()),
        stats: this.coreBox.stats,
        lastAccessed: new Date().toISOString()
      };
      
      webStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('保存状态失败:', error.message);
    }
  }

  get stats() {
    return this.coreBox.stats;
  }

  getBoxStats(boxNumber) {
    return this.coreBox.getBoxStats(boxNumber);
  }

  getTotalWordCount() {
    return this.coreBox.getTotalWordCount();
  }

  addWords(words) {
    this.coreBox.addWords(words);
    this.saveState();
  }

  // Delegation to core methods
  getWordsForReview = () => this.coreBox.getWordsForReview();
  addWord = (word) => this.coreBox.addWord(word);
  moveWord = (word, targetBox) => this.coreBox.moveWord(word, targetBox);
}

export default new WebLeitnerBox();