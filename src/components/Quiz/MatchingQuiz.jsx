import React, { useState, useEffect } from 'react';

const MatchingQuiz = ({ question, onSubmit }) => {
  const [selectedChinese, setSelectedChinese] = useState(null);
  const [selectedEnglish, setSelectedEnglish] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Reset state when question changes
    setSelectedChinese(null);
    setSelectedEnglish(null);
    setMatchedPairs([]);
    setShowFeedback(false);
  }, [question]);

  const handleChineseClick = (index) => {
    if (matchedPairs.some(pair => pair.chineseIndex === index)) return;
    setSelectedChinese(index);
  };

  const handleEnglishClick = (index) => {
    if (matchedPairs.some(pair => pair.englishIndex === index)) return;
    setSelectedEnglish(index);
  };

  const handleMatch = () => {
    if (selectedChinese !== null && selectedEnglish !== null) {
      const pair = {
        chineseIndex: selectedChinese,
        englishIndex: selectedEnglish,
        chineseText: question.chineseOptions[selectedChinese],
        englishText: question.englishOptions[selectedEnglish]
      };

      const newMatchedPairs = [...matchedPairs, pair];
      setMatchedPairs(newMatchedPairs);
      
      // Check if this is the last pair
      if (newMatchedPairs.length === Math.min(question.chineseOptions.length, question.englishOptions.length)) {
        // Verify all pairs are correct
        const allCorrect = newMatchedPairs.every(pair => 
          question.answerKey[pair.chineseIndex] === pair.englishIndex
        );
        
        setIsCorrect(allCorrect);
        setShowFeedback(true);
        
        setTimeout(() => {
          onSubmit({
            answer: {
              matchedPairs: newMatchedPairs,
              answerKey: question.answerKey
            },
            correct: allCorrect
          });
        }, 2000);
      }
      
      setSelectedChinese(null);
      setSelectedEnglish(null);
    }
  };

  const handleReset = () => {
    setSelectedChinese(null);
    setSelectedEnglish(null);
  };

  const getRowStyle = (chineseIndex, englishIndex) => {
    const isMatched = matchedPairs.some(pair => 
      pair.chineseIndex === chineseIndex || pair.englishIndex === englishIndex
    );
    
    if (isMatched) {
      const matchedPair = matchedPairs.find(pair => 
        pair.chineseIndex === chineseIndex || pair.englishIndex === englishIndex
      );
      const isCorrectMatch = question.answerKey[matchedPair.chineseIndex] === matchedPair.englishIndex;
      return isCorrectMatch 
        ? 'bg-green-100 border-green-300 text-green-800' 
        : 'bg-red-100 border-red-300 text-red-800';
    }
    
    const isSelected = selectedChinese === chineseIndex || selectedEnglish === englishIndex;
    return isSelected 
      ? 'bg-yellow-100 border-yellow-400 text-yellow-900 scale-105 shadow-lg' 
      : 'bg-white border-gray-200 hover:shadow-md hover:scale-102';
  };

  return (
    <div className="space-y-8">
      {/* Quiz Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-stone-50 mb-4">单词配对题</h2>
        <p className="text-stone-50 mb-6">将左边的中文与右边的英文进行配对，点击两边进行匹配</p>
        
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {question.chineseOptions.map((_, index) => (
            <div 
              key={index}
              className={`w-8 h-8 rounded-full ${
                matchedPairs.some(pair => pair.chineseIndex === index)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              } flex items-center justify-center text-sm font-medium`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Matching Grid */}
      <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Chinese Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-50 flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            中文
          </h3>
          <div className="space-y-3">
            {question.chineseOptions.map((text, index) => (
              <div
                key={`chinese-${index}`}
                className={`p-4 rounded-lg font-medium text-gray-800 border-2 transition-all duration-300 cursor-pointer ${getRowStyle(index, -1)}`}
                onClick={() => handleChineseClick(index)}
              >
                <div className="flex items-center justify-between">
                  <span>{text}</span>
                  {matchedPairs.some(pair => pair.chineseIndex === index) && (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* English Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-50 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            English
          </h3>
          <div className="space-y-3">
            {question.englishOptions.map((text, index) => (
              <div
                key={`english-${index}`}
                className={`p-4 rounded-lg font-medium text-gray-800 border-2 transition-all duration-300 cursor-pointer ${getRowStyle(-1, index)}`}
                onClick={() => handleEnglishClick(index)}
              >
                <div className="flex items-center justify-between">
                  <span>{text}</span>
                  {matchedPairs.some(pair => pair.englishIndex === index) && (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleMatch}
          disabled={selectedChinese === null || selectedEnglish === null || showFeedback}
          className="px-8 py-3 bg-gradient-to-r from-stone-500 to-green-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {matchedPairs.length === Math.min(question.chineseOptions.length, question.englishOptions.length) - 1 
            ? '完成配对' 
            : '确认配对'
          }
        </button>
        
        <button
          onClick={handleReset}
          disabled={showFeedback}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300"
        >
          重新选择
        </button>
      </div>

      {/* Feedback Display */}
      {showFeedback && (
        <div className={`text-center p-6 rounded-xl ${
          isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'
        }`}>
          <div className="flex items-center justify-center mb-2">
            {isCorrect ? (
              <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className={`text-lg font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? '配对完全正确！' : '配对有误，请查看答案'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MatchingQuiz;