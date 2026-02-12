import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const ShareCard = forwardRef(({ spread, direction, cards, interpretation }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 p-8 rounded-2xl max-w-4xl mx-auto text-white"
    >
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2">✨ 塔罗占卜 ✨</h1>
        <div className="text-purple-200 text-lg">神秘之旅，洞察未来</div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-purple-300 text-sm mb-1">牌阵类型</div>
            <div className="text-xl font-semibold">{spread?.chineseName || spread?.name}</div>
          </div>
          <div>
            <div className="text-purple-300 text-sm mb-1">占卜方向</div>
            <div className="text-xl font-semibold">{direction}</div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-center">🎴 抽牌结果</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center"
            >
              <span className="text-white font-semibold">{card.nameChinese || card.name}</span>
              {card.reversed && (
                <span className="text-red-300 ml-1">（逆位）</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">🔮 AI大师解读</h2>
        <div className="prose prose-invert prose-sm max-w-none text-purple-100">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{interpretation}</ReactMarkdown>
        </div>
      </div>

      <div className="text-center mt-6 text-purple-300 text-sm">
        由 AI 塔罗占卜平台提供解读服务
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';
