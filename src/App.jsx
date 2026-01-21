import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import MainLayout from './components/Layout/MainLayout';
import HomePage from './pages/Home';
import LearningPage from './pages/Learning';
import StatisticsPage from './pages/Statistics';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="learning" element={<LearningPage />} />
            <Route path="statistics" element={<StatisticsPage />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;