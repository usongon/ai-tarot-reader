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
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {shiChenList.map((sc) => (
          <motion.button
            key={sc.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(sc.id)}
            className={`p-3 rounded-xl text-center transition-all ${
              value === sc.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <div className="font-bold">{sc.name}</div>
            <div className="text-xs opacity-70">{sc.range}</div>
          </motion.button>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange('unknown')}
        className={`w-full p-3 rounded-xl text-center transition-all ${
          value === 'unknown'
            ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg'
            : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-white/10'
        }`}
      >
        不确定出生时间
      </motion.button>
    </div>
  );
}
