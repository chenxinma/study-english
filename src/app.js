const LeitnerBox = require('./core/leitnerBox');
const WordManager = require('./core/wordManager');
const QuizEngine = require('./core/quizEngine');
const QuizRenderer = require('./io/quizRenderer');
const FileReader = require('./io/fileReader');

class App {
  constructor() {
    this.leitnerBox = new LeitnerBox();
    this.wordManager = new WordManager();
    this.quizEngine = QuizEngine;
    this.renderer = new QuizRenderer();
    this.stateFile = './data/state.json';
    
    // Attempt to load saved state
    try {
      this.leitnerBox.loadState(this.stateFile);
      console.log('已加载之前的练习状态');
    } catch (error) {
      console.log('未找到之前的练习状态，开始新的练习');
    }
  }

  /**
   * Start the application
   */
  async start() {
    this.renderer.showWelcome();
    
    let exit = false;
    while (!exit) {
      try {
        const choice = await this.renderer.showMainMenu();
        // const choice = '2';
        switch (choice) {
          case '1':
            await this.importWords();
            break;
          case '2':
            await this.startLearning();
            break;
          case '3':
            this.showStatistics();
            break;
          case '4':
            exit = true;
            this.saveState();
            console.log('感谢使用！再见！');
            break;
          default:
            console.log('无效选择，请重新输入 (1-4)');
        }
      } catch (error) {
        console.error('发生错误:', error.message);
      }
    }
    
    this.renderer.close();
  }

  /**
   * Import words from a file
   */
  async importWords() {
    try {
      const filePath = await this.renderer.getFileInput();
      const words = FileReader.loadWordsFromFile(filePath);
      
      console.log(`成功导入 ${words.length} 个单词`);
      
      // Add imported words to the Leitner box
      this.leitnerBox.addWords(words);
      
      console.log(`当前总单词数: ${this.leitnerBox.getTotalWordCount()}`);
    } catch (error) {
      console.error('导入单词失败:', error.message);
    }
  }

  /**
   * Start the learning session
   */
  async startLearning() {
    try {
      // Get words for review
      const wordsForReview = this.leitnerBox.getNextWords(10);
      
      if (wordsForReview.length === 0) {
        console.log('没有需要复习的单词，请先导入单词库');
        return;
      }
      
      console.log(`本次学习 ${wordsForReview.length} 个单词`);
      
      // Generate a random quiz
      const quiz = this.quizEngine.generateRandomQuiz(wordsForReview);
      
      // Render the quiz and get user answers
      const userAnswers = await this.renderer.renderQuiz(quiz);
      
      // Evaluate answers and update word status
      const results = [];
      for (let i = 0; i < quiz.questions.length; i++) {
        if (i < userAnswers.length) {
          const question = quiz.questions[i];
          const userAnswerObj = userAnswers[i];
          
          let correct = false;
          let correctAnswer = '';
          let userAnswer = userAnswerObj.answer;
          
          // Determine correctness based on quiz type
          if (quiz.type === 'matching') {
            // For matching quizzes, compare indices
            const expectedAnswer = quiz.questions[0].answerKey[userAnswerObj.questionIndex];
            correct = userAnswer === expectedAnswer;
            correctAnswer = expectedAnswer;
          } else {
            // For fill-in and translation quizzes
            correctAnswer = userAnswerObj.correctAnswer || 
                           (question.answer || question.chinese);
            correct = this.quizEngine.evaluateAnswer(userAnswer.toString(), correctAnswer, quiz.type);
          }
          
          // Update word status in Leitner box
          this.leitnerBox.updateWordStatus(question.word || quiz.words[i], correct);
          
          results.push({
            correct,
            correctAnswer,
            userAnswer,
            word: question.word || quiz.words[i]
          });
        }
      }
      
      // Show results
      this.renderer.showQuizResults(quiz, userAnswers, results);
      
    } catch (error) {
      console.error('学习过程中出现错误:', error.message);
    }
  }

  /**
   * Show learning statistics
   */
  showStatistics() {
    this.renderer.showStatistics(this.leitnerBox.stats);
    
    // Show box distribution
    console.log('\n各盒子单词分布:');
    for (let i = 1; i <= 5; i++) {
      const boxStats = this.leitnerBox.getBoxStats(i);
      console.log(`盒子 ${i}: ${boxStats.count} 个单词`);
    }
  }

  /**
   * Save the current state
   */
  saveState() {
    try {
      this.leitnerBox.saveState(this.stateFile);
      console.log('状态已保存');
    } catch (error) {
      console.error('保存状态失败:', error.message);
    }
  }
}

// Run the application if this file is executed directly
if (require.main === module) {
  const app = new App();
  app.start().catch(error => {
    console.error('应用程序异常终止:', error);
    process.exit(1);
  });
}

module.exports = App;