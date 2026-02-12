import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
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
          <Button variant="secondary" onClick={onBack}>
            ← 返回
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
