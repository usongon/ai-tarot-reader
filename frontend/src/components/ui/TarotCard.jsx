import { motion, AnimatePresence } from 'framer-motion';

export function TarotCard({ card, isFlipped, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="relative cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative w-32 h-48 md:w-40 md:h-60 rounded-xl shadow-2xl overflow-hidden">
        {/* 牌背 */}
        <AnimatePresence mode="wait">
          {!isFlipped && (
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center"
            >
              <div className="w-24 h-36 md:w-32 md:h-48 border-2 border-purple-400/30 rounded-lg flex items-center justify-center">
                <div className="text-purple-300/50 text-4xl">☾</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 牌面 */}
        <AnimatePresence mode="wait">
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, rotate: 10, scale: 0.9 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 flex flex-col items-center justify-center p-3"
            >
              <div className="flex flex-col items-center justify-center w-full h-full">
                {card?.imagePath ? (
                  <img
                    src={card.imagePath}
                    alt={card.nameChinese || card.name}
                    className={`w-full h-auto max-h-[80%] object-contain ${card.reversed ? 'rotate-180' : ''}`}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-amber-900">
                    <div className="text-center w-full px-1">
                      <div className="text-xl font-bold leading-tight">{card?.nameChinese || card?.name || 'Unknown'}</div>
                    </div>
                  </div>
                )}
                <div className="text-amber-900 text-sm font-medium mt-2">
                  {card?.nameChinese || card?.name || 'Unknown'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isFlipped && (
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity"
          animate={{ scale: isFlipped ? 0 : 1 }}
        />
      )}
    </motion.div>
  );
}
