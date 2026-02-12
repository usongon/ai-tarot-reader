import { motion } from 'framer-motion';

export function Loading({ message = '正在解读...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="text-6xl mb-4"
      >
        ☾
      </motion.div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
}
