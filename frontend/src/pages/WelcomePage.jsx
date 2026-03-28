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
          className="mb-6 md:mb-8"
        >
          <div className="text-4xl md:hidden mb-3">🌙</div>
          <h1 className="text-3xl md:text-6xl lg:text-8xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
            灵境占卜
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl text-purple-200">神秘之旅 · 洞察未来</p>
        </motion.div>

        {/* 装饰图案 - 仅桌面端 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="hidden md:block text-8xl mb-12"
        >
          ☾ ✨ ☽
        </motion.div>

        {/* 占卜方式选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12 max-w-xs md:max-w-2xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectMode('tarot')}
            className="bg-white/[0.06] md:bg-white/10 backdrop-blur-sm rounded-2xl p-5 md:p-8 cursor-pointer hover:bg-white/20 transition-all border border-white/[0.08] md:border-transparent"
          >
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">🔮</div>
            <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 text-yellow-400 md:text-white">塔罗占卜</h3>
            <p className="text-purple-200 text-sm md:text-base">抽牌解读 · AI智慧</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectMode('bazi')}
            className="bg-white/[0.06] md:bg-white/10 backdrop-blur-sm rounded-2xl p-5 md:p-8 cursor-pointer hover:bg-white/20 transition-all border border-white/[0.08] md:border-transparent"
          >
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">🎋</div>
            <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 text-purple-300 md:text-white">八字命理</h3>
            <p className="text-purple-200 text-sm md:text-base">生辰八字 · 运势分析</p>
          </motion.div>
        </motion.div>

        {/* 底部说明 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-6 md:mt-8 text-purple-300 text-xs md:text-sm"
        >
          * 占卜结果仅供参考娱乐，请勿过度依赖
        </motion.p>
      </motion.div>
    </div>
  );
}
