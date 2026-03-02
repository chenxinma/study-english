import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { GamificationProvider } from './contexts/GamificationContext';
import MainLayout from './components/Layout/MainLayout';
import HomePage from './pages/Home';
import LearningPage from './pages/Learning';
import StatisticsPage from './pages/Statistics';
import AchievementsPage from './pages/Achievements';
import GamificationNotifications from './components/Gamification/GamificationNotifications';
import './App.css';

function App() {
  return (
    <AppProvider>
      <GamificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <>
                <MainLayout />
                <GamificationNotifications />
              </>
            }>
              <Route index element={<HomePage />} />
              <Route path="learning" element={<LearningPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="achievements" element={<AchievementsPage />} />
            </Route>
          </Routes>
        </Router>
      </GamificationProvider>
    </AppProvider>
  );
}

export default App;