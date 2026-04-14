export function StarDisplay({ rating, size = 'sm' }) {
  const px = size === 'sm' ? 11 : size === 'md' ? 15 : 20;
  return (
    <span className="inline-flex gap-[1px]" style={{ fontSize: px }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#f59e0b' : 'rgba(255,255,255,0.08)' }}>★</span>
      ))}
    </span>
  );
}

export function StarInput({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="text-[28px] transition-all cursor-pointer hover:scale-110"
          style={{
            color: i <= value ? '#f59e0b' : 'rgba(255,255,255,0.10)',
            filter: i <= value ? 'drop-shadow(0 0 6px rgba(245,158,11,0.35))' : 'none',
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
