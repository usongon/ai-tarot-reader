import { motion, AnimatePresence } from 'framer-motion';

export function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-end md:items-center justify-center z-50"
          >
            <div className={`bg-white md:rounded-2xl rounded-t-2xl shadow-2xl ${sizeClasses[size]} w-full p-4 md:p-6 max-h-[90vh] md:max-h-[80vh] overflow-y-auto`}>
              {/* 拖拽指示条 - 仅移动端 */}
              <div className="md:hidden flex justify-center mb-3">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>
              {title && (
                <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">{title}</h2>
              )}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
