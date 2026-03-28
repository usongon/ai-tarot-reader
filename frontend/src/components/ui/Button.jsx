import { motion } from 'framer-motion';

export function Button({ children, variant = 'primary', size = 'medium', className = '', ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300',
    outline: 'bg-transparent hover:bg-white/10 text-white border border-white/30',
  };

  const sizes = {
    small: 'px-3 md:px-4 py-2 text-sm min-h-[36px] md:min-h-0',
    medium: 'px-4 md:px-6 py-3 text-sm md:text-base min-h-[44px] md:min-h-0',
    large: 'px-6 md:px-8 py-3.5 md:py-4 text-base md:text-lg min-h-[44px] md:min-h-0',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`rounded-xl md:rounded-lg font-medium transition-all shadow-lg ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
