const API_BASE_URL = '/api';

/**
 * 解析后端 Result<T> 响应，提取 data 字段。
 * Result<T> 格式：{ code: number, message: string, data: T }
 */
async function unwrapResult(response) {
  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }
  const result = await response.json();
  if (result.code !== 200) {
    throw new Error(result.message || '请求失败');
  }
  return result.data;
}

export const api = {
  // 获取所有牌阵
  getSpreads: async () => {
    const response = await fetch(`${API_BASE_URL}/spreads`);
    return unwrapResult(response);
  },

  // 获取所有牌（洗好的牌组）
  getDeck: async () => {
    const response = await fetch(`${API_BASE_URL}/deck`);
    return unwrapResult(response);
  },

  // 抽牌
  drawCards: async (spreadId) => {
    const response = await fetch(`${API_BASE_URL}/draw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ spreadId }),
    });
    return unwrapResult(response);
  },

  // AI解读（流式输出）
  // onChunk: 每次收到新文本时的回调函数
  // onComplete: 完成时的回调函数
  // onError: 错误时的回调函数
  interpretStream: async (token, direction, spreadName, cards, { onChunk, onComplete, onError }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/interpret/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Accel-Buffering': 'no',
        },
        body: JSON.stringify({ token, direction, spreadName, cards }),
      });

      if (response.status === 403) {
        onError('使用次数已达限制或口令无效');
        return;
      }

      if (!response.ok) {
        onError('解读请求失败');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // 解析 SSE 格式的数据
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5);
            // 检查错误消息
            const trimmedData = data.trim();
            if (trimmedData.startsWith('[ERROR]')) {
              onError(trimmedData.slice(7));
              return;
            } else if (trimmedData.startsWith('[FORBIDDEN]')) {
              onError('使用次数已达限制或口令无效');
              return;
            } else {
              // 空字符串代表换行符，转换为 \n
              onChunk(data === '' ? '\n' : data);
            }
          }
        }
      }
    } catch (error) {
      onError(error.message || '网络错误，请重试');
    }
  },

  // AI解读（非流式）
  interpret: async (token, direction, spreadName, cards) => {
    const response = await fetch(`${API_BASE_URL}/interpret`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, direction, spreadName, cards }),
    });
    return unwrapResult(response);
  },
};

// 八字命理 API
export const baziApi = {
  calculateChart: async (birthDate, isLunar, gender, shiChen) => {
    const response = await fetch(`${API_BASE_URL}/bazi/chart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birthDate, isLunar, gender, shiChen }),
    });
    return unwrapResult(response);
  },

  interpretStream: async (token, chart, { onChunk, onComplete, onError }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bazi/interpret/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Accel-Buffering': 'no' },
        body: JSON.stringify({ token, chart }),
      });
      if (response.status === 403) { onError('使用次数已达限制或口令无效'); return; }
      if (!response.ok) { onError('解读请求失败'); return; }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) { onComplete(); break; }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.slice(5);
            const trimmedData = data.trim();
            if (trimmedData.startsWith('[ERROR]')) { onError(trimmedData.slice(7)); return; }
            else if (trimmedData.startsWith('[FORBIDDEN]')) { onError('使用次数已达限制或口令无效'); return; }
            else { onChunk(data === '' ? '\n' : data); }
          }
        }
      }
    } catch (error) { onError(error.message || '网络错误，请重试'); }
  },
};
