export function SolarDatePicker({ value, onChange }) {
  const parts = value ? value.split('-').map(Number) : [1990, 1, 1];
  const year = parts[0], month = parts[1], day = parts[2];

  const handleChange = (newYear, newMonth, newDay) => {
    const y = newYear || year;
    const m = newMonth || month;
    const d = newDay || day;
    onChange(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  };

  // 当月最大天数
  const maxDays = new Date(year, month, 0).getDate();

  return (
    <div className="grid grid-cols-3 gap-3">
      <select value={year} onChange={(e) => handleChange(Number(e.target.value), null, null)}
        className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-3 focus:ring-2 focus:ring-purple-500 cursor-pointer">
        {Array.from({ length: 100 }, (_, i) => 2025 - i).map(y => (
          <option key={y} value={y} className="text-black">{y}年</option>
        ))}
      </select>
      <select value={month} onChange={(e) => handleChange(null, Number(e.target.value), null)}
        className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-3 focus:ring-2 focus:ring-purple-500 cursor-pointer">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
          <option key={m} value={m} className="text-black">{m}月</option>
        ))}
      </select>
      <select value={Math.min(day, maxDays)} onChange={(e) => handleChange(null, null, Number(e.target.value))}
        className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-3 focus:ring-2 focus:ring-purple-500 cursor-pointer">
        {Array.from({ length: maxDays }, (_, i) => i + 1).map(d => (
          <option key={d} value={d} className="text-black">{d}日</option>
        ))}
      </select>
    </div>
  );
}
