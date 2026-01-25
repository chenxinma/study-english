import WordManager from '../core/wordManager';
import Word from '../models/word';

class WebWordManager {
  constructor() {
    this.coreManager = new WordManager();
  }

  /**
   * Load words from browser file upload instead of filesystem
   * @param {File} file - File object from browser file input
   * @returns {Array<Word>} Array of loaded words
   */
  async loadWordsFromFile(file) {
    try {
      const content = await this.readFileContent(file);
      const words = this.parseWordFileContent(content);
      
      this.coreManager.words = words;
      return words;
    } catch (error) {
      throw new Error(`Failed to load words from file: ${error.message}`);
    }
  }

  /**
   * Read file content using FileReader API
   * @param {File} file - File object
   * @returns {Promise<string>} File content
   */
  readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsText(file);
    });
  }

  /**
   * Parse word file content (same logic as existing FileReader)
   * @param {string} content - File content
   * @returns {Array<Word>} Parsed words
   */
  parseWordFileContent(content) {
    const lines = content.split('\n');
    const words = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Support both tab and space separated formats
      const parts = trimmedLine.split(/\t+/).filter(part => part.length > 0);
      
      if (parts.length >= 2) {
        // Assume first part is Chinese, rest is English
        const chinese = parts[0];
        const english = parts.slice(1).join(' ');
        const word = new Word(chinese, english);
        words.push(word);
      }
    }
    
    return words;
  }

  // Delegate to core methods
  createWord = (chinese, english) => this.coreManager.createWord(chinese, english);
  getRandomWords = (count) => this.coreManager.getRandomWords(count);
  findWordById = (id) => this.coreManager.findWordById(id);
  getAllWords = () => this.coreManager.getAllWords();
  getWordsByBox = (boxNumber) => this.coreManager.getWordsByBox(boxNumber);
  getWordCount = () => this.coreManager.getWordCount();
  removeWordById = (id) => this.coreManager.removeWordById(id);
  clearWords = () => this.coreManager.clearWords();
}

export default new WebWordManager();