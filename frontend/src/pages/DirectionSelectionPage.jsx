import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

const directions = [
  { id: 'love', name: '爱情', icon: '💕', color: 'from-pink-500 to-rose-500' },
  { id: 'career', name: '事业', icon: '💼', color: 'from-blue-500 to-indigo-500' },
  { id: 'health', name: '健康', icon: '🏥', color: 'from-green-500 to-emerald-500' },
  { id: 'wealth', name: '财运', icon: '💰', color: 'from-yellow-500 to-amber-500' },
  { id: 'relationship', name: '感情发展', icon: '❤️', color: 'from-red-500 to-pink-500' },
  { id: 'study', name: '学业', icon: '📚', color: 'from-purple-500 to-indigo-500' },
  { id: 'social', name: '人缘', icon: '🤝', color: 'from-teal-500 to-cyan-500' },
  { id: 'general', name: '综合运势', icon: '🌟', color: 'from-violet-500 to-purple-500' },
];

export function DirectionSelectionPage({ spread, onSelect, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">选择占卜方向</h1>
          <p className="text-purple-200">
            已选牌阵：<span className="font-bold">{spread?.chineseName}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {directions.map((direction, index) => (
            <motion.div
              key={direction.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(direction)}
              className="cursor-pointer"
            >
              <div className={`bg-gradient-to-br ${direction.color} rounded-2xl p-6 text-center transform transition-all hover:scale-105 hover:shadow-2xl`}>
                <div className="text-4xl mb-2">{direction.icon}</div>
                <div className="text-white font-bold text-lg">{direction.name}</div>
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
