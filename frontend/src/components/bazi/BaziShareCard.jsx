import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const BaziShareCard = forwardRef(({ chart, interpretation }, ref) => {
  const pillars = [
    { label: '年柱', pillar: chart.yearPillar },
    { label: '月柱', pillar: chart.monthPillar },
    { label: '日柱', pillar: chart.dayPillar },
    ...(chart.hourPillar ? [{ label: '时柱', pillar: chart.hourPillar }] : []),
  ];

  return (
    <div
      ref={ref}
      className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 p-8 rounded-2xl max-w-4xl mx-auto text-white"
      style={{ width: 800 }}
    >
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2">🧭 八字命理 🧭</h1>
        <div className="text-purple-200 text-lg">天机玄妙，命理通明</div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
        <div className="flex justify-between">
          <span className="text-purple-200">{chart.genderText}命 · {chart.solarDate}</span>
          <span className="text-purple-200">农历 {chart.lunarDate}</span>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-4">
        <h2 className="text-xl font-bold mb-4 text-center">四柱八字</h2>
        <div className="grid grid-cols-4 gap-3">
          {pillars.map(({ label, pillar }) => (
            <div key={label} className="text-center bg-white/10 rounded-lg py-3">
              <div className="text-purple-300 text-xs mb-1">{label}</div>
              <div className="text-2xl font-bold">{pillar.displayText}</div>
              <div className="text-xs text-purple-200 mt-1">{pillar.tianGanWuXing}{pillar.diZhiWuXing}</div>
            </div>
          ))}
        </div>
      </div>

      {chart.wuXingStats && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <div className="text-center">
            <span className="text-sm text-purple-200">
              五行 · 金{chart.wuXingStats.jin} 木{chart.wuXingStats.mu} 水{chart.wuXingStats.shui} 火{chart.wuXingStats.huo} 土{chart.wuXingStats.tu} · 日主{chart.wuXingStats.dayMasterWuXing} · {chart.wuXingStats.strength}
            </span>
          </div>
        </div>
      )}

      {interpretation && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-4">
          <h2 className="text-xl font-bold mb-4 text-center">🔮 AI 命理解读</h2>
          <div className="prose prose-invert prose-sm max-w-none text-purple-100 max-h-[300px] overflow-hidden">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{interpretation}</ReactMarkdown>
          </div>
        </div>
      )}

      <div className="text-center mt-6 text-purple-300 text-sm">
        由 AI 灵境占卜平台提供解读服务
      </div>
    </div>
  );
});

BaziShareCard.displayName = 'BaziShareCard';
