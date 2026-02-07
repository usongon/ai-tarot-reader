import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);

  const handleLinkClick = () => {
    setShowDevelopmentModal(true);
  };

  const closeDevelopmentModal = () => {
    setShowDevelopmentModal(false);
  };

  return (
    <motion.footer 
      style={{
        marginTop: 'auto',
        padding: '2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        textAlign: 'center'
      }}>
        <motion.div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
          whileHover={{ scale: 1.02 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '0.5rem',
              height: '0.5rem',
              background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
              borderRadius: '9999px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}></div>
            <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>© 2026 神秘塔罗</span>
            <div style={{
              width: '0.5rem',
              height: '0.5rem',
              background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
              borderRadius: '9999px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}></div>
          </div>
          
          <p style={{ color: '#6b7280', fontSize: '0.75rem', maxWidth: '28rem' }}>
            探索命运的奥秘，聆听来自宇宙的声音。
            每一次占卜都是心灵与智慧的对话。
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.3s ease' }}
                  onMouseEnter={(e) => e.target.style.color = '#d1d5db'}
                  onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                  onClick={handleLinkClick}>
              隐私政策
            </span>
            <span style={{ cursor: 'pointer', transition: 'color 0.3s ease' }}
                  onMouseEnter={(e) => e.target.style.color = '#d1d5db'}
                  onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                  onClick={handleLinkClick}>
              使用条款
            </span>
            <span style={{ cursor: 'pointer', transition: 'color 0.3s ease' }}
                  onMouseEnter={(e) => e.target.style.color = '#d1d5db'}
                  onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                  onClick={handleLinkClick}>
              联系我们
            </span>
          </div>
        </motion.div>
      </div>

      {/* 开发中弹窗 */}
      {showDevelopmentModal && (
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
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>功能开发中</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              相关功能正在加班加点开发中...
            </p>
            <button
              onClick={closeDevelopmentModal}
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
    </motion.footer>
  );
};

export default Footer;