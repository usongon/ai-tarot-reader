import { SITE_CONFIG } from './config/beian';
import { useState, useEffect } from 'react';
import { TarotProvider, useTarot } from './contexts/TarotContext';
import { WelcomePage } from './pages/WelcomePage';
import { SpreadSelectionPage } from './pages/SpreadSelectionPage';
import { DirectionSelectionPage } from './pages/DirectionSelectionPage';
import { DrawingPage } from './pages/DrawingPage';
import { BaziInfoPage } from './pages/BaziInfoPage';
import { BaziChartPage } from './pages/BaziChartPage';
import { api } from './services/api';
import './App.css';

function AppContent() {
  const { state, dispatch, setLoading, setError } = useTarot();
  const [currentPage, setCurrentPage] = useState('welcome');

  // 页面加载时获取牌阵列表
  useEffect(() => {
    async function fetchSpreads() {
      try {
        setLoading(true);
        const spreads = await api.getSpreads();
        // 添加cardCount和chineseName属性到每个牌阵
        const spreadsWithCount = spreads.map(spread => ({
          ...spread,
          chineseName: spread.nameChinese,
          cardCount: spread.numberOfCards
        }));
        dispatch({ type: 'SET_SPREADS', payload: spreadsWithCount });
      } catch (error) {
        setError('获取牌阵失败，请刷新页面重试');
        console.error('Failed to fetch spreads:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSpreads();
  }, [dispatch, setLoading, setError]);

  const handleSelectMode = (mode) => {
    if (mode === 'tarot') {
      setCurrentPage('spread');
    } else if (mode === 'bazi') {
      setCurrentPage('bazi-info');
    }
  };

  const handleSelectSpread = (spread) => {
    dispatch({ type: 'SET_SELECTED_SPREAD', payload: spread });
    setCurrentPage('direction');
  };

  const handleSelectDirection = (direction) => {
    dispatch({ type: 'SET_SELECTED_DIRECTION', payload: direction });
    handleDrawCards();
  };

  const handleDrawCards = async () => {
    try {
      setLoading(true);
      const deck = await api.getDeck();
      dispatch({ type: 'SET_CARDS', payload: deck });
      setCurrentPage('drawing');
    } catch (error) {
      setError('获取牌组失败，请重试');
      console.error('Failed to get deck:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (index) => {
    dispatch({ type: 'FLIP_CARD', payload: index });
  };

  const handleReshuffle = async () => {
    dispatch({ type: 'RESET_DRAWING' });
    await handleDrawCards();
  };

  const handleBaziSubmit = ({ chart, token, request }) => {
    dispatch({ type: 'SET_TOKEN', payload: token });
    dispatch({ type: 'SET_BAZI_CHART', payload: chart });
    dispatch({ type: 'SET_BAZI_REQUEST', payload: request });
    setCurrentPage('bazi-chart');
  };

  const handleInterpret = async (token, selectedCards) => {
    dispatch({ type: 'SET_TOKEN', payload: token });
    return await api.interpret(
      token,
      state.selectedDirection.name,
      state.selectedSpread.chineseName,
      selectedCards || state.cards
    );
  };

  const handleBack = () => {
    switch (currentPage) {
      case 'spread':
        setCurrentPage('welcome');
        break;
      case 'direction':
        setCurrentPage('spread');
        break;
      case 'drawing':
        setCurrentPage('direction');
        dispatch({ type: 'RESET_DRAWING' });
        break;
      case 'bazi-info':
        setCurrentPage('welcome');
        break;
      case 'bazi-chart':
        setCurrentPage('bazi-info');
        break;
      default:
        break;
    }
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
          <div className="text-white text-xl mb-4">{state.error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            刷新页面
          </button>
        </div>
      </div>
    );
  }

  switch (currentPage) {
    case 'welcome':
      return <WelcomePage onSelectMode={handleSelectMode} />;
    case 'spread':
      return (
        <SpreadSelectionPage
          spreads={state.spreads}
          onSelect={handleSelectSpread}
          onBack={handleBack}
        />
      );
    case 'direction':
      return (
        <DirectionSelectionPage
          spread={state.selectedSpread}
          onSelect={handleSelectDirection}
          onBack={handleBack}
        />
      );
    case 'drawing':
      return (
        <DrawingPage
          spread={state.selectedSpread}
          direction={state.selectedDirection}
          cards={state.cards}
          flippedCards={state.flippedCards}
          onCardClick={handleCardClick}
          onReshuffle={handleReshuffle}
          onInterpret={handleInterpret}
          onBack={handleBack}
        />
      );
    case 'bazi-info':
      return <BaziInfoPage onSubmit={handleBaziSubmit} onBack={handleBack} />;
    case 'bazi-chart':
      return <BaziChartPage chart={state.baziChart} token={state.token} onBack={handleBack} />;
    default:
      return <WelcomePage onSelectMode={handleSelectMode} />;
  }
}

function App() {
  return (
    <TarotProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex flex-col">
        <div className="flex-1">
          <AppContent />
        </div>
        <footer className="text-center py-3 px-4 text-purple-400/50 text-[10px] md:text-xs space-y-1">
          {SITE_CONFIG?.contact && (
            <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="hover:text-purple-300 transition-colors inline-flex items-center gap-1"
              >
                <span>✉️</span> {SITE_CONFIG.contact.email}
              </a>
              <a
                href={SITE_CONFIG.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-300 transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
            </div>
          )}
          {SITE_CONFIG?.beian && (
            <div>
              <a
                href={SITE_CONFIG.beian.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-300 transition-colors"
              >
                {SITE_CONFIG.beian.number}
              </a>
            </div>
          )}
        </footer>
      </div>
    </TarotProvider>
  );
}

export default App;
