import { motion } from 'framer-motion';

export function MobileNavBar({ title, onBack, rightAction }) {
  return (
    <div className="md:hidden sticky top-0 z-20 bg-black/30 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between">
      <button onClick={onBack} className="text-gray-500 text-sm active:text-gray-300">
        ← 返回
      </button>
      <div className="text-purple-100 text-sm font-medium">{title}</div>
      <div className="min-w-[48px] text-right">
        {rightAction || ''}
      </div>
    </div>
  );
}
