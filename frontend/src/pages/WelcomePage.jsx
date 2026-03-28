import { motion } from 'framer-motion';

export function WelcomePage({ onSelectMode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center text-white"
      >
        {/* 标题 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
            灵境占卜
          </h1>
          <p className="text-2xl md:text-3xl text-purple-200">神秘之旅 · 洞察未来</p>
        </motion.div>

        {/* 装饰图案 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-8xl mb-12"
        >
          ☾ ✨ ☽
        </motion.div>

        {/* 占卜方式选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectMode('tarot')}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 cursor-pointer hover:bg-white/20 transition-all"
          >
            <div className="text-5xl mb-4">🎴</div>
            <h3 className="text-2xl font-bold mb-2">塔罗占卜</h3>
            <p className="text-purple-200">选择牌阵，抽取塔罗牌，AI 大师为您解读牌意</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectMode('bazi')}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 cursor-pointer hover:bg-white/20 transition-all"
          >
            <div className="text-5xl mb-4">🧭</div>
            <h3 className="text-2xl font-bold mb-2">八字命理</h3>
            <p className="text-purple-200">输入出生信息，专业排盘，AI 大师为您解读命理</p>
          </motion.div>
        </motion.div>

        {/* 底部说明 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-8 text-purple-300 text-sm"
        >
          * 占卜结果仅供参考娱乐，请勿过度依赖
        </motion.p>
      </motion.div>
    </div>
  );
}
