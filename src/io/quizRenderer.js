const readline = require('readline');

class QuizRenderer {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Display the main menu and get user choice
   * @returns {Promise<string>} User's choice
   */
  async showMainMenu() {
    console.log('\n========== 背单词应用 ==========');
    console.log('1. 导入单词库');
    console.log('2. 开始学习');
    console.log('3. 查看统计');
    console.log('4. 退出程序');
    console.log('===============================');
    
    const choice = await this.question('请选择操作 (1-4): ');
    return choice.trim();
  }

  /**
   * Display quiz and get user answers
   * @param {Object} quiz - Quiz object
   * @returns {Promise<Object>} User's answers
   */
  async renderQuiz(quiz) {
    console.log(`\n========== ${quiz.title} ==========`);
    
    const userAnswers = [];
    
    switch(quiz.type) {
      case 'matching':
        userAnswers.push(...await this._renderMatchingQuiz(quiz.questions[0]));
        break;
        
      case 'fill-in':
        userAnswers.push(...await this._renderFillInQuiz(quiz.questions));
        break;
        
      case 'translation':
        userAnswers.push(...await this._renderTranslationQuiz(quiz.questions));
        break;
        
      default:
        console.log('未知题型');
        return [];
    }
    
    return userAnswers;
  }

  /**
   * Render matching quiz
   * @param {Object} question - Matching question object
   * @returns {Promise<Array>} User's answers
   * @private
   */
  async _renderMatchingQuiz(question) {
    console.log('\n请将中文释义与对应的英文单词匹配:');
    
    // Display Chinese options
    console.log('\n中文释义:');
    question.chineseOptions.forEach((chinese, index) => {
      console.log(`${index + 1}. ${chinese}`);
    });
    
    // Display English options
    console.log('\n英文单词:');
    question.englishOptions.forEach((english, index) => {
      console.log(`${index + 1}. ${english}`);
    });
    
    const answers = [];
    for (let i = 0; i < question.chineseOptions.length; i++) {
      const answer = await this.question(`为"${question.chineseOptions[i]}"选择对应的英文单词编号: `);
      answers.push({ questionIndex: i, answer: parseInt(answer) - 1 });
    }
    
    return answers;
  }

  /**
   * Render fill-in quiz
   * @param {Array} questions - Fill-in questions
   * @returns {Promise<Array>} User's answers
   * @private
   */
  async _renderFillInQuiz(questions) {
    const answers = [];
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      console.log(`\n${i + 1}. ${q.chinese} (${q.hint})`);
      const answer = await this.question('请输入完整单词: ');
      answers.push({ 
        questionIndex: i, 
        answer: answer.trim(),
        correctAnswer: q.answer
      });
    }
    
    return answers;
  }

  /**
   * Render translation quiz
   * @param {Array} questions - Translation questions
   * @returns {Promise<Array>} User's answers
   * @private
   */
  async _renderTranslationQuiz(questions) {
    const answers = [];
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      console.log(`\n${i + 1}. ${q.english}`);
      const answer = await this.question('请输入中文释义: ');
      answers.push({ 
        questionIndex: i, 
        answer: answer.trim(),
        correctAnswer: q.answer
      });
    }
    
    return answers;
  }

  /**
   * Show quiz results
   * @param {Object} quiz - Quiz object
   * @param {Array} userAnswers - User's answers
   * @param {Array} results - Evaluation results
   */
  showQuizResults(quiz, userAnswers, results) {
    console.log('\n========== 答题结果 ==========');
    
    let correctCount = 0;
    
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      console.log(`\n第 ${i + 1} 题: ${result.correct ? '✓ 正确' : '✗ 错误'}`);
      
      if (!result.correct) {
        console.log(`正确答案: ${result.correctAnswer}`);
        console.log(`你的答案: ${result.userAnswer}`);
      }
      
      if (result.correct) {
        correctCount++;
      }
    }
    
    console.log(`\n总分: ${correctCount}/${results.length}`);
    console.log(`正确率: ${Math.round((correctCount/results.length) * 100)}%`);
  }

  /**
   * Show study statistics
   * @param {Object} stats - Statistics object
   */
  showStatistics(stats) {
    console.log('\n========== 学习统计 ==========');
    console.log(`总学习单词数: ${stats.totalStudied}`);
    console.log(`总正确数: ${stats.totalCorrect}`);
    if (stats.totalStudied > 0) {
      console.log(`总体正确率: ${Math.round((stats.totalCorrect/stats.totalStudied) * 100)}%`);
    }
    console.log(`当前连胜: ${stats.currentStreak}`);
    console.log('=============================');
  }

  /**
   * Prompt user with a question and return the answer
   * @param {string} question - Question to ask
   * @returns {Promise<string>} User's answer
   */
  question(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  /**
   * Close the readline interface
   */
  close() {
    this.rl.close();
  }

  /**
   * Ask user for file path
   * @returns {Promise<string>} File path
   */
  async getFileInput() {
    const filePath = await this.question('请输入单词库文件路径 (例如: ./data/words.txt): ');
    return filePath.trim();
  }

  /**
   * Show welcome message
   */
  showWelcome() {
    console.log('欢迎使用背单词应用！');
    console.log('基于莱特纳盒子记忆法，助您高效记忆英语单词。');
  }
}

module.exports = QuizRenderer;