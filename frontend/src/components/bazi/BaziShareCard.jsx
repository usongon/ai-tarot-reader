import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const WU_XING_COLORS = {
  '金': '#facc15',
  '木': '#4ade80',
  '水': '#60a5fa',
  '火': '#f87171',
  '土': '#fbbf24',
};

export const BaziShareCard = forwardRef(({ chart, interpretation }, ref) => {
  const pillars = [
    { label: '年柱', pillar: chart.yearPillar },
    { label: '月柱', pillar: chart.monthPillar },
    { label: '日柱', pillar: chart.dayPillar },
    ...(chart.hourPillar ? [{ label: '时柱', pillar: chart.hourPillar }] : []),
  ];

  const wx = chart.wuXingStats;
  const maxWuXing = Math.max(wx.jin, wx.mu, wx.shui, wx.huo, wx.tu, 1);

  const wuXingItems = [
    { label: '金', value: wx.jin },
    { label: '木', value: wx.mu },
    { label: '水', value: wx.shui },
    { label: '火', value: wx.huo },
    { label: '土', value: wx.tu },
  ];

  return (
    <div
      ref={ref}
      style={{
        width: 800,
        background: 'linear-gradient(135deg, #581c87, #312e81, #581c87)',
        padding: 32,
        borderRadius: 16,
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 标题 */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', margin: '0 0 8px' }}>
          八字命理
        </h1>
        <div style={{ color: '#c4b5fd', fontSize: 16 }}>天机玄妙，命理通明</div>
      </div>

      {/* 基本信息 */}
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between', color: '#e9d5ff' }}>
        <span>{chart.genderText}命 · {chart.solarDate}</span>
        <span>农历 {chart.lunarDate}</span>
      </div>

      {/* 四柱八字 */}
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', margin: '0 0 12px', color: '#fff' }}>四柱八字</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          {pillars.map(({ label, pillar }) => (
            <div key={label} style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 0' }}>
              <div style={{ color: '#c4b5fd', fontSize: 12, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>{pillar.displayText}</div>
              <div style={{ fontSize: 12, color: '#ddd6fe', marginTop: 4 }}>{pillar.tianGanWuXing}{pillar.diZhiWuXing}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 五行分布 */}
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 'bold', margin: '0 0 12px', color: '#fff' }}>
          五行分布 · 日主：{wx.dayMasterWuXing} · {wx.strength}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {wuXingItems.map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 24, color: '#fff' }}>{label}</span>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 10, height: 16 }}>
                <div style={{
                  width: `${Math.max((value / maxWuXing) * 100, value > 0 ? 10 : 0)}%`,
                  height: 16,
                  borderRadius: 10,
                  background: WU_XING_COLORS[label],
                  minWidth: value > 0 ? 16 : 0,
                }} />
              </div>
              <span style={{ width: 24, textAlign: 'right', color: '#fff', fontSize: 14 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 十神关系 */}
      {chart.shiShenList && chart.shiShenList.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 'bold', margin: '0 0 12px', color: '#fff' }}>十神关系</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {chart.shiShenList.map((ss, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: 13,
                color: '#e9d5ff',
              }}>
                {ss.position} {ss.tianGan}({ss.wuXing}) → {ss.shiShen}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 当前大运 */}
      {chart.currentDaYun && (
        <div style={{ background: 'rgba(139,92,246,0.3)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 'bold', margin: '0 0 4px', color: '#fff' }}>当前大运</h2>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
            {chart.currentDaYun.displayText}
            <span style={{ fontSize: 14, fontWeight: 'normal', color: '#ddd6fe', marginLeft: 8 }}>
              ({chart.currentDaYun.startAge}-{chart.currentDaYun.endAge}岁)
            </span>
          </div>
        </div>
      )}

      {/* 大运走势 */}
      {chart.daYunList && chart.daYunList.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 'bold', margin: '0 0 12px', color: '#fff' }}>大运走势</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {chart.daYunList.map((dy, i) => (
              <div key={i} style={{
                padding: '6px 12px',
                borderRadius: 8,
                textAlign: 'center',
                background: dy.current ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontSize: 13,
                minWidth: 60,
              }}>
                <div style={{ fontWeight: 'bold' }}>{dy.displayText}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>{dy.startAge}-{dy.endAge}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI 解读 */}
      {interpretation && (
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', margin: '0 0 12px', color: '#fff' }}>
            AI 命理解读
          </h2>
          <div style={{ color: '#e9d5ff', fontSize: 14, lineHeight: 1.8 }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', margin: '12px 0 6px' }}>{children}</h1>,
                  h2: ({ children }) => <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', margin: '10px 0 6px' }}>{children}</h2>,
                  h3: ({ children }) => <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 'bold', margin: '8px 0 4px' }}>{children}</h3>,
                  p: ({ children }) => <p style={{ color: '#e9d5ff', margin: '4px 0' }}>{children}</p>,
                  li: ({ children }) => <li style={{ color: '#e9d5ff', marginLeft: 16, marginBottom: 2 }}>{children}</li>,
                  strong: ({ children }) => <strong style={{ color: '#fff' }}>{children}</strong>,
                  em: ({ children }) => <em style={{ color: '#c4b5fd' }}>{children}</em>,
                  blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid #7c3aed', paddingLeft: 12, margin: '8px 0', color: '#c4b5fd' }}>{children}</blockquote>,
                }}
              >
                {interpretation}
              </ReactMarkdown>
            </div>
        </div>
      )}

      {/* 底部 */}
      <div style={{ textAlign: 'center', marginTop: 16, color: '#a78bfa', fontSize: 13 }}>
        由 AI 灵境占卜平台提供解读服务
      </div>
    </div>
  );
});

BaziShareCard.displayName = 'BaziShareCard';
