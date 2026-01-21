import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { getStatistics, loadWordsFromFile } = useApp();
  
  const stats = getStatistics();

  const handleImportClick = () => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const result = await loadWordsFromFile(file);
        if (result.success) {
          alert(`成功导入 ${result.count} 个单词！`);
        } else {
          alert(`导入失败: ${result.error}`);
        }
      }
    };
    input.click();
  };

  const startLearning = () => {
    navigate('/learning');
  };

  const viewStatistics = () => {
    navigate('/statistics');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <header className="glass-morphism rounded-2xl p-8 mb-8 text-white text-center animate-fade-in">
        <div className="floating-icon inline-block mb-4">
          <svg className="w-12 h-12 sm:w-14 md:w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">智能背单词系统</h1>
        <p className="text-xl text-white/90 mb-2">基于莱特纳盒子算法的科学记忆方法</p>
        <p className="text-white/70">高效记忆 · 智能复习 · 持久学习</p>
      </header>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Start Learning */}
        <div className="feature-card p-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <div className="w-14 h-14 sm:w-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-7 h-7 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">开始学习</h2>
          <p className="text-gray-600 mb-6">进入智能学习模式，系统会根据你的记忆情况推荐合适的单词进行复习。支持多种题型训练。</p>
          <button onClick={startLearning} className="pulse-button w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition">
            立即开始
          </button>
          <div className="mt-4 text-sm text-gray-500">
            <div className="flex items-center justify-between">
              <span>今日待复习</span>
              <span className="font-semibold text-green-600">{stats.totalWords - stats.totalStudied}</span>
            </div>
          </div>
        </div>

        {/* View Statistics */}
        <div className="feature-card p-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
          <div className="w-14 h-14 sm:w-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-7 h-7 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">学习统计</h2>
          <p className="text-gray-600 mb-6">查看详细的学习数据和进度分析。了解你的学习模式，优化复习策略。</p>
          <button onClick={viewStatistics} className="pulse-button w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition">
            查看统计
          </button>
          <div className="mt-4 text-sm text-gray-500">
            <div className="flex items-center justify-between">
              <span>正确率</span>
              <span className="font-semibold text-purple-600">{stats.correctRate}%</span>
            </div>
          </div>
        </div>

        {/* Import Words */}
        <div className="feature-card p-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
          <div className="w-14 h-14 sm:w-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-7 h-7 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">导入单词</h2>
          <p className="text-gray-600 mb-6">从TXT文件导入新单词库。支持"中文-英文"格式，自动整理并加入你的学习计划。</p>
          <button onClick={handleImportClick} className="pulse-button w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition">
            选择文件
          </button>
          <div className="mt-4 text-sm text-gray-500">
            <div className="flex items-center justify-between">
              <span>词汇总数</span>
              <span className="font-semibold text-blue-600">{stats.totalWords}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="glass-morphism rounded-2xl p-6 text-white animate-fade-in" style={{animationDelay: '0.4s'}}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-1">{stats.totalStudied}</div>
            <div className="text-sm text-white/80">已学习单词</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">{stats.correctRate}%</div>
            <div className="text-sm text-white/80">学习正确率</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">{stats.currentStreak}</div>
            <div className="text-sm text-white/80">连续正确</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">⚡</div>
            <div className="text-sm text-white/80">当前状态: 优秀</div>
          </div>
        </div>
      </div>

      {/* Learning Tips */}
      <div className="mt-8 glass-morphism rounded-2xl p-6 text-white animate-fade-in" style={{animationDelay: '0.5s'}}>
        <div className="flex items-center gap-4">
          <svg className="w-5 h-5 sm:w-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 className="font-semibold mb-1">今日学习建议</h3>
            <p className="text-white/80 text-sm">
              {stats.totalWords > 0 
                ? `盒子1中有 ${stats.boxDistribution?.[1] || 0} 个新单词需要学习，建议今天重点复习这些内容。`
                : '还没有导入单词，请先导入单词库开始学习之旅！'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;