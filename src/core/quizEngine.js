class QuizEngine {
  /**
   * Generate a matching quiz with mixed Chinese and English words
   * @param {Array<Word>} words - Words to use for the quiz
   * @returns {Object} Quiz object with questions and answers
   */
  static generateMatchingQuiz(words) {
    if (words.length < 5) {
      throw new Error('Need at least 5 words for matching quiz');
    }

    // Select 5 random words
    const selectedWords = this._getRandomElements(words, 5);
    
    // Extract Chinese and English terms separately
    const chineseTerms = selectedWords.map(word => word.chinese);
    const englishTerms = selectedWords.map(word => word.english);
    
    // Shuffle the terms independently
    const shuffledChinese = this._shuffleArray([...chineseTerms]);
    const shuffledEnglish = this._shuffleArray([...englishTerms]);
    
    return {
      type: 'matching',
      title: '单词配对题',
      questions: [
        {
          chineseOptions: shuffledChinese,
          englishOptions: shuffledEnglish,
          answerKey: selectedWords.reduce((acc, word, idx) => {
            const chineseIdx = shuffledChinese.indexOf(word.chinese);
            const englishIdx = shuffledEnglish.indexOf(word.english);
            acc[chineseIdx] = englishIdx;
            return acc;
          }, {})
        }
      ],
      words: selectedWords
    };
  }

  /**
   * Generate a fill-in-the-blank quiz
   * @param {Array<Word>} words - Words to use for the quiz
   * @returns {Object} Quiz object with fill-in questions
   */
  static generateFillInQuiz(words) {
    if (words.length < 1) {
      throw new Error('Need at least 1 word for fill-in quiz');
    }

    const selectedWords = this._getRandomElements(words, Math.min(5, words.length));
    
    const questions = selectedWords.map(word => {
      // Generate hints with first letter and last letter, hiding the middle
      const english = word.english.toLowerCase();
      let hint = '';
      
      if (english.length <= 2) {
        // For 1-2 letter words, show first letter and use underscores for the rest
        hint = english[0] + '_'.repeat(Math.max(0, english.length - 1));
      } else {
        // For longer words, show first and last letter with underscores in between
        hint = english[0] + '_'.repeat(english.length - 2) + english[english.length - 1];
      }
      console.log('hint', hint, word);
      
      return {
        chinese: word.chinese,
        hint: hint,
        answer: word.english.toLowerCase(),
        fullWord: word.english,
        word: word
      };
    });
    
    return {
      type: 'fill-in',
      title: '填空题',
      questions: questions,
      words: selectedWords
    };
  }

  /**
   * Generate a translation quiz (English to Chinese)
   * @param {Array<Word>} words - Words to use for the quiz
   * @returns {Object} Quiz object with translation questions
   */
  static generateTranslationQuiz(words) {
    if (words.length < 1) {
      throw new Error('Need at least 1 word for translation quiz');
    }

    const selectedWords = this._getRandomElements(words, Math.min(5, words.length));
    
    const questions = selectedWords.map(word => ({
      english: word.english,
      answer: word.chinese,
      word: word
    }));
    
    return {
      type: 'translation',
      title: '翻译题',
      questions: questions,
      words: selectedWords
    };
  }

  /**
   * Evaluate a user's answer against the correct answer
   * @param {string|Object} userAnswer - User's answer
   * @param {string|Object} correctAnswer - Correct answer
   * @param {string} quizType - Type of quiz ('translation', 'fill-in', 'matching')
   * @returns {boolean} Whether the answer is correct
   */
  static evaluateAnswer(userAnswer, correctAnswer, quizType = 'translation') {
    // Special handling for matching quiz
    if (quizType === 'matching') {
      // For matching quiz, userAnswer should be an object with matchedPairs
      // and correctAnswer should be the answerKey
      if (userAnswer && userAnswer.matchedPairs && correctAnswer) {
        return userAnswer.matchedPairs.every(pair => 
          correctAnswer[pair.chineseIndex] === pair.englishIndex
        );
      }
      return false;
    }
    
    // For other quiz types, normalize both answers for comparison (trim whitespace)
    const normalizedUserAnswer = userAnswer.trim();
    const normalizedCorrectAnswer = correctAnswer.trim();
    
    // Direct match
    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      return true;
    }
    
    // For translation quiz, use semantic matching for Chinese answers
    if (quizType === 'translation') {
      return this._evaluateTranslationAnswer(normalizedUserAnswer, normalizedCorrectAnswer);
    }
    
    // For other quiz types, use case-insensitive matching and similarity
    const normalizedUserLower = normalizedUserAnswer.toLowerCase();
    const normalizedCorrectLower = normalizedCorrectAnswer.toLowerCase();
    
    if (normalizedUserLower === normalizedCorrectLower) {
      return true;
    }
    
    // Check if the user's answer is close enough (for minor spelling variations)
    return this._calculateSimilarity(normalizedUserLower, normalizedCorrectLower) > 0.8;
  }

  /**
   * Evaluate translation answer with semantic matching for Chinese
   * @param {string} userAnswer - User's Chinese answer
   * @param {string} correctAnswer - Correct Chinese answer
   * @returns {boolean} Whether the translation is correct semantically
   */
  static _evaluateTranslationAnswer(userAnswer, correctAnswer) {
    // Check for direct match first
    if (userAnswer === correctAnswer) {
      return true;
    }
    
    // Define synonym mappings for common words
    const synonymMap = this._getSynonymMap();
    
    // Check if user answer is a synonym of correct answer
    const userAnswerLower = userAnswer.toLowerCase();
    const correctAnswerLower = correctAnswer.toLowerCase();
    
    // Direct synonym check
    if (synonymMap[correctAnswerLower] && synonymMap[correctAnswerLower].includes(userAnswerLower)) {
      return true;
    }
    
    if (synonymMap[userAnswerLower] && synonymMap[userAnswerLower].includes(correctAnswerLower)) {
      return true;
    }
    
    // For Chinese answers, check if they share common characters and meaning
    if (this._containsChinese(userAnswer) && this._containsChinese(correctAnswer)) {
      // Check if user answer contains key characters from correct answer
      // or vice versa for partial credit
      return this._isSemanticallySimilar(userAnswer, correctAnswer);
    }
    
    // Fallback to similarity check
    return this._calculateSimilarity(userAnswer, correctAnswer) > 0.7;
  }

  /**
   * Get synonym map for common vocabulary
   * @returns {Object} Synonym mapping
   */
  static _getSynonymMap() {
    return {
      '点心': ['零食', '小食', '小吃', '甜点', '糕点'],
      '零食': ['点心', '小食', '小吃'],
      '小食': ['零食', '点心', '小吃'],
      '电脑': ['计算机', '电脑', '计算机设备'],
      '计算机': ['电脑', '计算机'],
      '手机': ['移动电话', '手机', '移动设备'],
      '汽车': ['车', '轿车', '汽车', '车辆'],
      '书': ['书籍', '书本', '图书'],
      '水': ['水', '饮用水', '清水'],
      '吃': ['食用', '吃', '进食'],
      '看': ['看', '观看', '阅读', '浏览'],
      '走': ['走', '步行', '走路'],
      '学习': ['学习', '学习', '读书', '学习知识'],
      '工作': ['工作', '上班', '工作'],
      '家': ['家庭', '家', '住宅', '家'],
      '学校': ['学校', '学校', '学堂'],
      '朋友': ['朋友', '朋友', '好友'],
      '老师': ['老师', '教师', '老师'],
      '学生': ['学生', '学生', '学子']
    };
  }

  /**
   * Check if string contains Chinese characters
   * @param {string} text - Text to check
   * @returns {boolean} Whether text contains Chinese
   */
  static _containsChinese(text) {
    return /[\u4e00-\u9fff]/.test(text);
  }

  /**
   * Check semantic similarity for Chinese words
   * @param {string} str1 - First Chinese string
   * @param {string} str2 - Second Chinese string
   * @returns {boolean} Whether semantically similar
   */
  static _isSemanticallySimilar(str1, str2) {
    // Extract unique Chinese characters from both strings
    const chars1 = [...new Set(str1.match(/[\u4e00-\u9fff]/g) || [])];
    const chars2 = [...new Set(str2.match(/[\u4e00-\u9fff]/g) || [])];
    
    // If strings are very different in length, they're likely not similar
    const lengthRatio = Math.min(chars1.length, chars2.length) / Math.max(chars1.length, chars2.length);
    if (lengthRatio < 0.3) {
      return false;
    }
    
    // Calculate character overlap
    const commonChars = chars1.filter(char => chars2.includes(char));
    const overlapRatio = commonChars.length / Math.max(chars1.length, chars2.length);
    
    // If there's significant character overlap, consider them similar
    return overlapRatio >= 0.4;
  }

  /**
   * Calculate similarity between two strings (simple implementation)
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {number} Similarity score between 0 and 1
   */
  static _calculateSimilarity(str1, str2) {
    if (str1 === str2) return 1;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1;
    
    // Simple ratio of common characters
    let commonChars = 0;
    const longerLower = longer.toLowerCase();
    const shorterLower = shorter.toLowerCase();
    
    for (let i = 0; i < shorterLower.length; i++) {
      if (longerLower.includes(shorterLower[i])) {
        commonChars++;
      }
    }
    
    return commonChars / longer.length;
  }

  /**
   * Get random elements from an array
   * @param {Array} arr - Source array
   * @param {number} count - Number of elements to select
   * @returns {Array} Randomly selected elements
   * @private
   */
  static _getRandomElements(arr, count) {
    if (count >= arr.length) {
      return [...arr];
    }
    
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Shuffle an array
   * @param {Array} arr - Array to shuffle
   * @returns {Array} Shuffled array
   * @private
   */
  static _shuffleArray(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Generate a random quiz of any type
   * @param {Array<Word>} words - Words to use for the quiz
   * @returns {Object} Quiz object of random type
   */
  static generateRandomQuiz(words) {
    const quizTypes = ['matching', 'fill-in', 'translation'];
    const randomType = quizTypes[Math.floor(Math.random() * quizTypes.length)];
    
    switch(randomType) {
      case 'matching':
        return this.generateMatchingQuiz(words);
      case 'fill-in':
        return this.generateFillInQuiz(words);
      case 'translation':
        return this.generateTranslationQuiz(words);
      default:
        return this.generateTranslationQuiz(words); // Default fallback
    }
  }
}

export default QuizEngine;