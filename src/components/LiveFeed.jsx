import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { timeAgo } from '../utils';

const intelConfig = {
  promo:      { icon: '🎁', color: '#27a644', bg: 'rgba(39,166,68,0.06)', label: 'PROMO' },
  fee_change: { icon: '📊', color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', label: 'FEE' },
  feature:    { icon: '🆕', color: '#0a72ef', bg: 'rgba(10,114,239,0.06)', label: 'NEW' },
  tip:        { icon: '💡', color: '#7170ff', bg: 'rgba(113,112,255,0.06)', label: 'TIP' },
};

const slashLabels = {
  frozen_funds: 'Frozen Funds', withdrawal_delayed: 'Withdrawal Delayed',
  fee_change: 'Fee Change', kyc_rejected: 'KYC Rejected',
  support_unresponsive: 'Support Down', other: 'Other Issue',
};

export default function LiveFeed() {
  const { getFeed, confirmIntel, denyIntel } = useData();
  const feed = getFeed();
  const [voted, setVoted] = useState({});
  const [filter, setFilter] = useState('all');

  const handleVote = (id, action) => {
    if (voted[id]) return;
    setVoted(prev => ({ ...prev, [id]: action }));
    if (action === 'confirm') confirmIntel(id);
    else denyIntel(id);
  };

  const filteredFeed = filter === 'all' ? feed :
    filter === 'intel' ? feed.filter(f => f.feedType === 'intel') :
    feed.filter(f => f.feedType === 'slash');

  return (
    <div className="rounded-2xl overflow-hidden" style={{
      background: 'rgba(12,13,14,0.8)',
      boxShadow: 'rgba(255,255,255,0.05) 0px 0px 0px 1px, rgba(50,50,93,0.06) 0px 2px 8px',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Header */}
      <div className="px-4 py-3.5 flex items-center justify-between" style={{ boxShadow: 'rgba(255,255,255,0.04) 0px 1px 0px' }}>
        <div className="flex items-center gap-2">
          <span className="w-[6px] h-[6px] rounded-full bg-[#27a644] animate-pulse"></span>
          <h3 className="text-[13px] font-semibold tracking-[-0.01em]" style={{ color: '#f7f8f8' }}>Intel Feed</h3>
        </div>
        {/* Mini filter */}
        <div className="flex gap-[2px] p-[2px] rounded-md" style={{ background: 'rgba(255,255,255,0.03)', boxShadow: 'rgba(255,255,255,0.05) 0px 0px 0px 1px' }}>
          {[
            { v: 'all', l: 'All' },
            { v: 'intel', l: 'Intel' },
            { v: 'slash', l: 'Reports' },
          ].map(f => (
            <button key={f.v} onClick={() => setFilter(f.v)}
              className="px-2 py-[3px] text-[10px] font-medium rounded-[4px] cursor-pointer transition-all"
              style={{
                color: filter === f.v ? '#f7f8f8' : '#62666d',
                background: filter === f.v ? 'rgba(255,255,255,0.07)' : 'transparent',
                border: 'none',
              }}
            >{f.l}</button>
          ))}
        </div>
      </div>

      {/* Feed items */}
      <div className="max-h-[580px] overflow-y-auto">
        {filteredFeed.map(item => {
          if (item.feedType === 'intel') return <IntelItem key={item.id} item={item} voted={voted[item.id]} onVote={handleVote} />;
          if (item.feedType === 'slash') return <SlashItem key={item.id} item={item} />;
          return <ReviewItem key={item.id} item={item} />;
        })}
      </div>
    </div>
  );
}

function IntelItem({ item, voted, onVote }) {
  const cfg = intelConfig[item.type] || intelConfig.tip;
  return (
    <div style={{ boxShadow: 'rgba(255,255,255,0.025) 0px -1px 0px inset' }}>
      <Link to={`/card/${item.card?.slug}`} className="block px-4 py-3.5 no-underline group transition-colors hover:bg-white/[0.015]">
        <div className="flex items-start gap-3">
          {/* Type indicator */}
          <div className="flex-shrink-0 mt-0.5" style={{
            width: 28, height: 28, borderRadius: 8,
            background: cfg.bg,
            boxShadow: `${cfg.color}25 0px 0px 0px 1px`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13,
          }}>{cfg.icon}</div>

          <div className="min-w-0 flex-1">
            {/* Meta line */}
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold text-[#e8e9eb] group-hover:text-white transition-colors">{item.card?.name}</span>
              <span className="text-[9px] font-bold tracking-[0.05em] px-[5px] py-[1px] rounded-[3px]" style={{
                color: cfg.color, background: cfg.bg, boxShadow: `${cfg.color}20 0px 0px 0px 1px`,
              }}>{cfg.label}</span>
              <span className="text-[10px] ml-auto flex-shrink-0" style={{ color: '#4a4d54' }}>{timeAgo(item.created_at)}</span>
            </div>

            {/* Title */}
            <p className="text-[12px] font-medium mt-1 leading-[1.4]" style={{ color: '#d0d6e0' }}>{item.title}</p>

            {item.expires_at && new Date(item.expires_at) > new Date() && (
              <p className="text-[10px] mt-1 font-medium" style={{ color: cfg.color }}>
                Expires {new Date(item.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            )}

            {/* Vote buttons */}
            <div className="flex items-center gap-1.5 mt-2" onClick={e => e.preventDefault()}>
              <button onClick={() => onVote(item.id, 'confirm')} disabled={!!voted}
                className="flex items-center gap-1 px-[8px] py-[3px] rounded-md text-[10px] font-semibold cursor-pointer transition-all disabled:cursor-default"
                style={{
                  color: voted === 'confirm' ? '#fff' : '#27a644',
                  background: voted === 'confirm' ? 'rgba(39,166,68,0.2)' : 'transparent',
                  boxShadow: 'rgba(255,255,255,0.05) 0px 0px 0px 1px',
                  border: 'none', opacity: voted && voted !== 'confirm' ? 0.4 : 1,
                }}>✓ {item.confirms}</button>
              <button onClick={() => onVote(item.id, 'deny')} disabled={!!voted}
                className="flex items-center gap-1 px-[8px] py-[3px] rounded-md text-[10px] font-semibold cursor-pointer transition-all disabled:cursor-default"
                style={{
                  color: voted === 'deny' ? '#fff' : '#ef4444',
                  background: voted === 'deny' ? 'rgba(239,68,68,0.2)' : 'transparent',
                  boxShadow: 'rgba(255,255,255,0.05) 0px 0px 0px 1px',
                  border: 'none', opacity: voted && voted !== 'deny' ? 0.4 : 1,
                }}>✗ {item.denies}</button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function SlashItem({ item }) {
  return (
    <div style={{ boxShadow: 'rgba(255,255,255,0.025) 0px -1px 0px inset' }}>
      <Link to={`/card/${item.card?.slug}`} className="block px-4 py-3 no-underline group transition-colors hover:bg-white/[0.015]">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5" style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(239,68,68,0.08)',
            boxShadow: 'rgba(239,68,68,0.20) 0px 0px 0px 1px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: '#ef4444',
          }}>/</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold text-[#e8e9eb] group-hover:text-white transition-colors">{item.card?.name}</span>
              <span className="text-[10px] ml-auto flex-shrink-0" style={{ color: '#4a4d54' }}>{timeAgo(item.created_at)}</span>
            </div>
            <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: '#8a8f98' }}>
              <span style={{ color: '#ef4444', fontWeight: 500 }}>{slashLabels[item.issue_type] || item.issue_type}</span>
              {item.description && <span style={{ color: '#62666d' }}> — {item.description}</span>}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

function ReviewItem({ item }) {
  return (
    <div style={{ boxShadow: 'rgba(255,255,255,0.025) 0px -1px 0px inset' }}>
      <Link to={`/card/${item.card?.slug}`} className="block px-4 py-3 no-underline group transition-colors hover:bg-white/[0.015]">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5" style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(113,112,255,0.06)',
            boxShadow: 'rgba(113,112,255,0.15) 0px 0px 0px 1px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, color: '#7170ff',
          }}>★</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold text-[#e8e9eb] group-hover:text-white transition-colors">{item.card?.name}</span>
              <span className="text-[10px] ml-auto flex-shrink-0" style={{ color: '#4a4d54' }}>{timeAgo(item.created_at)}</span>
            </div>
            <p className="text-[11px] mt-0.5 line-clamp-2 leading-relaxed" style={{ color: '#62666d' }}>
              <span style={{ color: '#8a8f98' }}>{item.display_name}</span> — "{item.content?.slice(0, 55)}{item.content?.length > 55 ? '...' : ''}"
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
