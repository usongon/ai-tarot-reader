export function StepIndicator({ current, total }) {
  return (
    <div className="md:hidden px-4 pt-1 pb-2 flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`flex-1 h-[3px] rounded-full ${
            i < current ? 'bg-yellow-400' : 'bg-white/15'
          }`}
        />
      ))}
    </div>
  );
}
