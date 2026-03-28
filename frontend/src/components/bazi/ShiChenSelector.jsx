import { motion } from 'framer-motion';

const shiChenList = [
  { id: 'zi', name: '子时', range: '23:00-01:00' },
  { id: 'chou', name: '丑时', range: '01:00-03:00' },
  { id: 'yin', name: '寅时', range: '03:00-05:00' },
  { id: 'mao', name: '卯时', range: '05:00-07:00' },
  { id: 'chen', name: '辰时', range: '07:00-09:00' },
  { id: 'si', name: '巳时', range: '09:00-11:00' },
  { id: 'wu', name: '午时', range: '11:00-13:00' },
  { id: 'wei', name: '未时', range: '13:00-15:00' },
  { id: 'shen', name: '申时', range: '15:00-17:00' },
  { id: 'you', name: '酉时', range: '17:00-19:00' },
  { id: 'xu', name: '戌时', range: '19:00-21:00' },
  { id: 'hai', name: '亥时', range: '21:00-23:00' },
];

export function ShiChenSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-1.5 md:gap-2">
        {shiChenList.map((sc) => (
          <motion.button
            key={sc.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(sc.id)}
            className={`p-2 md:p-3 rounded-xl text-center transition-all min-h-[44px] md:min-h-0 ${
              value === sc.id
                ? 'bg-gradient-to-r from-purple-600/40 to-indigo-600/40 md:from-purple-600 md:to-indigo-600 text-white border border-purple-400/30 md:border-transparent shadow-lg'
                : 'bg-white/[0.06] md:bg-white/10 text-white hover:bg-white/[0.1] md:hover:bg-white/20 border border-white/[0.06] md:border-transparent'
            }`}
          >
            <div className="font-bold text-xs md:text-sm">{sc.name}</div>
            <div className="text-[9px] md:text-xs opacity-60">{sc.range}</div>
          </motion.button>
        ))}
      </div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange('unknown')}
        className={`w-full p-2.5 md:p-3 rounded-xl text-center transition-all text-xs md:text-sm ${
          value === 'unknown'
            ? 'bg-gradient-to-r from-gray-600/40 to-gray-700/40 md:from-gray-500 md:to-gray-600 text-white shadow-lg border border-gray-400/20 md:border-transparent'
            : 'bg-white/[0.04] md:bg-white/5 text-purple-300 hover:bg-white/[0.08] md:hover:bg-white/10 border border-white/[0.06] md:border-white/10'
        }`}
      >
        不确定出生时间
      </motion.button>
    </div>
  );
}
