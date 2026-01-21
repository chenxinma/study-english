# React + TailwindCSS Web Version Design Document

## Overview

This document outlines the design for converting the command-line背单词 application to a modern, responsive web application built with React and TailwindCSS. The design leverages the existing UI elements from `/docs/ui/` and integrates them with the core functionality from `src/app.js`.

## Architecture

### Tech Stack
- **Frontend Framework**: React 18+ with Hooks
- **Styling**: TailwindCSS v3+
- **State Management**: React Context API or Redux Toolkit
- **Routing**: React Router v6+
- **Data Visualization**: Chart.js with react-chartjs-2 wrapper
- **Build Tool**: Vite or Create React App

### Component Structure
```
src/
├── components/           # Reusable UI components
│   ├── Layout/          # Main layout components
│   ├── Cards/           # Feature cards, stat cards
│   ├── Forms/           # Input forms
│   ├── Quiz/            # Quiz components
│   └── Charts/          # Chart components
├── pages/               # Main page components
│   ├── Home.jsx         # Main dashboard
│   ├── Learning.jsx     # Learning interface
│   └── Statistics.jsx   # Statistics dashboard
├── hooks/               # Custom React hooks
├── contexts/            # React Context providers
├── services/            # Web adaptation layer (not replacement)
│   ├── webLeitnerBox.js # Web wrapper for leitnerBox.js
│   ├── webWordManager.js# Web wrapper for wordManager.js
│   ├── webQuizEngine.js # Web wrapper for quizEngine.js
│   └── webStorage.js    # Browser storage adapter
├── core/                # Reused core logic (from src/core/)
│   ├── leitnerBox.js    # Leitner box algorithm
│   ├── quizEngine.js    # Quiz generation logic
│   └── wordManager.js   # Word management logic
├── models/              # Reused data models (from src/models/)
│   └── word.js          # Word data model
├── utils/               # Utility functions
└── assets/              # Static assets
```

## Core Components Design

### 1. Main Layout (`components/Layout/MainLayout.jsx`)
```jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800">
      {/* Glassmorphism header */}
      <header className="glass-morphism p-4 sm:p-6 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">智能背单词系统</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/" className="hover:opacity-80 transition">首页</a></li>
              <li><a href="/learning" className="hover:opacity-80 transition">学习</a></li>
              <li><a href="/statistics" className="hover:opacity-80 transition">统计</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
```

### 2. Dashboard Page (`pages/Home.jsx`)
```jsx
import React from 'react';
import FeatureCard from '../components/Cards/FeatureCard';
import StatCard from '../components/Cards/StatCard';

const HomePage = () => {
  const stats = {
    wordsToReview: 12,
    accuracyRate: 82,
    totalWords: 234,
    studiedWords: 156
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glass-morphism rounded-2xl p-8 text-white text-center animate-fade-in">
        <div className="floating-icon inline-block mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">智能背单词系统</h1>
        <p className="text-lg text-white/90 mb-2">基于莱特纳盒子算法的科学记忆方法</p>
        <p className="text-white/70">高效记忆 · 智能复习 · 持久学习</p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          icon="play" 
          title="开始学习" 
          description="进入智能学习模式，系统会根据你的记忆情况推荐合适的单词进行复习。支持多种题型训练。"
          buttonText="立即开始"
          onClick={() => navigate('/learning')}
          stat={{ label: '今日待复习', value: stats.wordsToReview }}
        />
        
        <FeatureCard 
          icon="chart" 
          title="学习统计" 
          description="查看详细的学习数据和进度分析。了解你的学习模式，优化复习策略。"
          buttonText="查看统计"
          onClick={() => navigate('/statistics')}
          stat={{ label: '正确率', value: `${stats.accuracyRate}%` }}
        />
        
        <FeatureCard 
          icon="upload" 
          title="导入单词" 
          description="从TXT文件导入新单词库。支持'中文-英文'格式，自动整理并加入你的学习计划。"
          buttonText="选择文件"
          onClick={handleImportClick}
          stat={{ label: '词汇总数', value: stats.totalWords }}
        />
      </div>

      {/* Quick Stats */}
      <div className="glass-morphism rounded-2xl p-6 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <StatCard value="156" label="已学习单词" />
          <StatCard value="82%" label="学习正确率" />
          <StatCard value="7" label="连续学习天数" />
          <StatCard value="⚡" label="当前状态: 优秀" />
        </div>
      </div>

      {/* Learning Tips */}
      <div className="glass-morphism rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <h3 className="font-semibold mb-1">今日学习建议</h3>
            <p className="text-white/80 text-sm">盒子2中有38个进阶单词需要重点关注，建议今天重点复习这些内容以提升整体掌握度。</p>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 3. Practice Mode Interaction Design

The web version implements three distinct practice modes with rich interaction experiences:

#### Mode 1: 配对题型 (Matching Quiz) - 抽取5个单词，打乱中英文顺序让用户进行配对

**Interaction Design:**
```jsx
// components/Quiz/MatchingQuiz.jsx
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
        <h2 className="text-3xl font-bold text-gray-800 mb-4">单词配对题</h2>
        <p className="text-gray-600 mb-6">将左边的中文与右边的英文进行配对，点击两边进行匹配</p>
        
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
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
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
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
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
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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
```

#### Mode 2: 填空题型 (Fill-in Quiz) - 给出中文释义和部分字母提示，要求填写完整的英文单词

**Interaction Design:**
```jsx
// components/Quiz/FillInQuiz.jsx
import React, { useState, useEffect, useRef } from 'react';

const FillInQuiz = ({ question, onSubmit }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input when component mounts or question changes
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userAnswer.trim()) return;

    setShowFeedback(true);
    const correctAnswer = question.answer.toLowerCase().trim();
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    
    const correct = normalizedUserAnswer === correctAnswer;
    setIsCorrect(correct);
    
    setAttempts(attempts + 1);
    
    setTimeout(() => {
      onSubmit({
        answer: userAnswer.trim(),
        correct,
        attempts: attempts + 1,
        hints: hints,
        timeToAnswer: Date.now() - (startTime || Date.now())
      });
    }, 2000);
  };

  const getHint = () => {
    if (hints >= 2) return; // Max 2 hints
    
    setHints(hints + 1);
    
    const answer = question.answer.toLowerCase();
    let newHint = '';
    
    if (hints === 0) {
      // First hint: show first letter + more underscores
      newHint = answer[0] + '_'.repeat(answer.length - 2) + answer[answer.length - 1];
    } else if (hints === 1) {
      // Second hint: show first two letters and last letter
      newHint = answer.substring(0, 2) + '_'.repeat(answer.length - 3) + answer[answer.length - 1];
    }
    
    // Update hint display (this would normally come from parent state)
    console.log('Showing hint:', newHint);
  };

  const getFeedbackMessage = () => {
    if (isCorrect) {
      if (attempts === 1) {
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
    const answer = question.fullWord;
    
    if (char === '_') {
      return 'text-gray-400 border-b-2 border-gray-300 w-6 text-center';
    }
    
    let shouldBeCorrect = false;
    if (hints === 1) {
      shouldBeCorrect = index === 0 || index === answer.length - 1;
    } else if (hints === 2) {
      shouldBeCorrect = index === 0 || index === 1 || index === answer.length - 1;
    }
    
    return shouldBeCorrect 
      ? 'text-blue-600 font-bold border-b-2 border-blue-400 w-6 text-center' 
      : 'text-gray-400 border-b-2 border-gray-300 w-6 text-center';
  };

  return (
    <div className="space-y-8">
      {/* Quiz Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">填空题</h2>
        <p className="text-gray-600 mb-8">根据中文释义和字母提示填写完整英文单词</p>
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
              {question.hint.split('').map((char, index) => (
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
            <label className="block text-lg font-medium text-gray-700 mb-2">
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
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-lg font-medium transition-all duration-300"
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
        </div>
      )}
    </div>
  );
};
```

#### Mode 3: 翻译题型 (Translation Quiz) - 给出英文单词，要求写出中文释义

**Interaction Design:**
```jsx
// components/Quiz/TranslationQuiz.jsx
import React, { useState, useEffect, useRef } from 'react';

const TranslationQuiz = ({ question, onSubmit }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [synonyms, setSynonyms] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [question]);

  useEffect(() => {
    // Generate synonyms for this word
    const generateSynonyms = () => {
      const synonymMap = {
        '点心': ['零食', '小食', '小吃', '甜点', '糕点'],
        '零食': ['点心', '小食', '小吃'],
        '电脑': ['计算机', '电脑设备'],
        '手机': ['移动电话', '移动设备'],
        '汽车': ['车', '轿车', '车辆'],
        '书': ['书籍', '书本', '图书'],
        '水': ['饮用水', '清水'],
        '学习': ['读书', '学习知识'],
        '工作': ['上班', '工作'],
        '家': ['家庭', '住宅']
      };
      
      return synonymMap[question.answer] || [];
    };
    
    setSynonyms(generateSynonyms());
  }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userAnswer.trim()) return;

    setShowFeedback(true);
    const normalizedUserAnswer = userAnswer.trim();
    const normalizedCorrectAnswer = question.answer.trim();
    
    // Check for exact match or synonym
    let correct = normalizedUserAnswer === normalizedCorrectAnswer;
    
    if (!correct && synonyms.length > 0) {
      correct = synonyms.includes(normalizedUserAnswer);
    }
    
    setIsCorrect(correct);
    
    setTimeout(() => {
      onSubmit({
        answer: userAnswer.trim(),
        correct,
        isSynonym: correct && normalizedUserAnswer !== normalizedCorrectAnswer,
        synonyms: synonyms
      });
    }, 3000);
  };

  const getFeedbackMessage = () => {
    if (isCorrect) {
      const exactMatch = userAnswer.trim() === question.answer.trim();
      if (exactMatch) {
        return { message: '完全正确！', color: 'text-green-600' };
      } else {
        return { 
          message: `正确！"${userAnswer.trim()}" 是 "${question.answer}" 的同义词`, 
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

  const toggleAlternatives = () => {
    setShowAlternatives(!showAlternatives);
  };

  return (
    <div className="space-y-8">
      {/* Quiz Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">翻译题</h2>
        <p className="text-gray-600 mb-8">请将下列英文单词翻译成中文 (支持同义词)</p>
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
            [音标: /ənˈɡlɪʃ wɜːrd/]
          </p>
        </div>
      </div>

      {/* Synonyms Hint Card */}
      {synonyms.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">
                提示：该词有 {synonyms.length} 个常见同义词
              </span>
            </div>
            <button
              onClick={toggleAlternatives}
              className="text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
            >
              {showAlternatives ? '隐藏同义词' : '显示同义词'}
            </button>
          </div>
          
          {showAlternatives && (
            <div className="mt-3 flex flex-wrap gap-2">
              {synonyms.map((synonym, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-white border border-yellow-300 rounded-full text-sm text-yellow-800"
                >
                  {synonym}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Answer Form */}
      {!showFeedback && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              中文翻译
            </label>
            <div className="relative">
              <textarea
                ref={inputRef}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-lg font-medium transition-all duration-300 resize-none"
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
              disabled={!userAnswer.trim() || showFeedback}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              提交翻译
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
            
            {isCorrect && synonyms.length > 0 && userAnswer.trim() !== question.answer.Trim() && (
              <div className="p-4 bg-green-100 rounded-lg">
                <p className="text-sm text-green-800">
                  你使用了同义词 "{userAnswer.trim()}"，完全正确！
                </p>
              </div>
            )}
            
            {synonyms.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">该词的其他正确翻译：</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[question.answer, ...synonyms].filter((word, index, arr) => 
                    arr.indexOf(word) === index || word.trim().toLowerCase() !== userAnswer.trim().toLowerCase()
                  ).map((synonym, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-white border border-blue-200 rounded-full text-sm text-blue-800"
                    >
                      {synonym}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
```

### 4. Statistics Dashboard (`pages/Statistics.jsx`)
```jsx
import React, { useState, useEffect } from 'react';
import BoxChart from '../components/Charts/BoxChart';
import ProgressChart from '../components/Charts/ProgressChart';
import AchievementBadge from '../components/Cards/AchievementBadge';

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    const loadedStats = await statisticsService.getStats();
    setStats(loadedStats);
  };

  const handleExportStats = () => {
    statisticsService.exportStats();
  };

  if (!stats) {
    return <div className="text-white text-center py-10">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-morphism rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">学习统计</h1>
            <p className="text-white/80">跟踪你的学习进度和成就</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/learning')}
              className="nav-button px-6 py-2 rounded-lg text-white font-medium hover:text-white"
            >
              返回学习
            </button>
            <button 
              onClick={handleExportStats}
              className="nav-button px-6 py-2 rounded-lg text-white font-medium hover:text-white"
            >
              导出统计
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon="book" 
          value={stats.totalStudied} 
          label="总学习单词" 
          trend="+12%" 
          trendColor="text-green-500"
        />
        
        <StatCard 
          icon="check" 
          value={`${stats.correctRate}%`} 
          label="正确率" 
          trend="优秀" 
          trendColor="text-green-500"
        />
        
        <StatCard 
          icon="fire" 
          value={stats.currentStreak} 
          label="连续正确" 
          trend="连续!" 
          trendColor="text-orange-500"
        />
        
        <StatCard 
          icon="folder" 
          value={stats.totalWords} 
          label="单词总数" 
          trend="活跃" 
          trendColor="text-blue-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 stat-card p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">莱特纳盒子分布</h2>
          <div className="h-80">
            <BoxChart data={stats.boxDistribution} />
          </div>
          <BoxDistributionDetails distribution={stats.boxDistribution} />
        </div>

        <div className="stat-card p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">成就徽章</h2>
          <AchievementList achievements={stats.achievements} />
          
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">学习建议</h3>
            <p className="text-sm text-gray-600">{stats.learningTip}</p>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="stat-card p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">学习进度趋势</h2>
        <div className="h-80">
          <ProgressChart data={stats.dailyProgress} />
        </div>
      </div>
    </div>
  );
};
```

## Core Logic Integration

### Web Adapters for Core Services

The web version will use adapters to make the existing core logic compatible with browser environment, while preserving all the core algorithms and business logic.

#### Web Leitner Box Adapter (`services/webLeitnerBox.js`)
```javascript
import LeitnerBox from '../core/leitnerBox';
import Word from '../models/word';
import webStorage from './webStorage';

class WebLeitnerBox {
  constructor() {
    this.coreBox = new LeitnerBox();
    this.storageKey = 'leitnerBoxState';
    this.loadState();
  }

  async getNextWords(count) {
    return this.coreBox.getNextWords(count);
  }

  async updateWordStatus(word, correct) {
    this.coreBox.updateWordStatus(word, correct);
    await this.saveState();
  }

  async loadState() {
    try {
      const stateData = webStorage.getItem(this.storageKey);
      if (stateData) {
        const state = JSON.parse(stateData);
        
        // Recreate Word objects from JSON
        if (state.words) {
          state.words.forEach(wordData => {
            const word = Word.fromJSON(wordData);
            this.coreBox.boxes[word.boxNumber].push(word);
          });
        }
        
        this.coreBox.stats = state.stats || {
          totalStudied: 0,
          totalCorrect: 0,
          currentStreak: 0
        };
      }
    } catch (error) {
      console.log('未找到之前的练习状态，开始新的练习');
    }
  }

  async saveState() {
    try {
      const state = {
        words: Object.values(this.coreBox.boxes).flat().map(word => word.toJSON()),
        stats: this.coreBox.stats,
        lastAccessed: new Date().toISOString()
      };
      
      webStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('保存状态失败:', error.message);
    }
  }

  get stats() {
    return this.coreBox.stats;
  }

  getBoxStats(boxNumber) {
    return this.coreBox.getBoxStats(boxNumber);
  }

  getTotalWordCount() {
    return this.coreBox.getTotalWordCount();
  }

  addWords(words) {
    this.coreBox.addWords(words);
    this.saveState();
  }

  // Delegation to core methods
  getWordsForReview = () => this.coreBox.getWordsForReview();
  addWord = (word) => this.coreBox.addWord(word);
  moveWord = (word, targetBox) => this.coreBox.moveWord(word, targetBox);
}

export default new WebLeitnerBox();
```

#### Web Word Manager Adapter (`services/webWordManager.js`)
```javascript
import WordManager from '../core/wordManager';
import Word from '../models/word';

class WebWordManager {
  constructor() {
    this.coreManager = new WordManager();
  }

  /**
   * Load words from browser file upload instead of filesystem
   * @param {File} file - File object from browser file input
   * @returns {Array<Word>} Array of loaded words
   */
  async loadWordsFromFile(file) {
    try {
      const content = await this.readFileContent(file);
      const words = this.parseWordFileContent(content);
      
      this.coreManager.words = words;
      return words;
    } catch (error) {
      throw new Error(`Failed to load words from file: ${error.message}`);
    }
  }

  /**
   * Read file content using FileReader API
   * @param {File} file - File object
   * @returns {Promise<string>} File content
   */
  readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsText(file);
    });
  }

  /**
   * Parse word file content (same logic as existing FileReader)
   * @param {string} content - File content
   * @returns {Array<Word>} Parsed words
   */
  parseWordFileContent(content) {
    const lines = content.split('\n');
    const words = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Support both tab and space separated formats
      const parts = trimmedLine.split(/\t+|\s+/).filter(part => part.length > 0);
      
      if (parts.length >= 2) {
        // Assume first part is Chinese, rest is English
        const chinese = parts[0];
        const english = parts.slice(1).join(' ');
        const word = new Word(chinese, english);
        words.push(word);
      }
    }
    
    return words;
  }

  // Delegate to core methods
  createWord = (chinese, english) => this.coreManager.createWord(chinese, english);
  getRandomWords = (count) => this.coreManager.getRandomWords(count);
  findWordById = (id) => this.coreManager.findWordById(id);
  getAllWords = () => this.coreManager.getAllWords();
  getWordsByBox = (boxNumber) => this.coreManager.getWordsByBox(boxNumber);
  getWordCount = () => this.coreManager.getWordCount();
  removeWordById = (id) => this.coreManager.removeWordById(id);
  clearWords = () => this.coreManager.clearWords();
}

export default new WebWordManager();
```

#### Web Quiz Engine Adapter (`services/webQuizEngine.js`)
```javascript
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
```

#### Web Storage Adapter (`services/webStorage.js`)
```javascript
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
```

## Responsive Design Implementation

### TailwindCSS Configuration (`tailwind.config.js`)
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Noto Sans SC', 'sans-serif'],
      },
      colors: {
        'glass': 'rgba(255, 255, 255, 0.15)',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

## State Management

Using React Context for global state management:

```javascript
// contexts/AppContext.jsx
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

  // Learning session management
  const startLearningSession = async (wordCount = 10) => {
    setIsLoading(true);
    try {
      const wordsForReview = await webLeitnerBox.getNextWords(wordCount);
      
      if (wordsForReview.length === 0) {
        throw new Error('没有需要复习的单词，请先导入单词库');
      }

      const quiz = webQuizEngine.generateRandomQuiz(wordsForReview);
      setCurrentQuiz(quiz);
      setLearningProgress({
        currentQuestion: 0,
        userAnswers: [],
        showResults: false
      });
      
      return quiz;
    } catch (error) {
      console.error('学习会话启动失败:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quiz answer submission
  const submitAnswer = async (userAnswer) => {
    if (!currentQuiz) return;

    const question = currentQuiz.questions[learningProgress.currentQuestion];
    const isCorrect = webQuizEngine.evaluateAnswer(
      userAnswer, 
      question.answer || question.chinese, 
      currentQuiz.type
    );

    // Update word status in core leitner box
    const word = question.word || currentQuiz.words[learningProgress.currentQuestion];
    if (word) {
      await webLeitnerBox.updateWordStatus(word, isCorrect);
    }

    const newAnswers = [...learningProgress.userAnswers, {
      answer: userAnswer,
      correctAnswer: question.answer || question.chinese,
      correct: isCorrect
    }];

    const isLastQuestion = learningProgress.currentQuestion >= currentQuiz.questions.length - 1;

    setLearningProgress({
      currentQuestion: learningProgress.currentQuestion + 1,
      userAnswers: newAnswers,
      showResults: isLastQuestion
    });

    return isCorrect;
  };

  // Import words functionality
  const importWords = async (file) => {
    setIsLoading(true);
    try {
      const importedWords = await webWordManager.loadWordsFromFile(file);
      webLeitnerBox.addWords(importedWords);
      
      return {
        success: true,
        wordCount: importedWords.length,
        words: importedWords
      };
    } catch (error) {
      console.error('单词导入失败:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Export statistics
  const exportStatistics = () => {
    const boxDistribution = [1, 2, 3, 4, 5].map(boxNum => 
      webLeitnerBox.getBoxStats(boxNum).count
    );

    const correctRate = stats.totalStudied > 0 
      ? Math.round((stats.totalCorrect / stats.totalStudied) * 100) 
      : 0;

    const exportData = {
      statistics: {
        ...stats,
        correctRate,
        totalWords: webLeitnerBox.getTotalWordCount(),
        boxDistribution
      },
      exportDate: new Date().toLocaleDateString('zh-CN'),
      learningTips: generateLearningTip(boxDistribution)
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `学习统计_${exportData.exportDate}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return exportData;
  };

  // Generate learning tips based on box distribution
  const generateLearningTip = (distribution) => {
    const maxBoxIndex = distribution.indexOf(Math.max(...distribution)) + 1;
    
    if (maxBoxIndex === 2) {
      return "盒子2中也有不少单词，建议重点复习这些进阶词汇以提升整体掌握度。";
    } else if (maxBoxIndex === 3) {
      return "盒子3中的单词较多，继续保持学习节奏，很快就能进入更高层次的掌握。";
    } else if (distribution[0] > 10) {
      return "盒子1中有较多新单词，建议今天重点学习这些新的词汇。";
    }
    return "继续保持学习节奏，你的进步很稳定！";
  };

  const value = {
    // Services
    services: {
      leitnerBox: webLeitnerBox,
      wordManager: webWordManager,
      quizEngine: webQuizEngine
    },
    
    // State
    stats,
    isLoading,
    currentQuiz,
    learningProgress,
    
    // Actions
    actions: {
      startLearningSession,
      submitAnswer,
      importWords,
      exportStatistics,
      setLoading: setIsLoading,
      resetLearning: () => {
        setCurrentQuiz(null);
        setLearningProgress({
          currentQuestion: 0,
          userAnswers: [],
          showResults: false
        });
      }
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
```

## File Import Functionality

Using the Word model and core logic for file parsing, adapted for browser environment:

```javascript
// hooks/useFileUpload.js
import { useCallback } from 'react';
import { useApp } from '../contexts/AppContext';

export const useFileUpload = () => {
  const { actions: { importWords }, setLoading } = useApp();

  const handleFileUpload = useCallback(async (file) => {
    if (!file) {
      throw new Error('请选择文件');
    }

    if (!file.name.endsWith('.txt')) {
      throw new Error('请选择TXT格式的文件');
    }

    setLoading(true);
    
    try {
      const result = await importWords(file);
      
      if (result.success) {
        return { 
          success: true, 
          count: result.wordCount,
          message: `成功导入 ${result.wordCount} 个单词`
        };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('导入单词失败:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [importWords, setLoading]);

  return { handleFileUpload };
};
```

## Component Integration Examples

### HomePage Component Using Core Logic

```javascript
// pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import FeatureCard from '../components/Cards/FeatureCard';
import StatCard from '../components/Cards/StatCard';

const HomePage = () => {
  const navigate = useNavigate();
  const { stats, services: { leitnerBox }, actions: { importWords }, setLoading } = useApp();

  // Calculate statistics using core services
  const wordsToReview = leitnerBox.getWordsForReview().length;
  const accuracyRate = stats.totalStudied > 0 
    ? Math.round((stats.totalCorrect / stats.totalStudied) * 100) 
    : 0;
  const totalWords = leitnerBox.getTotalWordCount();

  const handleImportClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await importWords(file);
      alert(result.success ? result.message : result.error);
    } catch (error) {
      alert(`导入失败: ${error.message}`);
    }
    
    // Reset file input
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header - same as before */}
      <div className="glass-morphism rounded-2xl p-8 text-white text-center animate-fade-in">
        {/* ... header content ... */}
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          icon="play" 
          title="开始学习" 
          description="进入智能学习模式，系统会根据你的记忆情况推荐合适的单词进行复习。支持多种题型训练。"
          buttonText="立即开始"
          onClick={() => navigate('/learning')}
          stat={{ label: '今日待复习', value: wordsToReview }}
        />
        
        <FeatureCard 
          icon="chart" 
          title="学习统计" 
          description="查看详细的学习数据和进度分析。了解你的学习模式，优化复习策略。"
          buttonText="查看统计"
          onClick={() => navigate('/statistics')}
          stat={{ label: '正确率', value: `${accuracyRate}%` }}
        />
        
        <FeatureCard 
          icon="upload" 
          title="导入单词" 
          description="从TXT文件导入新单词库。支持'中文-英文'格式，自动整理并加入你的学习计划。"
          buttonText="选择文件"
          onClick={handleImportClick}
          stat={{ label: '词汇总数', value: totalWords }}
        />
      </div>

      {/* Quick Stats using real data from core */}
      <div className="glass-morphism rounded-2xl p-6 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <StatCard value={stats.totalStudied} label="已学习单词" />
          <StatCard value={`${accuracyRate}%`} label="学习正确率" />
          <StatCard value={stats.currentStreak} label="连续学习天数" />
          <StatCard value="⚡" label="当前状态: 优秀" />
        </div>
      </div>

      {/* Learning Tips based on box distribution */}
      <div className="glass-morphism rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <h3 className="font-semibold mb-1">今日学习建议</h3>
            <p className="text-white/80 text-sm">
              {generateLearningTip([1,2,3,4,5].map(boxNum => leitnerBox.getBoxStats(boxNum).count))}
            </p>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input 
        type="file" 
        id="fileInput" 
        accept=".txt" 
        style={{ display: 'none' }} 
        onChange={handleFileSelect}
      />
    </div>
  );
};
```

### LearningPage Component Using Core Logic

```javascript
// pages/Learning.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import QuizCard from '../components/Quiz/QuizCard';
import ProgressIndicator from '../components/Quiz/ProgressIndicator';
import QuizResults from '../components/Quiz/QuizResults';

const LearningPage = () => {
  const navigate = useNavigate();
  const { 
    currentQuiz, 
    learningProgress, 
    isLoading, 
    actions: { startLearningSession, submitAnswer, resetLearning, setLoading } 
  } = useApp();

  useEffect(() => {
    // Initialize quiz when component mounts
    startLearningSession(10).catch(error => {
      alert(error.message);
      navigate('/');
    });
  }, []);

  const handleAnswerSubmit = async (userAnswer) => {
    try {
      setLoading(true);
      const isCorrect = await submitAnswer(userAnswer);
      
      if (learningProgress.showResults) {
        // Quiz completed, show results
        // Results will be handled by conditional rendering
      }
    } catch (error) {
      console.error('Answer submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestartLearning = () => {
    resetLearning();
    startLearningSession(10);
  };

  if (isLoading && !currentQuiz) {
    return <div className="text-white text-center py-10">加载中...</div>;
  }

  if (learningProgress.showResults) {
    return (
      <QuizResults 
        quiz={currentQuiz}
        userAnswers={learningProgress.userAnswers}
        onRestart={handleRestartLearning}
        onViewStats={() => navigate('/statistics')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with real progress */}
      <div className="glass-morphism rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">背单词学习系统</h1>
          <div className="text-right">
            <p className="text-sm text-white/60">学习进度</p>
            <p className="text-2xl font-bold">
              {learningProgress.currentQuestion + 1} / {currentQuiz?.questions.length || 0}
            </p>
          </div>
        </div>
        <ProgressIndicator 
          current={learningProgress.currentQuestion + 1} 
          total={currentQuiz?.questions.length || 0} 
        />
      </div>

      {/* Quiz Card using core quiz data */}
      <div className="quiz-card p-8 animate-fade-in">
        {currentQuiz && learningProgress.currentQuestion < currentQuiz.questions.length && (
          <QuizCard
            question={currentQuiz.questions[learningProgress.currentQuestion]}
            quizType={currentQuiz.type}
            onSubmit={handleAnswerSubmit}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
};
```

## Deployment Considerations

### Build Configuration
- Use Vite for faster development and builds
- Enable compression and optimization for production
- Implement code splitting for better performance

### Local Storage
- Replace file-based state persistence with localStorage/indexedDB
- Implement proper error handling for storage operations

### Browser Compatibility
- Ensure compatibility with modern browsers (Chrome 88+, Firefox 78+, etc.)
- Provide fallbacks for older browsers where needed

## Core Integration Strategy

### Design Principles

1. **Reuse Core Logic**: All core algorithms (Leitner box, quiz generation, word management) are preserved from `src/core/`
2. **Adapt Don't Replace**: Web adapters adapt existing logic for browser environment without rewriting algorithms
3. **Model Integrity**: The `Word` model from `src/models/word.js` is used directly, ensuring data consistency
4. **Service Layer**: Web adapters provide browser-friendly interfaces while delegating to core services

### Core Logic Reuse

- **Leitner Box Algorithm**: Complete reuse of the 5-box memory system with proper timing intervals
- **Quiz Generation**: All quiz types (matching, fill-in, translation) use the existing `QuizEngine` logic
- **Semantic Matching**: The sophisticated Chinese semantic matching algorithms are preserved
- **Word Model**: The `Word` class with its promotion/demotion methods and review scheduling is used directly
- **Statistics**: All statistical calculations and tracking are handled by the core system

### Web Adaptations

- **Storage**: File-based storage → localStorage/indexedDB via `webStorage.js`
- **File Reading**: Node.js `fs` → Browser FileReader API via `webWordManager.js`
- **State Management**: Static classes → Singleton services via web adapters
- **Reactivity**: Manual state updates → React hooks and context integration

### Benefits of This Approach

1. **Preservation of Logic**: All the sophisticated algorithms remain intact and tested
2. **Faster Development**: No need to rewrite complex business logic
3. **Consistency**: Web and CLI versions behave identically
4. **Maintainability**: Core logic improvements benefit both versions
5. **Testability**: Core logic can be tested independently of UI

### File Structure Migration

The final structure maintains clear separation:
- `src/core/` - Direct copy from CLI version, unchanged
- `src/models/` - Direct copy from CLI version, unchanged  
- `src/services/` - Web adapters that use core modules
- `src/components/` - React UI components
- `src/pages/` - Page-level components using core data

### 4. Main Quiz Container Component

**Integration Hub for All Quiz Types:**
```jsx
// components/Quiz/QuizCard.jsx
import React from 'react';
import MatchingQuiz from './MatchingQuiz';
import FillInQuiz from './FillInQuiz';
import TranslationQuiz from './TranslationQuiz';

const QuizCard = ({ question, quizType, onSubmit, disabled = false }) => {
  const renderQuizByType = () => {
    switch (quizType) {
      case 'matching':
        return (
          <MatchingQuiz 
            question={question} 
            onSubmit={onSubmit} 
            disabled={disabled}
          />
        );
      case 'fill-in':
        return (
          <FillInQuiz 
            question={question} 
            onSubmit={onSubmit} 
            disabled={disabled}
          />
        );
      case 'translation':
        return (
          <TranslationQuiz 
            question={question} 
            onSubmit={onSubmit} 
            disabled={disabled}
          />
        );
      default:
        return (
          <div className="text-center text-gray-500">
            <p>未知题型</p>
          </div>
        );
    }
  };

  return (
    <div className={`transition-all duration-300 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {renderQuizByType()}
    </div>
  );
};

export default QuizCard;
```

### 练习模式交互特性总览

#### 用户体验设计原则：
1. **渐进式提示系统** - 从基础提示到详细帮助，支持用户逐步学习
2. **即时视觉反馈** - 每个操作都有相应的视觉反应和状态变化
3. **错误容忍机制** - 支持同义词匹配，提供重试机会
4. **上下文感知** - 根据用户表现动态调整难度和提示频率

#### 交互设计亮点：

**配对题特色：**
- 可视化配对过程，实时显示匹配进度
- 支持取消配对和重新选择
- 配对完成后显示正确性验证动画
- 支持键盘快捷键操作（数字键选择，空格确认）

**填空题特色：**
- 字符长度提示和输入验证
- 渐进式提示系统（0-2级提示）
- 实时输入反馈和高亮显示
- 尝试次数统计和智能提示策略

**翻译题特色：**
- 同义词识别和反馈
- 可选的同义词提示功能
- 详细的答案对比和学习建议
- 支持多种表达方式的语义匹配

#### 技术实现特性：
- **状态管理** - 每个题型独立管理交互状态
- **动画系统** - 使用CSS动画和过渡效果提升体验
- **响应式设计** - 适配不同屏幕尺寸的交互布局
- **无障碍支持** - 键盘导航和屏幕阅读器支持
- **性能优化** - 防抖输入和智能重渲染

## Conclusion

This design successfully preserves all the sophisticated core logic from the command-line application (including the Leitner box algorithm, semantic matching, and Word model) while providing a modern, responsive web interface with rich interaction patterns. The adapter pattern ensures the web version maintains full feature parity with the CLI version while taking advantage of React's component architecture and TailwindCSS's styling capabilities. The three distinct practice modes (配对、填空、翻译) each feature specialized interaction designs that enhance the learning experience while maintaining the pedagogical effectiveness of the original algorithm. The separation of concerns ensures that improvements to core algorithms benefit both versions, while UI enhancements can be implemented independently in the web version.