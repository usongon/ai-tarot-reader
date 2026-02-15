const API_BASE_URL = '/api';

export const api = {
  // 获取所有牌阵
  getSpreads: async () => {
    const response = await fetch(`${API_BASE_URL}/spreads`);
    if (!response.ok) throw new Error('Failed to get spreads');
    return response.json();
  },

  // 获取所有牌（洗好的牌组）
  getDeck: async () => {
    const response = await fetch(`${API_BASE_URL}/deck`);
    if (!response.ok) throw new Error('Failed to get deck');
    return response.json();
  },

  // 抽牌（保留兼容性，改用deck）
  drawCards: async (spreadId) => {
    const response = await fetch(`${API_BASE_URL}/draw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ spreadId }),
    });
    if (!response.ok) throw new Error('Failed to draw cards');
    return response.json();
  },

  // AI解读
  interpret: async (token, direction, spreadName, cards) => {
    const response = await fetch(`${API_BASE_URL}/interpret`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, direction, spreadName, cards }),
    });
    if (response.status === 403) {
      throw new Error('使用次数已达限制或口令无效');
    }
    if (!response.ok) throw new Error('Failed to interpret');
    return response.text();
  },
};
