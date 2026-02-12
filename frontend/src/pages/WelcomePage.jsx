import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

export function WelcomePage({ onStart }) {
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
            塔罗占卜
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

        {/* 功能介绍 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-4xl mb-4">🎴</div>
            <h3 className="text-xl font-bold mb-2">多种牌阵</h3>
            <p className="text-purple-200">支持单张牌、三牌阵、凯尔特十字等多种经典牌阵</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-4xl mb-4">🔮</div>
            <h3 className="text-xl font-bold mb-2">AI大师解读</h3>
            <p className="text-purple-200">基于深度学习的AI为您提供专业精准的解读</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-bold mb-2">一键分享</h3>
            <p className="text-purple-200">生成精美占卜卡片，分享给朋友或保存留念</p>
          </div>
        </motion.div>

        {/* 使用说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-12 text-left"
        >
          <h3 className="text-xl font-bold mb-4 text-center">使用步骤</h3>
          <div className="space-y-3 text-purple-100">
            <p>1. 选择您喜欢的牌阵类型</p>
            <p>2. 选择占卜方向（爱情、事业、健康、财运等）</p>
            <p>3. 在洗好的牌中抽取所需的卡片</p>
            <p>4. 输入密钥，获取AI大师的专业解读</p>
            <p>5. 生成精美的占卜卡片分享或保存</p>
          </div>
        </motion.div>

        {/* 开始按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Button size="large" onClick={onStart}>
            ✨ 开始占卜 ✨
          </Button>
        </motion.div>

        {/* 底部说明 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-8 text-purple-300 text-sm"
        >
          * 塔罗占卜仅供参考娱乐，请勿过度依赖
        </motion.p>
      </motion.div>
    </div>
  );
}
