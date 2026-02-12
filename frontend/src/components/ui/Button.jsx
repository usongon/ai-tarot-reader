import { motion } from 'framer-motion';

export function Button({ children, variant = 'primary', size = 'medium', ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300',
    outline: 'bg-transparent hover:bg-white/10 text-white border border-white/30',
  };

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`rounded-lg font-medium transition-all shadow-lg ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
