import React, { useState, useEffect, useRef } from 'react';
import ChineseSemanticService from '../../services/chineseSemanticService';

const TranslationQuiz = ({ question, onSubmit, onNextQuestion }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const inputRef = useRef(null);
  const startTime = useRef();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    startTime.current = Date.now();
    
    // 检查模型是否已加载
    const checkModelReady = () => {
      if (ChineseSemanticService.isReady()) {
        setModelReady(true);
      } else {
        // 等待模型加载
        const interval = setInterval(() => {
          if (ChineseSemanticService.isReady()) {
            setModelReady(true);
            clearInterval(interval);
          }
        }, 500);
        
        return () => clearInterval(interval);
      }
    };
    
    checkModelReady();
  }, [question]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userAnswer.trim() || isProcessing) return;

    setShowFeedback(true);
    setIsProcessing(true);
    const normalizedUserAnswer = userAnswer.trim();
    const normalizedCorrectAnswer = question.answer.trim();
    
    try {
      // Use Chinese semantic service for more advanced evaluation
      const similarityScore = await ChineseSemanticService.compareSimilarity(
        normalizedUserAnswer, 
        normalizedCorrectAnswer
      );
      
      // Consider correct if similarity is above threshold (0.8)
      const correct = similarityScore >= 0.8;
      
      // Check if it's an exact match vs. semantic match
      const exactMatch = normalizedUserAnswer === normalizedCorrectAnswer;
      const isSynonym = correct && !exactMatch;
      
      setIsCorrect(correct);
      
      onSubmit({
        answer: userAnswer.trim(),
        correct,
        isSynonym,
        similarityScore,
        timeToAnswer: Date.now() - startTime.current
      });
    } catch (error) {
      console.error('计算语义相似度失败:', error);
      // 如果模型计算失败，使用简单的字符串比较
      const exactMatch = normalizedUserAnswer === normalizedCorrectAnswer;
      setIsCorrect(exactMatch);
      
      onSubmit({
        answer: userAnswer.trim(),
        correct: exactMatch,
        isSynonym: false,
        similarityScore: exactMatch ? 1 : 0,
        timeToAnswer: Date.now() - startTime.current
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNextQuestionClick = () => {
    setShowFeedback(false);
    setUserAnswer('');
    onNextQuestion();
  };

  const getFeedbackMessage = () => {
    if (isCorrect) {
      const exactMatch = userAnswer.trim() === question.answer.trim();
      if (exactMatch) {
        return { message: '完全正确！', color: 'text-green-600' };
      } else {
        return { 
          message: `语义正确！"${userAnswer.trim()}" 与 "${question.answer}" 含义相近`, 
          color: 'text-green-600' 
        };
      }
    } else {
      return { 
        message: `不正确。正确答案是: ${question.answer}`, 
        color: 'text-red-600' 
      };
    }
  };



  return (
    <div className="space-y-8">
      {/* Quiz Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-50 mb-4">翻译题</h2>
         <p className="text-gray-100 mb-8">请将下列英文单词翻译成中文 (支持语义匹配)</p>
      </div>

      {/* English Word Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-12 rounded-xl mb-6 border border-blue-100">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6 flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            英文单词
          </p>
          <p className="text-5xl font-bold text-indigo-600 mb-6 tracking-wide">
            {question.english}
          </p>
          
          {/* Pronunciation hint (placeholder) */}
          <p className="text-sm text-gray-500 italic mb-4">
            [音标: /{question.english.toLowerCase().replace(/ /g, ' ')}/]
          </p>
        </div>
      </div>



      {/* Answer Form */}
      {!showFeedback && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-100 mb-2">
              中文翻译
            </label>
            <div className="relative">
              <textarea
                ref={inputRef}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 bg-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-lg font-medium transition-all duration-300 resize-none"
                placeholder="请输入中文翻译..."
                rows={3}
                disabled={showFeedback}
              />
              
              {/* Character count */}
              <div className="absolute right-4 bottom-4 text-sm text-gray-400">
                {userAnswer.trim().length} 字符
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              disabled={!userAnswer.trim() || showFeedback || isProcessing || !modelReady}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isProcessing ? '处理中...' : !modelReady ? '加载模型中...' : '提交翻译'}
            </button>
            
            <button
              type="button"
              onClick={() => setUserAnswer('')}
              disabled={showFeedback}
              className="px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300"
            >
              清空
            </button>
          </div>
        </form>
      )}

      {/* Feedback Display */}
      {showFeedback && (
        <div className={`text-center p-8 rounded-xl border-2 ${
          isCorrect 
            ? 'bg-green-50 border-green-300' 
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-center justify-center mb-4">
            {isCorrect ? (
              <svg className="w-16 h-16 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className={`text-xl font-semibold mb-2 ${getFeedbackMessage().color}`}>
            {getFeedbackMessage().message}
          </p>
          
          {/* Detailed feedback */}
          <div className="mt-4 space-y-2">
            {!isCorrect && (
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600 mb-2">你的答案: <span className="font-medium">{userAnswer}</span></p>
                <p className="text-sm text-gray-600">正确答案: <span className="font-medium text-green-600">{question.answer}</span></p>
              </div>
            )}
            
             {isCorrect && userAnswer.trim() !== question.answer.trim() && (
               <div className="p-4 bg-green-100 rounded-lg">
                 <p className="text-sm text-green-800">
                   你使用了语义相近的表达 "{userAnswer.trim()}"，完全正确！
                 </p>
               </div>
             )}
            

          </div>
          
          {/* Next Question Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleNextQuestionClick}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              下一题
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationQuiz;