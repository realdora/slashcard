import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import CardLogo from '../components/CardLogo';
import StatusBadge from '../components/StatusBadge';

const issueTypes = [
  { value: 'frozen_funds', icon: '🧊', label: 'Frozen Funds', desc: 'Card or account frozen' },
  { value: 'withdrawal_delayed', icon: '⏳', label: 'Withdrawal Delayed', desc: 'Funds stuck in transit' },
  { value: 'fee_change', icon: '💸', label: 'Fee Change', desc: 'Unexpected fee increase' },
  { value: 'kyc_rejected', icon: '🚫', label: 'KYC Rejected', desc: 'KYC failed or re-requested' },
  { value: 'support_unresponsive', icon: '📵', label: 'Support Down', desc: 'No reply from support' },
  { value: 'other', icon: '⚠️', label: 'Other', desc: 'Something else' },
];

const issueLabels = {
  frozen_funds: 'Frozen Funds', withdrawal_delayed: 'Withdrawal Delayed',
  fee_change: 'Fee Change', kyc_rejected: 'KYC Rejected',
  support_unresponsive: 'Support Down', other: 'Other',
};

export default function ReportPage() {
  const { slug } = useParams();
  const { cards, addSlashReport, getCardStats } = useData();
  const card = cards.find(c => c.slug === slug);

  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!card) return <div className="max-w-[520px] mx-auto px-6 py-20 text-center" style={{ color: '#62666d' }}>Card not found</div>;

  const stats = getCardStats(card.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!issueType) { setError('Please select an issue type'); return; }
    addSlashReport({ card_id: card.id, issue_type: issueType, description: description.trim(), display_name: displayName.trim() || 'Anonymous' });
    setSubmitted(true);
  };

  if (submitted) {
    return <SubmittedView card={card} slug={slug} issueType={issueType} stats={stats} />;
  }

  return (
    <div className="max-w-[520px] mx-auto px-6 py-8">
      <Link to={`/card/${slug}`} className="inline-flex items-center gap-1 text-[13px] no-underline transition-colors hover:text-[#d0d6e0]" style={{ color: '#62666d' }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        {card.name}
      </Link>

      <div className="mt-4 card-border rounded-xl p-6" style={{ background: 'rgba(15,16,17,0.6)' }}>
        <div className="flex items-center gap-3 mb-2">
          <CardLogo card={card} />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[16px] font-medium text-[#f7f8f8]">/ Slash Report</h1>
              <StatusBadge status={stats.status} count={stats.recentSlashCount} />
            </div>
            <p className="text-[12px]" style={{ color: '#62666d' }}>{card.name} — quick incident report</p>
          </div>
        </div>

        <div className="text-[12px] rounded-lg p-3 mb-6 leading-relaxed" style={{
          color: '#8a8f98', background: 'rgba(255,255,255,0.02)',
          boxShadow: 'rgba(255,255,255,0.04) 0px 0px 0px 1px',
        }}>
          Your report updates the live status indicator and helps others see issues in real time.
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[13px] font-medium text-[#d0d6e0] mb-3">What happened?</label>
            <div className="grid grid-cols-2 gap-2">
              {issueTypes.map(type => (
                <button key={type.value} type="button" onClick={() => setIssueType(type.value)}
                  className="text-left px-3.5 py-3 rounded-lg text-[13px] transition-all cursor-pointer"
                  style={{
                    background: issueType === type.value ? 'rgba(239,68,68,0.06)' : 'transparent',
                    boxShadow: issueType === type.value
                      ? 'rgba(239,68,68,0.25) 0px 0px 0px 1px, rgba(239,68,68,0.08) 0px 0px 0px 4px'
                      : 'rgba(255,255,255,0.06) 0px 0px 0px 1px',
                    color: issueType === type.value ? '#ef4444' : '#8a8f98',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[14px]">{type.icon}</span>
                    <span className="font-medium">{type.label}</span>
                  </div>
                  <div className="text-[11px] mt-0.5 ml-[26px]" style={{ opacity: 0.5 }}>{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#d0d6e0] mb-2">
              Details <span style={{ color: '#62666d', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Any details that might help others..."
              rows={3} className="w-full rounded-lg px-4 py-3 text-[13px] text-[#d0d6e0] placeholder:text-[#4a4d54] focus:outline-none resize-none transition-all" style={{
                background: 'rgba(255,255,255,0.02)',
                boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px',
              }}
              onFocus={e => e.target.style.boxShadow = 'rgba(239,68,68,0.25) 0px 0px 0px 1px, rgba(239,68,68,0.08) 0px 0px 0px 4px'}
              onBlur={e => e.target.style.boxShadow = 'rgba(255,255,255,0.06) 0px 0px 0px 1px'}
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#d0d6e0] mb-2">
              Display Name <span style={{ color: '#62666d', fontWeight: 400 }}>(defaults to Anonymous)</span>
            </label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
              placeholder="Anonymous"
              className="w-full rounded-lg px-4 py-[10px] text-[13px] text-[#d0d6e0] placeholder:text-[#4a4d54] focus:outline-none transition-all" style={{
                background: 'rgba(255,255,255,0.02)',
                boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px',
              }}
              onFocus={e => e.target.style.boxShadow = 'rgba(239,68,68,0.25) 0px 0px 0px 1px, rgba(239,68,68,0.08) 0px 0px 0px 4px'}
              onBlur={e => e.target.style.boxShadow = 'rgba(255,255,255,0.06) 0px 0px 0px 1px'}
            />
          </div>

          {error && (
            <div className="text-[13px] rounded-lg px-4 py-[10px]" style={{
              color: '#ef4444', background: 'rgba(239,68,68,0.06)',
              boxShadow: 'rgba(239,68,68,0.15) 0px 0px 0px 1px',
            }}>{error}</div>
          )}

          <button type="submit" className="w-full py-[10px] rounded-lg font-medium text-[14px] text-white cursor-pointer transition-all hover:opacity-90" style={{
            background: '#ef4444',
            boxShadow: 'rgba(239,68,68,0.25) 0px 4px 12px',
          }}>Submit Slash Report</button>
        </form>
      </div>
    </div>
  );
}

function SubmittedView({ card, slug, issueType, stats }) {
  const canvasRef = useRef(null);

  const statusLabel = stats.recentSlashCount > 15 ? 'MAJOR ISSUES' : stats.recentSlashCount > 5 ? 'ISSUES REPORTED' : 'ISSUE REPORTED';
  const statusColor = stats.recentSlashCount > 15 ? '#ef4444' : stats.recentSlashCount > 5 ? '#f59e0b' : '#ef4444';
  const reportCount = stats.recentSlashCount + 1; // include the one just submitted

  const shareUrl = `https://crypto-card-review.vercel.app/card/${slug}`;
  const shareText = `🚨 ${card.name}: ${issueLabels[issueType] || 'Issue'} reported\n\n${reportCount} reports this week on SlashCard\n\nCheck status & report issues →`;

  const handleShareX = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleCopyImage = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600; canvas.height = 340;
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#08090a';
      ctx.beginPath(); ctx.roundRect(0, 0, 600, 340, 16); ctx.fill();

      // Red accent bar
      ctx.fillStyle = statusColor;
      ctx.fillRect(0, 0, 600, 3);

      // Glow
      const glow = ctx.createRadialGradient(80, 80, 0, 80, 80, 180);
      glow.addColorStop(0, statusColor + '15');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, 600, 340);

      // Content
      ctx.font = '36px serif'; ctx.fillText('🚨', 32, 65);
      ctx.fillStyle = '#f7f8f8'; ctx.font = '600 28px Inter, system-ui, sans-serif'; ctx.fillText(card.name, 32, 115);
      ctx.fillStyle = statusColor; ctx.font = '600 14px Inter, system-ui, sans-serif'; ctx.fillText(statusLabel, 32, 142);

      ctx.fillStyle = '#23252a'; ctx.fillRect(32, 165, 536, 1);

      ctx.font = '14px Inter, system-ui, sans-serif'; ctx.fillStyle = '#e8e9eb';
      ctx.fillText(`${issueLabels[issueType] || 'Issue'} reported`, 32, 198);
      ctx.font = '13px Inter, system-ui, sans-serif'; ctx.fillStyle = '#8a8f98';
      ctx.fillText(`${reportCount} reports this week`, 32, 224);
      if (stats.reviewCount > 0) {
        ctx.fillText(`${stats.avgRating.toFixed(1)} ★ from ${stats.reviewCount} reviews`, 32, 248);
      }

      ctx.font = '11px Inter, system-ui, sans-serif'; ctx.fillStyle = '#4a4d54';
      ctx.fillText('SlashCard — crypto-card-review.vercel.app', 32, 310);

      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          alert('Status card copied to clipboard!');
        } catch {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = `slashcard-${slug}.png`; a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-[520px] mx-auto px-6 py-8">
      <Link to={`/card/${slug}`} className="inline-flex items-center gap-1 text-[13px] no-underline transition-colors hover:text-[#d0d6e0]" style={{ color: '#62666d' }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        {card.name}
      </Link>

      <div className="mt-4 card-border rounded-xl overflow-hidden" style={{ background: 'rgba(15,16,17,0.6)' }}>
        {/* Success header */}
        <div className="px-6 py-5 text-center" style={{ boxShadow: 'rgba(255,255,255,0.04) 0px 1px 0px' }}>
          <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-lg mb-3" style={{
            background: 'rgba(239,68,68,0.08)', boxShadow: 'rgba(239,68,68,0.20) 0px 0px 0px 1px', color: '#ef4444',
          }}>/</div>
          <h2 className="text-[18px] font-semibold text-[#f7f8f8]">Report submitted</h2>
          <p className="text-[13px] mt-1" style={{ color: '#62666d' }}>Help spread the word so others are warned</p>
        </div>

        {/* Status card preview */}
        <div className="px-5 py-4">
          <div className="rounded-xl overflow-hidden" style={{ background: '#08090a', boxShadow: `${statusColor}33 0px 0px 0px 1px` }}>
            <div className="h-[3px]" style={{ background: statusColor }}></div>
            <div className="p-5">
              <div className="text-2xl mb-2">🚨</div>
              <h3 className="text-[20px] font-semibold text-[#f7f8f8] tracking-[-0.01em]">{card.name}</h3>
              <p className="text-[13px] font-semibold mt-1" style={{ color: statusColor }}>{statusLabel}</p>
              <div className="mt-4 pt-3 space-y-1" style={{ boxShadow: 'rgba(255,255,255,0.04) 0px -1px 0px' }}>
                <p className="text-[13px] text-[#e8e9eb]">{issueLabels[issueType] || 'Issue'} reported</p>
                <p className="text-[12px]" style={{ color: '#8a8f98' }}>{reportCount} reports this week</p>
              </div>
              <p className="mt-3 text-[10px]" style={{ color: '#4a4d54' }}>SlashCard — crypto-card-review.vercel.app</p>
            </div>
          </div>
        </div>

        {/* Share actions */}
        <div className="px-5 pb-5 space-y-2.5">
          <button onClick={handleShareX} className="w-full py-[10px] rounded-xl font-medium text-[14px] text-white cursor-pointer transition-all hover:opacity-90 flex items-center justify-center gap-2" style={{
            background: '#000', boxShadow: 'rgba(255,255,255,0.10) 0px 0px 0px 1px', border: 'none',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share to X
          </button>
          <button onClick={handleCopyImage} className="w-full py-[10px] rounded-xl font-medium text-[13px] cursor-pointer transition-all hover:bg-white/[0.04] flex items-center justify-center gap-2" style={{
            color: '#8a8f98', boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px', background: 'transparent', border: 'none',
          }}>
            📋 Copy Status Card Image
          </button>
          <Link to={`/card/${slug}`} className="block w-full py-[10px] rounded-xl font-medium text-[13px] text-center no-underline transition-all hover:bg-white/[0.04]" style={{
            color: '#62666d', boxShadow: 'rgba(255,255,255,0.04) 0px 0px 0px 1px',
          }}>
            Back to {card.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
