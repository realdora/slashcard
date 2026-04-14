import { useRef } from 'react';

const statusConfig = {
  green: { label: 'OPERATIONAL', emoji: '✅', color: '#27a644' },
  yellow: { label: 'ISSUES REPORTED', emoji: '⚠️', color: '#f59e0b' },
  red: { label: 'MAJOR ISSUES', emoji: '🚨', color: '#ef4444' },
};

export default function ShareableStatusCard({ card, stats, onClose }) {
  const cfg = statusConfig[stats.status] || statusConfig.green;

  const handleCopy = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600; canvas.height = 340;
      const ctx = canvas.getContext('2d');

      // Background — Linear dark
      ctx.fillStyle = '#08090a';
      ctx.beginPath(); ctx.roundRect(0, 0, 600, 340, 16); ctx.fill();

      // Status accent bar
      ctx.fillStyle = cfg.color;
      ctx.fillRect(0, 0, 600, 3);

      // Subtle glow
      const glow = ctx.createRadialGradient(80, 80, 0, 80, 80, 180);
      glow.addColorStop(0, cfg.color + '12');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 600, 340);

      ctx.font = '36px serif'; ctx.fillText(cfg.emoji, 32, 68);
      ctx.fillStyle = '#f7f8f8'; ctx.font = '600 30px Inter, system-ui, sans-serif'; ctx.fillText(card.name, 32, 120);
      ctx.fillStyle = cfg.color; ctx.font = '600 14px Inter, system-ui, sans-serif'; ctx.fillText(cfg.label, 32, 148);

      ctx.fillStyle = '#23252a'; ctx.fillRect(32, 172, 536, 1);

      ctx.font = '13px Inter, system-ui, sans-serif'; ctx.fillStyle = '#8a8f98';
      ctx.fillText(`${stats.recentSlashCount} reports in last 7 days`, 32, 204);
      if (stats.reviewCount > 0) ctx.fillText(`${stats.avgRating.toFixed(1)} ★ from ${stats.reviewCount} reviews`, 32, 228);

      ctx.font = '11px Inter, system-ui, sans-serif'; ctx.fillStyle = '#62666d';
      ctx.fillText('SlashCard — slashcard.xyz', 32, 310);

      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          alert('Copied to clipboard!');
        } catch {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = `slashcard-${card.slug}.png`; a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div className="elevation-high rounded-xl max-w-lg w-full overflow-hidden" style={{ background: '#0f1011', boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px, rgba(50,50,93,0.25) 0px 13px 27px -5px, rgba(0,0,0,0.3) 0px 8px 16px -8px' }} onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ boxShadow: 'rgba(255,255,255,0.04) 0px 1px 0px' }}>
          <h3 className="text-[14px] font-medium text-[#d0d6e0]">Share Status Card</h3>
          <button onClick={onClose} className="text-[#62666d] hover:text-[#d0d6e0] cursor-pointer transition-colors text-lg">✕</button>
        </div>

        <div className="p-5">
          <div className="rounded-xl overflow-hidden" style={{ background: '#08090a', boxShadow: `${cfg.color}33 0px 0px 0px 1px` }}>
            <div className="h-[3px]" style={{ background: cfg.color }}></div>
            <div className="p-6">
              <div className="text-3xl mb-3">{cfg.emoji}</div>
              <h2 className="text-[24px] font-semibold text-[#f7f8f8] tracking-[-0.02em]">{card.name}</h2>
              <p className="text-[14px] font-semibold mt-1" style={{ color: cfg.color }}>{cfg.label}</p>
              <div className="mt-5 pt-4 space-y-1.5" style={{ boxShadow: 'rgba(255,255,255,0.04) 0px -1px 0px' }}>
                <p className="text-[13px]" style={{ color: '#8a8f98' }}>{stats.recentSlashCount} reports in last 7 days</p>
                {stats.reviewCount > 0 && <p className="text-[13px]" style={{ color: '#8a8f98' }}>{stats.avgRating.toFixed(1)} ★ from {stats.reviewCount} reviews</p>}
              </div>
              <p className="mt-4 text-[11px]" style={{ color: '#62666d' }}>SlashCard — slashcard.xyz</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 flex gap-2.5" style={{ boxShadow: 'rgba(255,255,255,0.04) 0px -1px 0px' }}>
          <button onClick={handleCopy} className="flex-1 py-[10px] rounded-lg font-medium text-[13px] text-white cursor-pointer transition-all hover:opacity-90" style={{
            background: 'linear-gradient(135deg, #5e6ad2, #7170ff)',
            boxShadow: 'rgba(113,112,255,0.25) 0px 4px 12px',
          }}>Copy Image</button>
          <button onClick={onClose} className="px-4 py-[10px] rounded-lg font-medium text-[13px] cursor-pointer transition-all hover:bg-white/[0.04]" style={{
            color: '#8a8f98', boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px',
          }}>Close</button>
        </div>
      </div>
    </div>
  );
}
