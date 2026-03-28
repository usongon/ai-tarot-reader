import { motion } from 'framer-motion';
import { MobileNavBar } from '../components/ui/MobileNavBar';
import { StepIndicator } from '../components/ui/StepIndicator';

export function SpreadSelectionPage({ spreads, onSelect, onBack }) {
  const spreadDescriptions = {
    single: '最简单的占卜方式，用于快速了解当前运势',
    'three-card': '经典的三牌阵，代表过去、现在、未来',
    'celtic-cross': '复杂且强大的牌阵，可深入分析问题各个方面',
  };

  const spreadCardCounts = {
    single: 1,
    'three-card': 3,
    'celtic-cross': 10,
  };

  const spreadIcons = {
    single: '🔮',
    'three-card': '🃏',
    'celtic-cross': '✦',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex flex-col">
      {/* 移动端导航 + 步骤条 */}
      <MobileNavBar title="选择牌阵" onBack={onBack} />
      <StepIndicator current={1} total={3} />

      {/* 移动端内容 - 纵向列表 */}
      <div className="flex-1 p-3 md:hidden overflow-auto">
        <div className="text-center mb-4">
          <p className="text-purple-300 text-xs">请选择适合您的牌阵类型</p>
        </div>
        <div className="space-y-2.5">
          {spreads.map((spread, index) => (
            <motion.div
              key={spread.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => onSelect(spread)}
              className="bg-white/[0.06] backdrop-blur-sm rounded-xl p-3.5 cursor-pointer active:bg-white/[0.12] transition-all border border-white/[0.08] flex items-center gap-3"
            >
              <div className="text-2xl">{spreadIcons[spread.id] || '🎴'}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">{spread.chineseName}</div>
                <div className="text-purple-300 text-xs mt-0.5 truncate">{spreadDescriptions[spread.id]}</div>
              </div>
              <div className="bg-purple-600/30 rounded-lg px-2.5 py-1 text-xs text-purple-200 font-medium">
                {spreadCardCounts[spread.id]}张
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 桌面端内容 - 保持原样 */}
      <div className="hidden md:flex flex-1 items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto w-full"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">选择牌阵</h1>
            <p className="text-purple-200">请选择适合您的牌阵类型</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {spreads.map((spread, index) => (
              <motion.div
                key={spread.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelect(spread)}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition-all transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">🎴</div>
                  <h3 className="text-xl font-bold text-white mb-2">{spread.chineseName}</h3>
                  <p className="text-purple-200 text-sm mb-3">{spread.name}</p>
                  <div className="bg-purple-600/50 rounded-lg px-4 py-2">
                    <span className="text-white text-sm">{spreadCardCounts[spread.id]} 张牌</span>
                  </div>
                  <p className="text-purple-200 text-sm mt-4">{spreadDescriptions[spread.id]}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <button onClick={onBack} className="text-purple-300 hover:text-white transition-colors">
              ← 返回
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
