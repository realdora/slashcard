import { useMemo } from 'react';

export default function SlashTimeline({ reports }) {
  const bars = useMemo(() => {
    const now = Date.now();
    const hours = Array.from({ length: 24 }, (_, i) => ({ count: 0 }));
    reports.forEach(r => {
      const h = Math.floor((now - new Date(r.created_at).getTime()) / 3600000);
      if (h >= 0 && h < 24) hours[h].count++;
    });
    return hours.reverse();
  }, [reports]);

  const maxCount = Math.max(...bars.map(b => b.count), 1);
  const total24h = reports.filter(r => (Date.now() - new Date(r.created_at).getTime()) < 86400000).length;

  return (
    <div className="card-border rounded-xl p-5" style={{ background: 'rgba(15,16,17,0.6)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-medium text-[#d0d6e0]">Reports — Last 24h</h3>
        <span className="text-[12px] font-medium tabular-nums" style={{ fontFeatureSettings: '"tnum"', color: total24h > 5 ? '#ef4444' : '#62666d' }}>
          {total24h} reports
        </span>
      </div>
      <div className="flex items-end gap-[2px] h-[72px]">
        {bars.map((bar, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-[2px] transition-all group relative cursor-default"
            style={{
              height: bar.count > 0 ? `${Math.max((bar.count / maxCount) * 100, 10)}%` : '2px',
              background: bar.count > 2 ? '#ef4444' : bar.count > 0 ? '#f59e0b' : 'rgba(255,255,255,0.04)',
              opacity: bar.count > 0 ? 1 : 0.6,
            }}
          >
            {bar.count > 0 && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:flex px-2 py-1 rounded-md text-[10px] font-medium text-[#f7f8f8] whitespace-nowrap" style={{
                background: '#191a1b',
                boxShadow: 'rgba(255,255,255,0.08) 0px 0px 0px 1px, rgba(50,50,93,0.25) 0px 4px 12px',
              }}>
                {bar.count}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2.5">
        <span className="text-[10px]" style={{ color: '#62666d' }}>24h ago</span>
        <span className="text-[10px]" style={{ color: '#62666d' }}>Now</span>
      </div>
    </div>
  );
}
