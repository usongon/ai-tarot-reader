import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, BookOpenIcon, HomeIcon } from '@heroicons/react/24/outline';

const Header = ({ onNavigateHome, onNavigateHistory }) => {
  return (
    <motion.header 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(109, 40, 217, 0.8)',
        backdropFilter: 'blur(1rem)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.3)'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <motion.div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNavigateHome}
        >
          <motion.div
            style={{
              padding: '0.5rem',
              borderRadius: '9999px',
              background: 'linear-gradient(to right, #fbbf24, #f59e0b)'
            }}
            whileHover={{ rotate: 15 }}
            transition={{ duration: 0.3 }}
          >
            <SparklesIcon style={{ height: '1.5rem', width: '1.5rem', color: 'white' }} />
          </motion.div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #fbbf24, #f59e0b, #ec4899)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            神秘塔罗
          </h1>
        </motion.div>
        
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNavigateHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          >
            <HomeIcon style={{ height: '1.25rem', width: '1.25rem', color: '#d1d5db' }} />
            <span style={{ color: '#d1d5db' }}>首页</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNavigateHistory}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          >
            <BookOpenIcon style={{ height: '1.25rem', width: '1.25rem', color: '#d1d5db' }} />
            <span style={{ color: '#d1d5db' }}>历史记录</span>
          </motion.button>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;