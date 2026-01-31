import React, { useState, useEffect, useRef } from 'react';

const FillInQuiz = ({ question, onSubmit, onNextQuestion }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [currentHint, setCurrentHint] = useState(question.hint);
  const inputRef = useRef(null);
  const startTime = useRef();

  useEffect(() => {
    // Focus input when component mounts or question changes
    if (inputRef.current) {
      inputRef.current.focus();
    }
    startTime.current = Date.now();
    setUserAnswer('');
    setShowFeedback(false);
    setIsCorrect(false);
    setAttempts(0);
    setHints(0);
    setCurrentHint(question.hint);
  }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userAnswer.trim()) return;

    setShowFeedback(true);
    const correctAnswer = question.answer.toLowerCase().trim();
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    
    // Handle answer checking for multiple words separated by ; or /
    let correct = normalizedUserAnswer === correctAnswer;
    
    // If not an exact match, check if the user answered any of the valid options
    if (!correct) {
      const answerOptions = correctAnswer.split(/[/;]/).map(option => option.trim());
      correct = answerOptions.includes(normalizedUserAnswer);
    }
    
    setIsCorrect(correct);
    setAttempts(attempts + 1);
    
    onSubmit({
      answer: userAnswer.trim(),
      correct,
      attempts: attempts + 1,
      hints: hints,
      timeToAnswer: Date.now() - startTime.current
    });
  };

  const handleNextQuestionClick = () => {
    setShowFeedback(false);
    setUserAnswer('');
    onNextQuestion();
  };

  const getHint = () => {
    if (hints >= 2) return; // Max 2 hints
    
    setHints(hints + 1);
    
    // Split the answer by semicolon or forward slash
    const answer = question.answer.toLowerCase();
    const parts = answer.split(/[/;]/);
    console.log("parts:", parts);
    let newHint = '';
    
    if (hints === 0) {
      // First hint: show first letter + more underscores for each part
      newHint = parts.map(part => {
        if (part.length === 1) {
          return part; // If single character, just show it
        }
        return part[0] + '_'.repeat(part.length - 2) + part[part.length - 1];
      }).join(answer.includes(';') ? ';' : '/');
    } else if (hints === 1) {
      // Second hint: show first two letters and last letter for each part
      newHint = parts.map(part => {
        if (part.length === 1) {
          return part; // If single character, just show it
        } else if (part.length === 2) {
          return part; // If two characters, show both
        }
        return part.substring(0, 2) + '_'.repeat(part.length - 3) + part[part.length - 1];
      }).join(answer.includes(';') ? ';' : '/');
    }
    
    setCurrentHint(newHint);
  };

  const getFeedbackMessage = () => {
    if (isCorrect) {
      if (attempts === 0) {
        return { message: '完美！一次就答对了！', color: 'text-green-600' };
      } else if (hints === 0) {
        return { message: '答对了！继续加油！', color: 'text-green-600' };
      } else {
        return { message: `答对了！使用了 ${hints} 个提示`, color: 'text-green-600' };
      }
    } else {
      return { 
        message: `正确答案是: ${question.fullWord}`, 
        color: 'text-red-600' 
      };
    }
  };

  const getCharacterClass = (index, char) => {
    // Handle separator characters (; or /) specially
    if (char === ';' || char === '/') {
      return 'text-gray-600 font-bold border-b-2 border-transparent w-6 text-center';
    }
    
    if (char === '_') {
      return 'text-gray-400 border-b-2 border-gray-300 w-8 text-center';
    }
    
    // Count non-separator characters in the hint string up to the current position
    let letterIndex = 0;
    for (let i = 0; i < index; i++) {
      const hintChar = currentHint[i];
      if (hintChar !== ';' && hintChar !== '/') {
        letterIndex++;
      }
    }
    
    // Now find the corresponding position in the original answer
    const answer = question.fullWord;
    const parts = answer.split(/[/;]/);
    
    // Map the letterIndex to the correct part and position within that part
    let currentLetterIndex = 0;
    for (const part of parts) {
      if (letterIndex >= currentLetterIndex && letterIndex < currentLetterIndex + part.length) {
        // This character belongs to this part
        const posInPart = letterIndex - currentLetterIndex;
        
        let shouldBeCorrect = false;
        if (hints === 1) {
          shouldBeCorrect = posInPart === 0 || posInPart === part.length - 1;
        } else if (hints === 2) {
          shouldBeCorrect = posInPart === 0 || posInPart === 1 || posInPart === part.length - 1;
        }
        
        return shouldBeCorrect 
          ? 'text-blue-600 font-bold border-b-2 border-blue-400 w-8 text-center' 
          : 'text-gray-400 border-b-2 border-gray-300 w-8 text-center';
      }
      currentLetterIndex += part.length;
    }
    
    return 'text-gray-400 border-b-2 border-gray-300 w-8 text-center'; // fallback
  };

  return (
    <div className="space-y-8">
      {/* Quiz Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-50 mb-4">填空题</h2>
        <p className="text-gray-100 mb-8">根据中文释义和字母提示填写完整英文单词</p>
      </div>

      {/* Question Card */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl mb-6 border border-purple-100">
        <div className="mb-6">
          <p className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            中文释义
          </p>
          <p className="text-2xl font-bold text-purple-600 mb-6">{question.chinese}</p>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600 mb-4">字母提示 (点击获取更多提示)</p>
          
          {/* Visual Hint Display */}
          <div onClick={getHint} className="cursor-pointer hover:bg-purple-100 transition-colors p-4 rounded-lg">
            <p className="text-4xl font-mono font-bold text-purple-700 tracking-widest">
              {currentHint.split('').map((char, index) => (
                <span key={index} className={getCharacterClass(index, char)}>
                  {char === '_' ? '_' : char}
                </span>
              ))}
            </p>
            <p className="text-sm text-gray-500 mt-2 flex items-center justify-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {hints === 0 && '点击获取提示'} 
              {hints === 1 && '再次点击获取更多提示'}
              {hints === 2 && '已显示所有提示'}
            </p>
          </div>
        </div>
      </div>

      {/* Answer Form */}
      {!showFeedback && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-lg font-medium text-gray-100 mb-2">
              你的答案
              {attempts > 0 && (
                <span className="ml-2 text-sm text-gray-500">(尝试次数: {attempts})</span>
              )}
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 bg-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-lg font-medium transition-all duration-300"
                placeholder="请输入英文单词..."
                disabled={showFeedback}
              />
              
              {/* Visual feedback for input length */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                {userAnswer.length} / {question.fullWord.length} 字符
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              disabled={!userAnswer.trim() || showFeedback}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              提交答案
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
            ? 'bg-green-50 border-green-300 animate-success-pulse' 
            : 'bg-red-50 border-red-300 animate-error-shake'
        }`}>
          <div className="flex items-center justify-center mb-4">
            {isCorrect ? (
              <svg className="w-16 h-16 text-green-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
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
          
          {!isCorrect && (
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600 mb-2">你的答案: <span className="font-medium">{userAnswer}</span></p>
              <p className="text-sm text-gray-600">正确答案: <span className="font-medium text-green-600">{question.fullWord}</span></p>
            </div>
          )}
          
          {/* Next Question Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleNextQuestionClick}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              下一题
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FillInQuiz;