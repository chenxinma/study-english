import fs from 'fs';
import path from 'path';
import Word from '../models/word';

class FileReader {
  /**
   * Load words from a text file
   * @param {string} filePath - Path to the text file
   * @returns {Array<Word>} Array of Word objects
   */
  static loadWordsFromFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/); // Handle both \n and \r\n line endings
    const words = [];

    lines.forEach((line, index) => {
      line = line.trim();
      
      // Skip empty lines
      if (!line) {
        return;
      }

      // Split by tab or multiple spaces (at least 2 spaces)
      const parts = line.split(/\t| {2,}/);

      if (parts.length >= 2) {
        const chinese = parts[0].trim();
        const english = parts[1].trim();

        // Basic validation
        if (chinese && english) {
          const word = new Word(chinese, english);
          words.push(word);
        } else {
          console.warn(`Warning: Invalid format at line ${index + 1}: "${line}"`);
        }
      } else {
        console.warn(`Warning: Could not parse line ${index + 1}: "${line}"`);
      }
    });

    return words;
  }

  /**
   * Save words to a text file
   * @param {Array<Word>} words - Array of Word objects
   * @param {string} filePath - Path to the output file
   */
  static saveWordsToFile(words, filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const lines = words.map(word => `${word.chinese}\t${word.english}`).join('\n');
    fs.writeFileSync(filePath, lines, 'utf8');
  }

  /**
   * Save application state to a JSON file
   * @param {Object} state - Application state object
   * @param {string} filePath - Path to the state file
   */
  static saveState(state, filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf8');
  }

  /**
   * Load application state from a JSON file
   * @param {string} filePath - Path to the state file
   * @returns {Object} Application state object
   */
  static loadState(filePath) {
    if (!fs.existsSync(filePath)) {
      // Return default state if file doesn't exist
      return {
        words: [],
        stats: {
          totalStudied: 0,
          totalCorrect: 0,
          currentStreak: 0
        },
        lastAccessed: new Date().toISOString()
      };
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const state = JSON.parse(content);

    // Convert JSON objects back to Word instances
    if (state.words) {
      state.words = state.words.map(wordData => Word.fromJSON(wordData));
    }

    return state;
  }
}

export default FileReader;