import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-white font-semibold' : 'text-white/80 hover:text-white';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800">
      {/* Glassmorphism header */}
      <header className="backdrop-blur-md bg-white/10 p-4 sm:p-6 text-white border-b border-white/20">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl sm:text-3xl font-bold hover:opacity-80 transition-opacity">
            智能背单词系统
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/" 
                  className={`hover:opacity-80 transition-all duration-300 ${isActive('/')}`}
                >
                  首页
                </Link>
              </li>
              <li>
                <Link 
                  to="/learning" 
                  className={`hover:opacity-80 transition-all duration-300 ${isActive('/learning')}`}
                >
                  学习
                </Link>
              </li>
              <li>
                <Link 
                  to="/statistics" 
                  className={`hover:opacity-80 transition-all duration-300 ${isActive('/statistics')}`}
                >
                  统计
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-black/20 text-white/60 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            智能背单词系统 - 基于莱特纳盒子算法的科学记忆方法（by chenxin.ma）
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;