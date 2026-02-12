import { useState, useEffect } from 'react';
import { TarotProvider, useTarot } from './contexts/TarotContext';
import { WelcomePage } from './pages/WelcomePage';
import { SpreadSelectionPage } from './pages/SpreadSelectionPage';
import { DirectionSelectionPage } from './pages/DirectionSelectionPage';
import { DrawingPage } from './pages/DrawingPage';
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

  const handleStart = () => {
    setCurrentPage('spread');
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
      return <WelcomePage onStart={handleStart} />;
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
    default:
      return <WelcomePage onStart={handleStart} />;
  }
}

function App() {
  return (
    <TarotProvider>
      <AppContent />
    </TarotProvider>
  );
}

export default App;
