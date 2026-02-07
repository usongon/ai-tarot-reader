import React from 'react';
import { motion } from 'framer-motion';
import { useTarot } from '../../contexts/TarotContext';
import { ArrowLeftIcon, BriefcaseIcon, HeartIcon, CurrencyDollarIcon, HeartIcon as HealthIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const TOPIC_CONFIG = [
  { id: "事业", name: "事业", icon: BriefcaseIcon, color: "from-blue-500 to-cyan-500" },
  { id: "爱情", name: "爱情", icon: HeartIcon, color: "from-pink-500 to-rose-500" },
  { id: "财运", name: "财运", icon: CurrencyDollarIcon, color: "from-yellow-500 to-amber-500" },
  { id: "健康", name: "健康", icon: HealthIcon, color: "from-green-500 to-emerald-500" },
  { id: "综合运势", name: "综合运势", icon: ChartBarIcon, color: "from-purple-500 to-indigo-500" }
];

const TopicSelectionPage = ({ onBack, navigateTo }) => {
  const { state, dispatch } = useTarot();

  const handleSelectTopic = (topic) => {
    dispatch({ type: 'SELECT_TOPIC', payload: topic });
  };

  const handleDealCards = () => {
    if (!state.selectedSpread || !state.selectedTopic) return;
    
    fetch('/api/deck')
      .then(response => response.json())
      .then(data => {
        // 展示所有78张牌，让用户自由抽取
        const positionedDeck = data.map((card, index) => {
          // 计算网格布局位置，展示所有卡片
          const gridSize = Math.ceil(Math.sqrt(data.length)); // 基于总牌数计算网格
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;
          
          // 计算基于网格的位置
          const horizontalSpacing = 85 / gridSize;  // 水平间距百分比
          const verticalSpacing = 70 / gridSize;    // 垂直间距百分比
          
          const leftPercent = 7.5 + (col * horizontalSpacing) + (horizontalSpacing / 2);
          const topPercent = 15 + (row * verticalSpacing) + (verticalSpacing / 2);
          
          return {
            ...card,
            id: `${card.name}-${Date.now()}-${index}`, // 添加唯一ID
            top: `${topPercent}vh`,
            left: `${leftPercent}vw`,
            transform: `rotate(${Math.random() * 20 - 10}deg)`, // 减少旋转角度
            isDrawn: false,
            isFlipped: false
          };
        });
        dispatch({ type: 'SET_DECK', payload: positionedDeck });
        // 导航到抽牌页面
        navigateTo('drawing');
      })
      .catch(error => console.error('Failed to load deck:', error));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '1rem'
    }}>
      <motion.div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem'
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 返回按钮和标题区域 */}
        <motion.div style={{ textAlign: 'center', marginBottom: '3rem' }} variants={itemVariants}>
          <Button
            variant="ghost"
            onClick={onBack}
            style={{
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              margin: '0 auto',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              color: '#8b5cf6',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
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
            <ArrowLeftIcon style={{ height: '1.25rem', width: '1.25rem' }} />
            <span>返回选择牌阵</span>
          </Button>
          
          <motion.h1 
            style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              background: 'linear-gradient(to right, #f472b6, #8b5cf6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            选择占卜主题
          </motion.h1>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '9999px',
            display: 'inline-block',
            marginBottom: '1rem'
          }}>
            <p style={{ color: '#d1d5db', fontSize: '1rem', fontWeight: '600' }}>
              当前牌阵: {state.selectedSpread?.nameChinese}
            </p>
          </div>
          
          <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>
            选择您想要探索的人生领域
          </p>
        </motion.div>

        {/* 主题选择网格 */}
        <motion.div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}
          variants={itemVariants}
        >
          {TOPIC_CONFIG.map((topicConfig, index) => {
            const isSelected = state.selectedTopic === topicConfig.id;
            const IconComponent = topicConfig.icon;
            
            return (
              <motion.div
                key={topicConfig.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: `2px solid ${isSelected ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ 
                  y: -8,
                  scale: 1.03,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(139, 92, 246, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectTopic(topicConfig.id)}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {/* 装饰性背景元素 */}
                <div style={{
                  position: 'absolute',
                  top: '-1.5rem',
                  right: '-1.5rem',
                  width: '6rem',
                  height: '6rem',
                  background: `conic-gradient(from 0deg, rgba(139, 92, 246, 0.1), rgba(244, 114, 182, 0.1))`,
                  borderRadius: '50%',
                  filter: 'blur(1.5rem)'
                }}></div>

                {/* 主题内容 */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                  <div style={{
                    width: '4rem',
                    height: '4rem',
                    background: `linear-gradient(to right, ${topicConfig.color.replace('from-', '').replace('to-', '')})`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                  }}>
                    <IconComponent style={{ 
                      height: '2rem', 
                      width: '2rem', 
                      color: 'white',
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                    }} />
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '0.5rem'
                  }}>
                    {topicConfig.name}
                  </h3>
                  
                  {isSelected && (
                    <motion.div 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '9999px',
                        color: '#8b5cf6'
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>✓ 已选择</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 开始抽牌按钮 */}
        <motion.div 
          style={{ textAlign: 'center' }}
          variants={itemVariants}
        >
          <Button
            size="large"
            onClick={handleDealCards}
            disabled={!state.selectedTopic}
            style={{
              padding: '1.25rem 3rem',
              fontSize: '1.125rem',
              background: state.selectedTopic 
                ? 'linear-gradient(to right, #8b5cf6, #6366f1)' 
                : 'rgba(255, 255, 255, 0.1)',
              boxShadow: state.selectedTopic ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : 'none',
              border: state.selectedTopic ? 'none' : '2px solid rgba(255, 255, 255, 0.2)'
            }}
            icon={state.selectedTopic ? "🃏" : undefined}
          >
            {state.selectedTopic ? '开始神秘之旅' : '请先选择占卜主题'}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TopicSelectionPage;