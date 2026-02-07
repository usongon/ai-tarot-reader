import React from 'react';
import { motion } from 'framer-motion';
import { useTarot } from '../../contexts/TarotContext';
import { ArrowLeftIcon, ChevronRightIcon, FireIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const SPREADS = [
  {
    id: 'single',
    name: '单张牌阵',
    nameChinese: '单张牌阵',
    description: '简单直接，适合快速询问或日常指引',
    cardCount: 1,
    icon: '🃏',
    color: 'from-orange-500 to-red-500',
    iconComponent: FireIcon
  },
  {
    id: 'three-card',
    name: '三张牌阵',
    nameChinese: '过去·现在·未来',
    description: '揭示时间线的发展轨迹，看清前因后果',
    cardCount: 3,
    icon: '🕒',
    color: 'from-yellow-500 to-amber-500',
    iconComponent: ClockIcon
  },
  {
    id: 'celtic-cross',
    name: '凯尔特十字',
    nameChinese: '凯尔特十字阵',
    description: '最全面的经典牌阵，深入分析复杂情况',
    cardCount: 10,
    icon: '🍀',
    color: 'from-green-500 to-emerald-500',
    iconComponent: SparklesIcon
  }
];

const SpreadSelectionPage = ({ onBack, navigateTo }) => {
  const { state, dispatch } = useTarot();

  const handleSelectSpread = (spread) => {
    dispatch({ type: 'SELECT_SPREAD', payload: spread });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
            <span>返回首页</span>
          </Button>
          
          <motion.h1 
            style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              background: 'linear-gradient(to right, #a78bfa, #f472b6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            选择牌阵
          </motion.h1>
          
          <p style={{ color: '#9ca3af', fontSize: '1.125rem', maxWidth: '36rem', margin: '0 auto' }}>
            不同的牌阵适用于不同的占卜需求，
            <br />请选择最适合您当前问题的牌阵类型
          </p>
        </motion.div>

        {/* 牌阵卡片网格 */}
        <motion.div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}
          variants={itemVariants}
        >
          {SPREADS.map((spread, index) => {
            const IconComponent = spread.iconComponent;
            const isSelected = state.selectedSpread?.id === spread.id;
            
            return (
              <motion.div
                key={spread.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '1rem',
                  padding: '2rem',
                  border: `2px solid ${isSelected ? 'rgba(167, 139, 250, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(167, 139, 250, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectSpread(spread)}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {/* 装饰性背景元素 */}
                <div style={{
                  position: 'absolute',
                  top: '-2rem',
                  right: '-2rem',
                  width: '8rem',
                  height: '8rem',
                  background: `conic-gradient(from 0deg, rgba(167, 139, 250, 0.1), rgba(244, 114, 182, 0.1))`,
                  borderRadius: '50%',
                  filter: 'blur(2rem)'
                }}></div>

                {/* 牌阵内容 */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  {/* 顶部图标和牌数 */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      fontSize: '2.5rem',
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                    }}>
                      {spread.icon}
                    </div>
                    <div style={{
                      background: `linear-gradient(to right, ${spread.color.replace('from-', '').replace('to-', '')})`,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: 'white'
                    }}>
                      {spread.cardCount}张牌
                    </div>
                  </div>

                  {/* 标题和描述 */}
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '0.75rem'
                  }}>
                    {spread.nameChinese}
                  </h3>
                  
                  <p style={{
                    color: '#9ca3af',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    marginBottom: '1.5rem'
                  }}>
                    {spread.description}
                  </p>

                  {/* 选中状态指示器 */}
                  {isSelected && (
                    <motion.div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem',
                        background: 'rgba(167, 139, 250, 0.1)',
                        borderRadius: '0.5rem',
                        color: '#a78bfa'
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <ChevronRightIcon style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>已选择此牌阵</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 下一步按钮 */}
        <motion.div 
          style={{ textAlign: 'center' }}
          variants={itemVariants}
        >
          <Button
            size="medium"
            onClick={() => navigateTo('topics')}
            disabled={!state.selectedSpread}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1rem',
              background: state.selectedSpread 
                ? 'linear-gradient(to right, #8b5cf6, #6366f1)' 
                : 'rgba(255, 255, 255, 0.1)',
              boxShadow: state.selectedSpread ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : 'none'
            }}
            icon={state.selectedSpread ? "🔮" : undefined}
          >
            {state.selectedSpread ? '选择占卜主题' : '请先选择牌阵'}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SpreadSelectionPage;