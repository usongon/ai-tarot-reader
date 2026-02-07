import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TarotProvider } from './contexts/TarotContext';
import Layout from './components/layout/Layout';
import HomePage from './components/pages/HomePage';
import SpreadSelectionPage from './components/pages/SpreadSelectionPage';
import TopicSelectionPage from './components/pages/TopicSelectionPage';
import SimpleDrawingPage from './components/pages/SimpleDrawingPage';
import HistoryPage from './components/pages/HistoryPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const handleNavigateHistory = () => {
    setShowHistoryModal(true);
  };

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onStartReading={() => navigateTo('spreads')} />;
      case 'spreads':
        return <SpreadSelectionPage onBack={() => navigateTo('home')} navigateTo={navigateTo} />;
      case 'topics':
        return <TopicSelectionPage onBack={() => navigateTo('spreads')} navigateTo={navigateTo} />;
      case 'drawing':
        return <SimpleDrawingPage onBack={() => navigateTo('topics')} />;
      case 'history':
        return <HistoryPage onBack={() => navigateTo('home')} />;
      default:
        return <HomePage onStartReading={() => navigateTo('spreads')} />;
    }
  };

  return (
    <TarotProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <Layout 
              onNavigateHome={() => navigateTo('home')} 
              onNavigateHistory={handleNavigateHistory}
              showHistoryModal={showHistoryModal}
              onCloseHistoryModal={handleCloseHistoryModal}
            >
              {renderCurrentPage()}
            </Layout>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </TarotProvider>
  );
}

export default App;