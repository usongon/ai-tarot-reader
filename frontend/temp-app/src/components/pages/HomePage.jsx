import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const HomePage = ({ onStartReading }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    }}>
      {/* 简化的背景装饰 */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '5rem',
          left: '2.5rem',
          width: '8rem',
          height: '8rem',
          background: 'rgba(139, 92, 246, 0.05)',
          borderRadius: '9999px',
          filter: 'blur(2rem)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '5rem',
          right: '2.5rem',
          width: '10rem',
          height: '10rem',
          background: 'rgba(99, 102, 241, 0.05)',
          borderRadius: '9999px',
          filter: 'blur(2rem)'
        }}></div>
      </div>

      <motion.div
        style={{
          textAlign: 'center',
          maxWidth: '42rem',
          width: '100%',
          zIndex: 10
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 精致的主标题区域 */}
        <motion.div variants={itemVariants} style={{ marginBottom: '1.5rem' }}>
          <motion.div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
              borderRadius: '9999px',
              marginBottom: '1rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <SparklesIcon style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
          </motion.div>
          
          <motion.h1 
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              marginBottom: '0.75rem',
              background: 'linear-gradient(to right, #c084fc, #f472b6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            神秘塔罗
          </motion.h1>
          
          <motion.p 
            style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              maxWidth: '28rem',
              margin: '0 auto'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            探索命运的奥秘
          </motion.p>
        </motion.div>

        {/* 简洁的功能介绍 */}
        <motion.div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            maxWidth: '28rem',
            margin: '0 auto'
          }}
          variants={itemVariants}
        >
          {[
            { icon: '🃏', text: '多种牌阵' },
            { icon: '🤖', text: '智能解读' },
            { icon: '✨', text: '精美体验' }
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                padding: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.5rem'
              }}
            >
              <div style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{feature.icon}</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{feature.text}</div>
            </div>
          ))}
        </motion.div>

        {/* 精致的开始按钮 */}
        <motion.div variants={itemVariants}>
          <Button
            size="small"
            onClick={onStartReading}
            style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            icon={<ArrowRightIcon style={{ height: '1rem', width: '1rem', color: '#ef4444' }} />}
          >
            开始占卜
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;