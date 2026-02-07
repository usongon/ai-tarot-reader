import React from 'react';
import { motion } from 'framer-motion';
import { useTarot } from '../../contexts/TarotContext';
import { ArrowLeftIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const DrawingPage = ({ onBack }) => {
  const { state, dispatch } = useTarot();

  // 添加调试信息
  console.log('DrawingPage State:', {
    deckLength: state.deck.length,
    drawnCount: state.deck.filter(card => card.isDrawn).length,
    undrawnCount: state.deck.filter(card => !card.isDrawn).length
  });

  const handleDrawCard = (card) => {
    if (!card.isDrawn) {
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
        // 重新洗牌并展示所有78张牌
        const reshuffledDeck = data.map((card, index) => {
          const gridSize = Math.ceil(Math.sqrt(data.length));
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;
          
          const horizontalSpacing = 85 / gridSize;
          const verticalSpacing = 75 / gridSize;
          
          const leftPercent = 7.5 + (col * horizontalSpacing) + (horizontalSpacing / 2);
          const topPercent = 12.5 + (row * verticalSpacing) + (verticalSpacing / 2);
          
          return {
            ...card,
            id: `${card.name}-${Date.now()}-${index}`,
            top: `${topPercent}vh`,
            left: `${leftPercent}vw`,
            transform: `rotate(${Math.random() * 20 - 10}deg)`,
            isDrawn: false,
            isFlipped: false
          };
        });
        dispatch({ type: 'SET_DECK', payload: reshuffledDeck });
      })
      .catch(error => console.error('Failed to reshuffle deck:', error));
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem',
      minHeight: '100vh'
    }}>
      {/* 顶部控制栏 */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Button
            variant="ghost"
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <ArrowLeftIcon style={{ height: '1.25rem', width: '1.25rem' }} />
            <span>返回选择主题</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleReshuffle}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
              border: '2px solid rgba(139, 92, 246, 0.5)',
              color: '#8b5cf6'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <ArrowsRightLeftIcon style={{ height: '1rem', width: '1rem' }} />
            <span>重新洗牌</span>
          </Button>
        </div>
        
        <motion.h1 
          style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(to right, #60a5fa, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          神秘抽牌
        </motion.h1>
        <p style={{ color: '#d1d5db', fontSize: '1.125rem' }}>
          点击卡牌进行抽取和翻转，探索您的命运
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', minHeight: '70vh' }}>
        {/* 左侧：待抽牌区域 */}
        <div style={{ flex: 3, position: 'relative' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '1rem', 
            padding: '1.5rem',
            minHeight: '60vh'
          }}>
            <h2 style={{ 
              color: '#e5e7eb', 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              🃏 待抽牌堆 ({state.deck.filter(card => !card.isDrawn).length}张)
            </h2>
            
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: 'calc(100% - 3rem)',
              overflow: 'hidden'
            }}>
              {state.deck
                .filter(card => !card.isDrawn)
                .map((card, index) => {
                  // 计算所有未抽卡片的网格布局
                  const undrawnCards = state.deck.filter(c => !c.isDrawn);
                  const cardCount = undrawnCards.length;
                  const gridSize = Math.ceil(Math.sqrt(cardCount));
                  const row = Math.floor(index / gridSize);
                  const col = index % gridSize;
                  
                  // 调整布局参数以适应容器
                  const horizontalSpacing = 85 / gridSize;
                  const verticalSpacing = 75 / gridSize;
                  
                  const leftPercent = 7.5 + (col * horizontalSpacing) + (horizontalSpacing / 2);
                  const topPercent = 12.5 + (row * verticalSpacing) + (verticalSpacing / 2);
                  
                  const cardWidth = Math.min(5.5, 75/gridSize);
                  const cardHeight = Math.min(8, 110/gridSize);
                  
                  return (
                    <motion.div
                      key={card.id || `${card.name}-${index}`}
                      style={{
                        position: 'absolute',
                        top: `${topPercent}%`,
                        left: `${leftPercent}%`,
                        transform: `translate(-50%, -50%) rotate(${Math.random() * 8 - 4}deg)`,
                        cursor: 'pointer',
                        width: `${cardWidth}rem`,
                        height: `${cardHeight}rem`,
                        zIndex: undrawnCards.length - index
                      }}
                      whileHover={{ 
                        scale: 1.15,
                        y: -10,
                        zIndex: 100
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDrawCard(card)}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.015 }}
                    >
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        borderRadius: '0.5rem',
                        background: 'linear-gradient(135deg, #7e22ce, #4f46e5, #2563eb)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid rgba(139, 92, 246, 0.3)',
                        boxShadow: '0 8px 12px -2px rgba(0, 0, 0, 0.1)',
                        fontSize: '1.75rem',
                        color: 'rgba(192, 132, 252, 0.7)'
                      }}>
                        🃏
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* 右侧：已抽牌展示区域 */}
        <div style={{ flex: 2, position: 'relative' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '1rem', 
            padding: '1.5rem',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{ 
              color: '#e5e7eb', 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              ✨ 已抽牌展示 ({state.deck.filter(card => card.isDrawn).length}张)
            </h2>
            
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              overflowY: 'auto'
            }}>
              {state.deck
                .filter(card => card.isDrawn)
                .map((card, index) => (
                  <motion.div
                    key={`drawn-${card.id || `${card.name}-${index}`}`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '12rem',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.5s ease-in-out',
                      transform: card.isFlipped ? 'rotateY(180deg)' : 'none'
                    }}>
                      {/* 背面 */}
                      {!card.isFlipped && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          borderRadius: '0.5rem',
                          background: 'linear-gradient(135deg, #7e22ce, #4f46e5, #2563eb)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid rgba(139, 92, 246, 0.3)',
                          fontSize: '3rem',
                          color: 'rgba(192, 132, 252, 0.5)'
                        }}>
                          ★
                        </div>
                      )}
                      
                      {/* 正面 */}
                      {card.isFlipped && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          borderRadius: '0.5rem',
                          background: 'white',
                          transform: 'rotateY(180deg)',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <div style={{
                            padding: '0.5rem',
                            background: 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)',
                            flexShrink: 0
                          }}>
                            <img 
                              src={card.imagePath} 
                              alt={card.nameChinese} 
                              style={{
                                width: '100%',
                                height: '6rem',
                                objectFit: 'cover',
                                borderRadius: '0.25rem',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transform: card.reversed ? 'rotate(180deg)' : 'none'
                              }}
                            />
                          </div>
                          <div style={{
                            padding: '0.5rem',
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <p style={{
                              fontSize: '0.75rem',
                              color: '#374151',
                              textAlign: 'center',
                              lineHeight: '1.3',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {card.reversed ? card.reversedMeaningChinese : card.uprightMeaningChinese}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* 卡片名称 */}
                    <div style={{ 
                      marginTop: '0.75rem', 
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#e5e7eb'
                    }}>
                      {card.nameChinese}
                      {card.reversed && <span style={{ color: '#f87171', marginLeft: '0.5rem' }}>(逆位)</span>}
                    </div>
                  </motion.div>
                ))}
              
              {/* 空状态提示 */}
              {state.deck.filter(card => card.isDrawn).length === 0 && (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
                    <p>点击左侧牌堆抽取您的第一张塔罗牌</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingPage;