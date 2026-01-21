import QuizEngine from '../core/quizEngine';

class WebQuizEngine {
  /**
   * Generate a random quiz - direct delegation to core
   * @param {Array<Word>} words - Words to use for the quiz
   * @returns {Object} Quiz object
   */
  generateRandomQuiz(words) {
    return QuizEngine.generateRandomQuiz(words);
  }

  /**
   * Generate specific quiz types
   */
  generateMatchingQuiz(words) {
    return QuizEngine.generateMatchingQuiz(words);
  }

  generateFillInQuiz(words) {
    return QuizEngine.generateFillInQuiz(words);
  }

  generateTranslationQuiz(words) {
    return QuizEngine.generateTranslationQuiz(words);
  }

  /**
   * Evaluate answer - direct delegation to core
   * @param {string} userAnswer - User's answer
   * @param {string} correctAnswer - Correct answer
   * @param {string} quizType - Type of quiz
   * @returns {boolean} Whether answer is correct
   */
  evaluateAnswer(userAnswer, correctAnswer, quizType) {
    return QuizEngine.evaluateAnswer(userAnswer, correctAnswer, quizType);
  }

  // Delegate all other methods to core
}

export default new WebQuizEngine();