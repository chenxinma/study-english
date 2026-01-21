class WebStorage {
  constructor() {
    this.storageKey = 'wordLearningApp';
  }

  /**
   * Save data to localStorage
   * @param {string} key - Storage key
   * @param {string} value - Data to save
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      // Fallback to sessionStorage if localStorage is full
      try {
        sessionStorage.setItem(key, value);
      } catch (fallbackError) {
        console.error('Failed to save to sessionStorage:', fallbackError);
      }
    }
  }

  /**
   * Get data from localStorage
   * @param {string} key - Storage key
   * @returns {string|null} Retrieved data
   */
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      try {
        return sessionStorage.getItem(key);
      } catch (fallbackError) {
        console.error('Failed to get from sessionStorage:', fallbackError);
        return null;
      }
    }
  }

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      try {
        sessionStorage.removeItem(key);
      } catch (fallbackError) {
        console.error('Failed to remove from sessionStorage:', fallbackError);
      }
    }
  }

  /**
   * Clear all storage
   */
  clear() {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

export default new WebStorage();