import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/Cards/StatCard';
import WebStorage from '../services/webStorage';

const StatisticsPage = () => {
  const { getStatistics } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadedStats = getStatistics();
    setStats(loadedStats);
  }, [getStatistics]);

  const handleExportStats = () => {
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'learning-statistics.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!stats) {
    return <div className="text-white text-center py-10">加载中...</div>;
  }

  const BoxDistributionChart = () => {
    const total = Object.values(stats.boxDistribution).reduce((a, b) => a + b, 0);
    
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(box => {
            const count = stats.boxDistribution[box] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];
            
            return (
              <div key={box} className="flex items-center gap-4">
                <div className="w-16 text-sm font-medium text-gray-300">盒子 {box}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div 
                    className={`${colors[box-1]} h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                    style={{ width: `${percentage}%` }}
                  >
                    {count > 0 && (
                      <span className="text-white text-xs font-bold">{count}</span>
                    )}
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-500">{Math.round(percentage)}%</div>
              </div>
            );
          })}
        </div>
        <div className="text-sm text-gray-300 mt-4">
          总计: {total} 个单词
        </div>
      </div>
    );
  };

  const AchievementBadge = ({ icon, title, description, unlocked }) => {
    return (
      <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
        unlocked 
          ? 'bg-yellow-50 border-yellow-300 shadow-lg' 
          : 'bg-gray-50 border-gray-200 opacity-60'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`text-2xl ${unlocked ? 'grayscale-0' : 'grayscale'}`}>
            {icon}
          </div>
          <div>
            <h4 className={`font-semibold ${unlocked ? 'text-yellow-800' : 'text-gray-600'}`}>
              {title}
            </h4>
            <p className={`text-sm ${unlocked ? 'text-yellow-700' : 'text-gray-500'}`}>
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Generate achievements based on stats
  const achievements = [
    {
      icon: '🎯',
      title: '初学者',
      description: '学习第一个单词',
      unlocked: stats.totalStudied >= 1
    },
    {
      icon: '📚',
      title: '勤奋学习者',
      description: '学习50个单词',
      unlocked: stats.totalStudied >= 50
    },
    {
      icon: '🏆',
      title: '词汇大师',
      description: '学习200个单词',
      unlocked: stats.totalStudied >= 200
    },
    {
      icon: '🔥',
      title: '连续正确',
      description: '连续答对10题',
      unlocked: stats.currentStreak >= 10
    },
    {
      icon: '⭐',
      title: '完美主义',
      description: '正确率达到90%',
      unlocked: stats.correctRate >= 90
    },
    {
      icon: '🚀',
      title: '快速学习者',
      description: '在5秒内答对题目',
      unlocked: false // This would need timing data
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-morphism rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">学习统计</h1>
            <p className="text-white/80">跟踪你的学习进度和成就</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/learning')}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-all duration-300"
            >
              返回学习
            </button>
            <button 
              onClick={handleExportStats}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-all duration-300"
            >
              导出统计
            </button>
            <button 
              onClick={async () => {
                if (window.confirm('确定要清除所有单词吗？此操作无法撤销。')) {
                  await WebStorage.clear();
                  alert('所有单词已清除！');
                  navigate('/');
                }
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-all duration-300"
            >
              清除所有单词
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
          trend={stats.correctRate >= 80 ? '优秀' : stats.correctRate >= 60 ? '良好' : '需努力'} 
          trendColor={stats.correctRate >= 80 ? 'text-green-500' : stats.correctRate >= 60 ? 'text-yellow-500' : 'text-red-500'}
        />
        
        <StatCard 
          icon="fire" 
          value={stats.currentStreak} 
          label="连续正确" 
          trend={stats.currentStreak > 0 ? '连续!' : '开始吧'} 
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
        <div className="lg:col-span-2 glass-morphism p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-4">莱特纳盒子分布</h2>
          <BoxDistributionChart />
        </div>

        <div className="glass-morphism p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-4">成就徽章</h2>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <AchievementBadge key={index} {...achievement} />
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-300/30">
            <h3 className="font-semibold text-white mb-2">学习建议</h3>
            <p className="text-white/80 text-sm">
              {stats.correctRate < 60 
                ? '建议多复习盒子1和盒子2中的单词，巩固基础。'
                : stats.correctRate < 80
                ? '表现不错！可以尝试挑战更多新单词。'
                : '太棒了！保持当前的学习节奏，继续向更高目标迈进。'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Learning Progress Chart Placeholder */}
      <div className="glass-morphism p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4">学习进度趋势</h2>
        <div className="h-64 flex items-center justify-center bg-white/5 rounded-xl">
          <div className="text-center text-white/60">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>图表功能开发中...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;