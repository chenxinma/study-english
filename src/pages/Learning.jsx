import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import MatchingQuiz from '../components/Quiz/MatchingQuiz';
import FillInQuiz from '../components/Quiz/FillInQuiz';
import TranslationQuiz from '../components/Quiz/TranslationQuiz';

const LearningPage = () => {
  const { startQuiz, submitAnswer, moveToNextQuestion, currentQuiz, learningProgress } = useApp();
  const [quizType, setQuizType] = useState('random');
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    // Auto-start quiz when component mounts
    if (!isStarted) {
      handleStartQuiz();
    }
  }, [quizType]);

  const handleStartQuiz = () => {
    const quiz = startQuiz(quizType);
    if (quiz) {
      setIsStarted(true);
    } else {
      alert('没有可用的单词进行练习，请先导入单词库！');
    }
  };

  const handleAnswerSubmit = async (answer) => {
    await submitAnswer(answer);
  };

  const handleNextQuestion = () => {
    moveToNextQuestion();
  };

  const handleQuizComplete = () => {
    setIsStarted(false);
    handleStartQuiz(); // Start new quiz
  };

  const renderCurrentQuestion = () => {
    if (!currentQuiz || learningProgress.showResults) {
      return null;
    }
    
    const currentQuestion = currentQuiz.questions[learningProgress.currentQuestion];
    
    switch (currentQuiz.type) {
      case 'matching':
        return (
          <MatchingQuiz 
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
          />
        );
      case 'fill-in':
        return (
          <FillInQuiz 
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
            onNextQuestion={handleNextQuestion}
          />
        );
      case 'translation':
        return (
          <TranslationQuiz 
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
            onNextQuestion={handleNextQuestion}
          />
        );
      default:
        return (
          <MatchingQuiz 
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
          />
        );
    }
  };

  const renderResults = () => {
    if (!learningProgress.showResults) return null;

    const correctAnswers = learningProgress.userAnswers.filter(answer => answer.correct).length;
    const totalQuestions = learningProgress.userAnswers.length;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="glass-morphism rounded-2xl p-8 text-white text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">
            {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : '💪'}
          </div>
          <h2 className="text-3xl font-bold mb-2">练习完成！</h2>
          <p className="text-xl text-white/80">
            正确率: {accuracy}% ({correctAnswers}/{totalQuestions})
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {learningProgress.userAnswers.map((answer, index) => (
            <div key={index} className={`p-4 rounded-xl ${answer.correct ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm">{answer.question.word?.english}</span>
                <span className={`text-lg ${answer.correct ? 'text-green-400' : 'text-red-400'}`}>
                  {answer.correct ? '✓' : '✗'}
                </span>
              </div>
              <div className="text-xs text-white/70 mt-1">
                {answer.question.word?.chinese}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleQuizComplete}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
          >
            继续练习
          </button>
          <button
            onClick={() => setIsStarted(false)}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-300"
          >
            返回
          </button>
        </div>
      </div>
    );
  };

  if (!isStarted) {
    return (
      <div className="space-y-8">
        <div className="glass-morphism rounded-2xl p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-4">智能学习模式</h1>
          <p className="text-lg text-white/80 mb-8">选择练习类型，开始你的学习之旅</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => setQuizType('matching')}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                quizType === 'matching' 
                  ? 'border-purple-400 bg-purple-500/20' 
                  : 'border-white/20 bg-white/10 hover:bg-white/20'
              }`}
            >
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-bold mb-2">配对练习</h3>
              <p className="text-sm text-white/70">中英文配对，加深记忆</p>
            </button>
            
            <button
              onClick={() => setQuizType('fillIn')}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                quizType === 'fillIn' 
                  ? 'border-purple-400 bg-purple-500/20' 
                  : 'border-white/20 bg-white/10 hover:bg-white/20'
              }`}
            >
              <div className="text-2xl mb-2">✍️</div>
              <h3 className="font-bold mb-2">填空练习</h3>
              <p className="text-sm text-white/70">根据提示拼写单词</p>
            </button>
            
            <button
              onClick={() => setQuizType('translation')}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                quizType === 'translation' 
                  ? 'border-purple-400 bg-purple-500/20' 
                  : 'border-white/20 bg-white/10 hover:bg-white/20'
              }`}
            >
              <div className="text-2xl mb-2">🌐</div>
              <h3 className="font-bold mb-2">翻译练习</h3>
              <p className="text-sm text-white/70">英文翻译成中文</p>
            </button>
          </div>
          
          <button
            onClick={handleStartQuiz}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            开始练习
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      {currentQuiz && !learningProgress.showResults && (
        <div className="glass-morphism rounded-2xl p-4 text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">进度</span>
            <span className="text-sm">
              {learningProgress.currentQuestion + 1} / {currentQuiz.questions.length}
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((learningProgress.currentQuestion + 1) / currentQuiz.questions.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Quiz Content */}
      {renderResults() || renderCurrentQuestion()}
    </div>
  );
};

export default LearningPage;