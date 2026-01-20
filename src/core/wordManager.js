const FileReader = require('../io/fileReader');
const Word = require('../models/word');

class WordManager {
  constructor() {
    this.words = [];
  }

  /**
   * Load words from a file
   * @param {string} filePath - Path to the file to load
   * @returns {Array<Word>} Array of loaded words
   */
  loadWordsFromFile(filePath) {
    try {
      this.words = FileReader.loadWordsFromFile(filePath);
      return this.words;
    } catch (error) {
      throw new Error(`Failed to load words from file: ${error.message}`);
    }
  }

  /**
   * Save words to a file
   * @param {string} filePath - Path to save the words
   */
  saveWordsToFile(filePath) {
    try {
      FileReader.saveWordsToFile(this.words, filePath);
    } catch (error) {
      throw new Error(`Failed to save words to file: ${error.message}`);
    }
  }

  /**
   * Add a new word
   * @param {string} chinese - Chinese meaning
   * @param {string} english - English word
   * @returns {Word} The created word object
   */
  createWord(chinese, english) {
    const word = new Word(chinese, english);
    this.words.push(word);
    return word;
  }

  /**
   * Get random words from the collection
   * @param {number} count - Number of words to get
   * @returns {Array<Word>} Randomly selected words
   */
  getRandomWords(count) {
    // If we have fewer words than requested, return all words
    if (this.words.length <= count) {
      return [...this.words];
    }

    // Create a copy of the words array and shuffle it
    const shuffled = [...this.words].sort(() => 0.5 - Math.random());
    
    // Return the first 'count' elements
    return shuffled.slice(0, count);
  }

  /**
   * Find a word by its ID
   * @param {string} id - Word ID
   * @returns {Word|null} Found word or null
   */
  findWordById(id) {
    return this.words.find(word => word.id === id) || null;
  }

  /**
   * Get all words
   * @returns {Array<Word>} All words in the manager
   */
  getAllWords() {
    return [...this.words];
  }

  /**
   * Get words by box number
   * @param {number} boxNumber - Box number to filter by
   * @returns {Array<Word>} Words in the specified box
   */
  getWordsByBox(boxNumber) {
    return this.words.filter(word => word.boxNumber === boxNumber);
  }

  /**
   * Get the total count of words
   * @returns {number} Total word count
   */
  getWordCount() {
    return this.words.length;
  }

  /**
   * Remove a word by ID
   * @param {string} id - ID of the word to remove
   * @returns {boolean} True if word was removed, false otherwise
   */
  removeWordById(id) {
    const initialLength = this.words.length;
    this.words = this.words.filter(word => word.id !== id);
    return this.words.length < initialLength;
  }

  /**
   * Clear all words
   */
  clearWords() {
    this.words = [];
  }
}

module.exports = WordManager;