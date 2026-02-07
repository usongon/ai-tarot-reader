import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import { ClockIcon } from '@heroicons/react/24/outline';

const Layout = ({ children, onNavigateHome, onNavigateHistory, showHistoryModal, onCloseHistoryModal }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    }}>
      <Header onNavigateHome={onNavigateHome} onNavigateHistory={onNavigateHistory} />
      
      {/* 主要内容区域 */}
      <main style={{ flexGrow: 1, paddingTop: '5rem', paddingBottom: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ width: '100%' }}
        >
          {children}
        </motion.div>
      </main>
      
      <Footer />
      
      {/* 历史记录弹窗 - 全局显示 */}
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
          <motion.div 
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              minWidth: '300px',
              maxWidth: '90%',
              textAlign: 'center'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
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
              onClick={onCloseHistoryModal}
              style={{
                padding: '0.5rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                background: '#8b5cf6',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              知道了
            </button>
          </motion.div>
        </div>
      )}
      
      {/* 背景装饰元素 */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '16rem',
          height: '16rem',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '9999px',
          filter: 'blur(3rem)',
          animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '24rem',
          height: '24rem',
          background: 'rgba(99, 102, 241, 0.1)',
          borderRadius: '9999px',
          filter: 'blur(3rem)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>
      </div>
    </div>
  );
};

export default Layout;