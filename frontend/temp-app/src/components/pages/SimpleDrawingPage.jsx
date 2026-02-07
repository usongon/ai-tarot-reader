import React, { useEffect, useState } from 'react';
import { useTarot } from '../../contexts/TarotContext';
import ReactMarkdown from 'react-markdown';
import { ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';

const SimpleDrawingPage = ({ onBack, showHistoryModal: externalShowHistoryModal, onCloseHistoryModal: externalCloseHistoryModal }) => {
  const { state, dispatch } = useTarot();
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showLocalHistoryModal, setShowLocalHistoryModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretationResult, setInterpretationResult] = useState('');

  // 处理外部传入的历史记录modal状态
  const showHistoryModal = externalShowHistoryModal || showLocalHistoryModal;
  const handleCloseHistoryModal = externalCloseHistoryModal || (() => setShowLocalHistoryModal(false));

  useEffect(() => {
    console.log('SimpleDrawingPage mounted, deck length:', state.deck.length);
  }, []);

  const handleDrawCard = (card) => {
    // 检查是否达到牌阵限制数量
    const maxCards = state.selectedSpread?.cardCount || 78; // 默认不限制
    const currentDrawnCount = state.deck.filter(c => c.isDrawn).length;
    
    if (!card.isDrawn && currentDrawnCount < maxCards) {
      dispatch({ type: 'DRAW_CARD', payload: card });
      setTimeout(() => {
        dispatch({ type: 'FLIP_CARD', payload: card });
      }, 500);
    }
  };

  const handleReshuffle = () => {
    fetch('/api/deck')
      .then(response => response.json())
      .then(data => {
        const reshuffledDeck = data.map((card, index) => ({
          ...card,
          id: `${card.name}-${Date.now()}-${index}`,
          isDrawn: false,
          isFlipped: false
        }));
        dispatch({ type: 'SET_DECK', payload: reshuffledDeck });
      })
      .catch(error => console.error('Failed to reshuffle deck:', error));
  };

  const handleInterpretClick = () => {
    if (state.deck.filter(card => card.isDrawn).length === 0) {
      alert('请先抽取至少一张牌');
      return;
    }
    setShowTokenModal(true);
  };

  const handleTokenSubmit = () => {
    if (!apiKey.trim()) {
      alert('请输入API密钥');
      return;
    }
    
    setShowTokenModal(false);
    setIsInterpreting(true);
    setInterpretationResult('正在解析中，请稍候...');

    // 准备请求数据
    const drawnCards = state.deck.filter(card => card.isDrawn);
    const requestData = {
      token: apiKey,
      direction: state.selectedTopic,
      spreadName: state.selectedSpread?.name || '未知牌阵',
      cards: drawnCards.map(card => ({
        name: card.name,
        nameChinese: card.nameChinese,
        uprightMeaning: card.uprightMeaning,
        uprightMeaningChinese: card.uprightMeaningChinese,
        reversedMeaning: card.reversedMeaning,
        reversedMeaningChinese: card.reversedMeaningChinese,
        imagePath: card.imagePath,
        reversed: card.reversed
      }))
    };

    fetch('/api/interpret', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })
    .then(response => response.text())
    .then(data => {
      setInterpretationResult(data);
      setIsInterpreting(false);
    })
    .catch(error => {
      console.error('解读请求失败:', error);
      setInterpretationResult('解读失败，请稍后重试');
      setIsInterpreting(false);
    });
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: '#1a1a2e' }}>
      {/* 密钥输入弹窗 */}
      {showTokenModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.75rem',
            minWidth: '400px',
            maxWidth: '90%'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>请输入API密钥</h3>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="输入您的API密钥"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '1rem'
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowTokenModal(false);
                  setApiKey('');
                }}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ccc',
                  borderRadius: '0.5rem',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={handleTokenSubmit}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: '#8b5cf6',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 历史记录弹窗 */}
      {showHistoryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.75rem',
            minWidth: '300px',
            maxWidth: '90%',
            textAlign: 'center'
          }}>
            <ClockIcon style={{ 
              width: '3rem', 
              height: '3rem', 
              color: '#8b5cf6', 
              margin: '0 auto 1rem' 
            }} />
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>历史记录</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              功能正在加班加点开发中...
            </p>
            <button
              onClick={() => setShowHistoryModal(false)}
              style={{
                padding: '0.5rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                background: '#8b5cf6',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              知道了
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button 
            onClick={onBack}
            style={{
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              color: '#8b5cf6',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(139, 92, 246, 0.3)';
              e.target.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(139, 92, 246, 0.2)';
              e.target.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeftIcon style={{ width: '1.25rem', height: '1.25rem' }} />
            <span>返回选择主题</span>
          </button>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setShowLocalHistoryModal(true)}
              style={{
                background: 'transparent',
                border: '1px solid #8b5cf6',
                color: '#8b5cf6',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(139, 92, 246, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              <ClockIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              历史记录
            </button>
            <button 
              onClick={handleInterpretClick}
              disabled={state.deck.filter(card => card.isDrawn).length === 0 || isInterpreting}
              style={{
                background: state.deck.filter(card => card.isDrawn).length === 0 || isInterpreting ? '#666' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                border: '1px solid ' + (state.deck.filter(card => card.isDrawn).length === 0 || isInterpreting ? '#666' : '#8b5cf6'),
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                cursor: state.deck.filter(card => card.isDrawn).length === 0 || isInterpreting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!(state.deck.filter(card => card.isDrawn).length === 0 || isInterpreting)) {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {isInterpreting ? '解读中...' : 'AI解读牌面'}
            </button>
          </div>
        </div>
        
        <h1 style={{ 
          color: 'white', 
          marginTop: '1rem',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #8b5cf6, #60a5fa)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          神秘抽牌
        </h1>
        <p style={{ color: '#d1d5db', fontSize: '1.1rem' }}>
          剩余牌数: {state.deck.filter(card => !card.isDrawn).length} | 
          已抽: {state.deck.filter(card => card.isDrawn).length}/{state.selectedSpread?.cardCount || '∞'}
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '1rem',
        padding: '1rem'
      }}>
        {state.deck
          .filter(card => !card.isDrawn)
          .map((card, index) => (
            <div
              key={card.id || `${card.name}-${index}`}
              onClick={() => handleDrawCard(card)}
              style={{
                background: 'linear-gradient(135deg, #7e22ce, #4f46e5)',
                height: '120px',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1) rotate(5deg)';
                e.target.style.boxShadow = '0 8px 15px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1) rotate(0deg)';
                e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              🃏
            </div>
          ))}
      </div>

      {/* 已抽牌展示区 */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '0.75rem',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>
          已抽牌 ({state.deck.filter(card => card.isDrawn).length}张)
        </h2>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap' 
        }}>
          {state.deck
            .filter(card => card.isDrawn)
            .map((card, index) => (
              <div
                key={`drawn-${card.id || `${card.name}-${index}`}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  width: '100px',
                  height: '150px',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
              >
                <img 
                  src={card.imagePath} 
                  alt={card.nameChinese} 
                  style={{
                    width: '100%',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '0.25rem',
                    marginBottom: '0.5rem'
                  }}
                />
                <div style={{ 
                  fontSize: '0.7rem', 
                  textAlign: 'center',
                  color: '#333'
                }}>
                  {card.nameChinese}
                  {card.reversed && <div style={{ color: 'red' }}>(逆位)</div>}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* AI解读结果显示 */}
      {(isInterpreting || interpretationResult) && (
        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(139, 92, 246, 0.15)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>AI牌面解读</h3>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            color: '#333',
            minHeight: '100px',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            {isInterpreting ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '80px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid #8b5cf6',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>正在解析中，请稍候...</span>
                </div>
              </div>
            ) : (
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1a1a2e' }} {...props} />,
                  h2: ({node, ...props}) => <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#1a1a2e' }} {...props} />,
                  h3: ({node, ...props}) => <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1a1a2e' }} {...props} />,
                  p: ({node, ...props}) => <p style={{ marginBottom: '1rem', lineHeight: '1.6' }} {...props} />,
                  ul: ({node, ...props}) => <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }} {...props} />,
                  ol: ({node, ...props}) => <ol style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }} {...props} />,
                  li: ({node, ...props}) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
                  strong: ({node, ...props}) => <strong style={{ fontWeight: 'bold' }} {...props} />,
                  em: ({node, ...props}) => <em style={{ fontStyle: 'italic' }} {...props} />
                }}
              >
                {interpretationResult}
              </ReactMarkdown>
            )}
          </div>
        </div>
      )}

      {/* 添加旋转动画样式 */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SimpleDrawingPage;