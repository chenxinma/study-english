import React, { createContext, useContext, useState, useEffect } from 'react';
import webLeitnerBox from '../services/webLeitnerBox';
import webWordManager from '../services/webWordManager';
import webQuizEngine from '../services/webQuizEngine';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // State managed by React, logic handled by core modules
  const [stats, setStats] = useState(webLeitnerBox.stats);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [learningProgress, setLearningProgress] = useState({
    currentQuestion: 0,
    userAnswers: [],
    showResults: false
  });

  // Update stats when they change in the core system
  useEffect(() => {
    const updateStats = () => {
      setStats({ ...webLeitnerBox.stats });
    };

    // Initial stats update
    updateStats();

    // Set up interval to periodically check for stats changes
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Load words from file
  const loadWordsFromFile = async (file) => {
    setIsLoading(true);
    try {
      const words = await webWordManager.loadWordsFromFile(file);
      webLeitnerBox.addWords(words);
      return { success: true, count: words.length };
    } catch (error) {
      console.error('Failed to load words:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new quiz session
  const startQuiz = (quizType = 'random') => {
    const words = webLeitnerBox.getWordsForReview();
    if (words.length === 0) {
      return null;
    }

    let quiz;
    switch (quizType) {
      case 'matching':
        quiz = webQuizEngine.generateMatchingQuiz(words.slice(0, 5));
        break;
      case 'fill-in':
        quiz = webQuizEngine.generateFillInQuiz(words.slice(0, 5));
        break;
      case 'translation':
        quiz = webQuizEngine.generateTranslationQuiz(words.slice(0, 5));
        break;
      default:
        quiz = webQuizEngine.generateRandomQuiz(words.slice(0, 5));
    }

    setCurrentQuiz(quiz);
    setLearningProgress({
      currentQuestion: 0,
      userAnswers: [],
      showResults: false
    });

    return quiz;
  };

  // Submit answer for current question
  const submitAnswer = async (answerData) => {
    if (!currentQuiz) return;

    const currentQuestion = currentQuiz.questions[learningProgress.currentQuestion];
    
    // Handle both string answer and answer object
    let answer;
    let additionalData = {};
    
    if (typeof answerData === 'object' && answerData !== null) {
      answer = answerData.answer;
      additionalData = { ...answerData };
      delete additionalData.answer; // Remove answer from additional data
    } else {
      answer = answerData;
    }
    
    // Use answerKey for matching quiz, otherwise use answer
    const correctAnswer = currentQuiz.type === 'matching' 
      ? currentQuestion.answerKey 
      : currentQuestion.answer;
    const isCorrect = webQuizEngine.evaluateAnswer(answer, correctAnswer, currentQuiz.type);

    // Update word status in Leitner box
    let word = null;
    
    if (currentQuiz.type === 'matching') {
      // For matching quiz, get all words from the quiz
      const words = currentQuiz.words;
      if (words && words.length > 0) {
        // Update all words that were part of this matching quiz
        for (const w of words) {
          await webLeitnerBox.updateWordStatus(w, isCorrect);
        }
        // Use the first word for the return value
        word = words[0];
      }
    } else {
      // For other quiz types, update the single word
      const currentWord = currentQuestion.word;
      if (currentWord) {
        await webLeitnerBox.updateWordStatus(currentWord, isCorrect);
        word = currentWord;
      }
    }

    // Update learning progress
    const newAnswers = [...learningProgress.userAnswers, {
      question: currentQuestion,
      userAnswer: answer,
      correct: isCorrect,
      ...additionalData // Include additional data like attempts, hints, timeToAnswer
    }];

    // For matching quiz, auto-advance since it's a complete exercise
    const shouldAdvance = currentQuiz.type === 'matching';
    
    let newProgress = {
      ...learningProgress,
      userAnswers: newAnswers
    };

    if (shouldAdvance) {
      newProgress.currentQuestion = learningProgress.currentQuestion + 1;
      // Check if quiz is complete
      if (newProgress.currentQuestion >= currentQuiz.questions.length) {
        newProgress.showResults = true;
      }
    }

    setLearningProgress(newProgress);

    return { correct: isCorrect, word, shouldAdvance };
  };

  // Move to the next question
  const moveToNextQuestion = () => {
    if (!currentQuiz) return;

    const newProgress = {
      ...learningProgress,
      currentQuestion: learningProgress.currentQuestion + 1
    };

    // Check if quiz is complete
    if (newProgress.currentQuestion >= currentQuiz.questions.length) {
      newProgress.showResults = true;
    }

    setLearningProgress(newProgress);
  };

  // Get current statistics
  const getStatistics = () => {
    return {
      totalStudied: stats.totalStudied,
      totalCorrect: stats.totalCorrect,
      correctRate: stats.totalStudied > 0 ? Math.round((stats.totalCorrect / stats.totalStudied) * 100) : 0,
      currentStreak: stats.currentStreak,
      totalWords: webLeitnerBox.getTotalWordCount(),
      boxDistribution: {
        1: webLeitnerBox.getBoxStats(1).count,
        2: webLeitnerBox.getBoxStats(2).count,
        3: webLeitnerBox.getBoxStats(3).count,
        4: webLeitnerBox.getBoxStats(4).count,
        5: webLeitnerBox.getBoxStats(5).count
      }
    };
  };

  // Get words for review
  const getWordsForReview = () => {
    return webLeitnerBox.getWordsForReview();
  };

  const value = {
    // State
    stats,
    isLoading,
    currentQuiz,
    learningProgress,
    
    // Actions
    loadWordsFromFile,
    startQuiz,
    submitAnswer,
    moveToNextQuestion,
    getStatistics,
    getWordsForReview,
    
    // Services (for advanced usage)
    services: {
      leitnerBox: webLeitnerBox,
      wordManager: webWordManager,
      quizEngine: webQuizEngine
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};