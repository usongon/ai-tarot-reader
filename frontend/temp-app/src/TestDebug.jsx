import React, { useState, useEffect } from 'react';

const TestDebug = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/deck')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        console.log('API返回数据:', data.length, '张牌');
        setCards(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('API错误:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>调试页面 - 卡牌数量: {cards.length}</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
        gap: '1rem',
        marginTop: '2rem'
      }}>
        {cards.slice(0, 20).map((card, index) => (
          <div key={index} style={{
            background: '#f0f0f0',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🃏</div>
            <div style={{ fontSize: '0.8rem' }}>{card.nameChinese}</div>
          </div>
        ))}
      </div>
      {cards.length > 20 && <div>... 还有 {cards.length - 20} 张牌</div>}
    </div>
  );
};

export default TestDebug;