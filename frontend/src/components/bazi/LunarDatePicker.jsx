const lunarMonths = [
  { value: 1, label: '正月' }, { value: 2, label: '二月' },
  { value: 3, label: '三月' }, { value: 4, label: '四月' },
  { value: 5, label: '五月' }, { value: 6, label: '六月' },
  { value: 7, label: '七月' }, { value: 8, label: '八月' },
  { value: 9, label: '九月' }, { value: 10, label: '十月' },
  { value: 11, label: '冬月' }, { value: 12, label: '腊月' },
];

const lunarDays = Array.from({ length: 30 }, (_, i) => {
  const d = i + 1;
  const chars = ['初','十','廿','三'];
  const units = ['','一','二','三','四','五','六','七','八','九','十'];
  let label;
  if (d === 10) label = '初十';
  else if (d === 20) label = '二十';
  else if (d === 30) label = '三十';
  else {
    const tens = Math.floor(d / 10);
    const ones = d % 10;
    label = chars[tens] + units[ones];
  }
  return { value: d, label };
});

export function LunarDatePicker({ value, onChange }) {
  const parts = value ? value.split('-').map(Number) : [1990, 1, 1];
  const year = parts[0], month = parts[1], day = parts[2];

  const handleChange = (newYear, newMonth, newDay) => {
    onChange(`${newYear || year}-${String(newMonth || month).padStart(2, '0')}-${String(newDay || day).padStart(2, '0')}`);
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      <select value={year} onChange={(e) => handleChange(Number(e.target.value), null, null)}
        className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500">
        {Array.from({ length: 71 }, (_, i) => 1940 + i).map(y => (
          <option key={y} value={y} className="text-black">{y}年</option>
        ))}
      </select>
      <select value={month} onChange={(e) => handleChange(null, Number(e.target.value), null)}
        className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500">
        {lunarMonths.map(m => (
          <option key={m.value} value={m.value} className="text-black">{m.label}</option>
        ))}
      </select>
      <select value={day} onChange={(e) => handleChange(null, null, Number(e.target.value))}
        className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500">
        {lunarDays.map(d => (
          <option key={d.value} value={d.value} className="text-black">{d.label}</option>
        ))}
      </select>
    </div>
  );
}
