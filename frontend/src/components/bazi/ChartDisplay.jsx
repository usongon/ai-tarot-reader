const WU_XING_COLORS = {
  '金': 'from-yellow-400 to-amber-500',
  '木': 'from-green-400 to-emerald-500',
  '水': 'from-blue-400 to-cyan-500',
  '火': 'from-red-400 to-rose-500',
  '土': 'from-amber-400 to-yellow-600',
};

export function ChartDisplay({ chart }) {
  if (!chart) return null;

  const pillars = [
    { label: '年柱', pillar: chart.yearPillar },
    { label: '月柱', pillar: chart.monthPillar },
    { label: '日柱', pillar: chart.dayPillar },
    ...(chart.hourPillar ? [{ label: '时柱', pillar: chart.hourPillar }] : []),
  ];

  const wx = chart.wuXingStats;
  const maxWuXing = Math.max(wx.jin, wx.mu, wx.shui, wx.huo, wx.tu, 1);

  return (
    <div className="space-y-4">
      {/* 基本信息 */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
        <div className="flex justify-between items-center">
          <span className="text-purple-200">公历：{chart.solarDate}</span>
          <span className="text-purple-200">农历：{chart.lunarDate}</span>
        </div>
        <div className="mt-1 text-purple-200">{chart.genderText}命</div>
      </div>

      {/* 四柱八字 */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <h3 className="text-white font-bold mb-3">四柱八字</h3>
        <div className="grid grid-cols-4 gap-3">
          {pillars.map(({ label, pillar }) => (
            <div key={label} className="text-center">
              <div className="text-purple-300 text-xs mb-1">{label}</div>
              <div className="bg-gradient-to-b from-purple-600/50 to-indigo-600/50 rounded-lg py-3 px-2">
                <div className="text-2xl font-bold text-white">{pillar.displayText}</div>
                <div className="text-xs text-purple-200 mt-1">{pillar.tianGanWuXing}{pillar.diZhiWuXing}</div>
              </div>
            </div>
          ))}
        </div>
        {chart.hourPillarMissing && (
          <p className="text-yellow-300 text-xs mt-2 text-center">* 时柱未知（出生时间不确定），基于三柱分析</p>
        )}
      </div>

      {/* 五行分布 */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <h3 className="text-white font-bold mb-3">五行分布 · 日主：{wx.dayMasterWuXing} · {wx.strength}</h3>
        <div className="space-y-2">
          {[
            { label: '金', value: wx.jin },
            { label: '木', value: wx.mu },
            { label: '水', value: wx.shui },
            { label: '火', value: wx.huo },
            { label: '土', value: wx.tu },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-white w-6">{label}</span>
              <div className="flex-1 bg-white/10 rounded-full h-4">
                <div className={`bg-gradient-to-r ${WU_XING_COLORS[label]} rounded-full h-4 transition-all`}
                  style={{ width: `${Math.max((value / maxWuXing) * 100, value > 0 ? 10 : 0)}%` }} />
              </div>
              <span className="text-white text-sm w-6 text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 当前大运 */}
      {chart.currentDaYun && (
        <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm rounded-xl p-4">
          <h3 className="text-white font-bold mb-1">当前大运</h3>
          <div className="text-2xl font-bold text-white">
            {chart.currentDaYun.displayText}
            <span className="text-sm font-normal text-purple-200 ml-2">
              ({chart.currentDaYun.startAge}-{chart.currentDaYun.endAge}岁)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
