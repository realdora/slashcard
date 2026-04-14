import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { StarDisplay } from '../components/StarRating';
import StatusBadge from '../components/StatusBadge';
import CreditCardVisual from '../components/CreditCardVisual';
import SlashTimeline from '../components/SlashTimeline';
import ShareableStatusCard from '../components/ShareableStatusCard';
import { timeAgo } from '../utils';

const issueLabels = {
  frozen_funds: 'Frozen Funds', withdrawal_delayed: 'Withdrawal Delayed',
  fee_change: 'Fee Change', kyc_rejected: 'KYC Rejected',
  support_unresponsive: 'Support Unresponsive', other: 'Other',
};
const issueIcons = {
  frozen_funds: '🧊', withdrawal_delayed: '⏳', fee_change: '💸',
  kyc_rejected: '🚫', support_unresponsive: '📵', other: '⚠️',
};
const intelConfig = {
  promo: { icon: '🎁', color: '#27a644', shadowColor: 'rgba(39,166,68,' },
  fee_change: { icon: '📊', color: '#f59e0b', shadowColor: 'rgba(245,158,11,' },
  feature: { icon: '🆕', color: '#0a72ef', shadowColor: 'rgba(10,114,239,' },
  tip: { icon: '💡', color: '#7170ff', shadowColor: 'rgba(113,112,255,' },
};

export default function CardDetailPage() {
  const { slug } = useParams();
  const { cards, getCardReviews, getCardSlashReports, getCardIntel, getCardStats, confirmIntel, denyIntel } = useData();
  const [showShare, setShowShare] = useState(false);
  const [voted, setVoted] = useState({});

  const card = cards.find(c => c.slug === slug);
  if (!card) return <div className="max-w-[720px] mx-auto px-6 py-20 text-center" style={{ color: '#62666d' }}>Card not found</div>;

  const reviews = getCardReviews(card.id);
  const reports = getCardSlashReports(card.id);
  const intel = getCardIntel(card.id);
  const stats = getCardStats(card.id);

  const activePromos = intel.filter(i => i.type === 'promo' && (!i.expires_at || new Date(i.expires_at) > new Date()));
  const feeChanges = intel.filter(i => i.type === 'fee_change');
  const tips = intel.filter(i => i.type === 'tip');
  const features = intel.filter(i => i.type === 'feature');

  const cardShadowClass = stats.status === 'red' ? 'card-border-red' : stats.status === 'yellow' ? 'card-border-yellow' : 'card-border';

  const handleVote = (id, action) => {
    if (voted[id]) return;
    setVoted(prev => ({ ...prev, [id]: action }));
    if (action === 'confirm') confirmIntel(id);
    else denyIntel(id);
  };

  return (
    <div className="max-w-[720px] mx-auto px-6 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-[13px] no-underline transition-colors hover:text-[#d0d6e0]" style={{ color: '#62666d' }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        All Cards
      </Link>

      {/* Header card with credit card visual */}
      <div className={`mt-4 rounded-xl p-6 ${cardShadowClass}`} style={{ background: 'rgba(15,16,17,0.6)' }}>
        {/* Credit card visual centered */}
        <div className="flex justify-center mb-6">
          <CreditCardVisual
            card={card}
            status={stats.status}
            size="lg"
            hasPromo={activePromos.length > 0}
          />
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <h1 className="text-[22px] font-medium text-[#f7f8f8] tracking-[-0.02em]">{card.name}</h1>
            {card.name_zh && <span style={{ color: '#62666d' }}>({card.name_zh})</span>}
            <StatusBadge status={stats.status} count={stats.recentSlashCount} />
            {activePromos.length > 0 && (
              <span className="text-[10px] font-medium px-[7px] py-[2px] rounded-full" style={{
                color: '#27a644', background: 'rgba(39,166,68,0.08)',
                boxShadow: 'rgba(39,166,68,0.15) 0px 0px 0px 1px',
              }}>🎁 {activePromos.length} active promo{activePromos.length > 1 ? 's' : ''}</span>
            )}
          </div>
          <p className="mt-2 text-[13px] leading-relaxed max-w-[500px] mx-auto" style={{ color: '#8a8f98' }}>{card.description}</p>
          <div className="mt-3 flex items-center justify-center gap-3">
            {stats.reviewCount > 0 ? (
              <>
                <StarDisplay rating={stats.avgRating} size="md" />
                <span className="text-[15px] font-medium text-[#d0d6e0] tabular-nums" style={{ fontFeatureSettings: '"tnum"' }}>{stats.avgRating.toFixed(1)}</span>
                <span className="text-[13px]" style={{ color: '#62666d' }}>{stats.reviewCount} reviews</span>
              </>
            ) : (
              <span className="text-[13px]" style={{ color: '#62666d' }}>No reviews yet — be the first</span>
            )}
          </div>
          <div className="mt-3 flex justify-center flex-wrap gap-1.5">
            <Pill label={card.card_network} /><Pill label={card.card_type} />
            {card.supported_chains.slice(0, 4).map(c => <Pill key={c} label={c} />)}
            {card.supported_chains.length > 4 && <Pill label={`+${card.supported_chains.length - 4}`} />}
          </div>
          <div className="mt-2 flex justify-center flex-wrap gap-1.5">
            {card.supported_assets.slice(0, 5).map(a => (
              <span key={a} className="text-[10px] font-medium px-[7px] py-[2px] rounded-[4px]" style={{
                color: '#7170ff', boxShadow: 'rgba(113,112,255,0.20) 0px 0px 0px 1px', background: 'rgba(113,112,255,0.06)',
              }}>{a}</span>
            ))}
          </div>
          <div className="mt-2.5 text-[12px]" style={{ color: '#62666d' }}>
            {card.service_regions} ·{' '}
            <a href={card.website} target="_blank" rel="noopener noreferrer" className="no-underline transition-colors hover:text-[#828fff]" style={{ color: '#7170ff' }}>
              {card.website.replace('https://www.', '').replace('https://', '')}
            </a>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2.5">
        <Link to={`/card/${slug}/review`} className="flex-1 text-center py-[10px] rounded-lg font-medium text-[13px] text-white no-underline transition-all hover:opacity-90" style={{
          background: 'linear-gradient(135deg, #5e6ad2, #7170ff)', boxShadow: 'rgba(113,112,255,0.25) 0px 4px 12px',
        }}>Write a Review</Link>
        <Link to={`/card/${slug}/report`} className="flex-1 text-center py-[10px] rounded-lg font-medium text-[13px] no-underline transition-all hover:bg-[rgba(239,68,68,0.08)]" style={{
          color: '#ef4444', boxShadow: 'rgba(239,68,68,0.20) 0px 0px 0px 1px',
        }}>/ Slash Report</Link>
        <button onClick={() => setShowShare(true)} className="w-10 rounded-lg text-[13px] cursor-pointer transition-all hover:bg-white/[0.04] flex items-center justify-center" style={{
          color: '#8a8f98', boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px', background: 'transparent', border: 'none',
        }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      {showShare && <ShareableStatusCard card={card} stats={stats} onClose={() => setShowShare(false)} />}

      {/* Active Promos */}
      {activePromos.length > 0 && (
        <div className="mt-8">
          <SectionHeader icon="🎁" title="Active Promos" color="#27a644" />
          <div className="space-y-2">
            {activePromos.map(item => <IntelCard key={item.id} item={item} voted={voted[item.id]} onVote={handleVote} />)}
          </div>
        </div>
      )}

      {/* Fee Changes */}
      {feeChanges.length > 0 && (
        <div className="mt-8">
          <SectionHeader icon="📊" title="Fee Changes" color="#f59e0b" />
          <div className="space-y-2">
            {feeChanges.map(item => <IntelCard key={item.id} item={item} voted={voted[item.id]} onVote={handleVote} />)}
          </div>
        </div>
      )}

      {/* Slash Timeline */}
      {reports.length > 0 && <div className="mt-8"><SlashTimeline reports={reports} /></div>}

      {/* Recent slash reports */}
      {reports.length > 0 && (
        <div className="mt-8">
          <SectionHeader icon="/" title="Recent Reports" color="#ef4444" isSlash />
          <div className="space-y-[6px]">
            {reports.slice(0, 5).map(r => (
              <div key={r.id} className="card-border rounded-lg px-4 py-3 flex items-start gap-3" style={{ background: 'rgba(15,16,17,0.5)' }}>
                <span className="mt-0.5 text-[13px]">{issueIcons[r.issue_type] || '⚠️'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-[#d0d6e0]">{issueLabels[r.issue_type]}</span>
                    <span className="text-[11px]" style={{ color: '#62666d' }}>{timeAgo(r.created_at)}</span>
                  </div>
                  {r.description && <p className="text-[12px] mt-0.5" style={{ color: '#8a8f98' }}>{r.description}</p>}
                  <span className="text-[11px]" style={{ color: '#62666d' }}>{r.display_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <div className="mt-8">
          <SectionHeader icon="💡" title="Tips" color="#7170ff" />
          <div className="space-y-2">
            {tips.map(item => <IntelCard key={item.id} item={item} voted={voted[item.id]} onVote={handleVote} />)}
          </div>
        </div>
      )}

      {/* Feature Updates */}
      {features.length > 0 && (
        <div className="mt-8">
          <SectionHeader icon="🆕" title="Feature Updates" color="#0a72ef" />
          <div className="space-y-2">
            {features.map(item => <IntelCard key={item.id} item={item} voted={voted[item.id]} onVote={handleVote} />)}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-[13px] font-medium text-[#d0d6e0] mb-3">
          Reviews {reviews.length > 0 && <span style={{ color: '#62666d' }}>({reviews.length})</span>}
        </h2>
        {reviews.length === 0 ? (
          <div className="card-border rounded-xl p-10 text-center" style={{ background: 'rgba(15,16,17,0.5)' }}>
            <p style={{ color: '#62666d' }} className="text-[13px]">No reviews yet</p>
            <Link to={`/card/${slug}/review`} className="inline-block mt-3 text-[13px] font-medium no-underline hover:text-[#828fff]" style={{ color: '#7170ff' }}>Be the first to review →</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {reviews.map(review => (
              <div key={review.id} className="card-border rounded-xl p-5" style={{ background: 'rgba(15,16,17,0.5)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold" style={{
                      background: 'rgba(255,255,255,0.04)', color: '#8a8f98', boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px',
                    }}>{review.display_name.charAt(0).toUpperCase()}</div>
                    <span className="text-[13px] font-medium text-[#d0d6e0]">{review.display_name}</span>
                    {review.screenshot_url && (
                      <span className="text-[10px] font-medium px-[7px] py-[2px] rounded-[4px]" style={{
                        color: '#27a644', background: 'rgba(39,166,68,0.06)', boxShadow: 'rgba(39,166,68,0.15) 0px 0px 0px 1px',
                      }}>screenshot attached</span>
                    )}
                  </div>
                  <span className="text-[11px]" style={{ color: '#62666d' }}>{timeAgo(review.created_at)}</span>
                </div>
                <div className="mt-2"><StarDisplay rating={review.rating} /></div>
                <p className="mt-2.5 text-[13px] leading-[1.65]" style={{ color: '#8a8f98' }}>{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, color, isSlash }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-5 h-5 rounded-[5px] flex items-center justify-center text-[10px] flex-shrink-0" style={{
        background: `${color}18`, boxShadow: `${color}30 0px 0px 0px 1px`,
        color: color, fontWeight: isSlash ? 700 : 400, fontSize: isSlash ? 10 : 11,
      }}>{icon}</span>
      <h2 className="text-[13px] font-medium" style={{ color: '#d0d6e0' }}>{title}</h2>
    </div>
  );
}

function IntelCard({ item, voted, onVote }) {
  const cfg = intelConfig[item.type] || intelConfig.tip;
  return (
    <div className="card-border rounded-xl p-4" style={{ background: 'rgba(15,16,17,0.5)' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-[#e8e9eb]">{item.title}</p>
          <p className="text-[12px] mt-1.5 leading-[1.6]" style={{ color: '#8a8f98' }}>{item.content}</p>
          {item.expires_at && new Date(item.expires_at) > new Date() && (
            <p className="text-[11px] mt-1.5" style={{ color: cfg.color }}>
              Expires {new Date(item.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          )}
          {item.source_url && (
            <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="text-[11px] no-underline mt-1 inline-block hover:text-[#828fff]" style={{ color: '#7170ff' }}>Source →</a>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3" style={{ boxShadow: 'rgba(255,255,255,0.04) 0px -1px 0px' }}>
        <button onClick={() => onVote(item.id, 'confirm')} disabled={!!voted}
          className="flex items-center gap-1.5 px-2.5 py-[4px] rounded-md text-[11px] font-medium cursor-pointer transition-all disabled:opacity-50 disabled:cursor-default"
          style={{
            color: voted === 'confirm' ? '#fff' : '#27a644',
            background: voted === 'confirm' ? 'rgba(39,166,68,0.25)' : 'rgba(39,166,68,0.06)',
            boxShadow: 'rgba(39,166,68,0.12) 0px 0px 0px 1px', border: 'none',
          }}>Confirm · {item.confirms}</button>
        <button onClick={() => onVote(item.id, 'deny')} disabled={!!voted}
          className="flex items-center gap-1.5 px-2.5 py-[4px] rounded-md text-[11px] font-medium cursor-pointer transition-all disabled:opacity-50 disabled:cursor-default"
          style={{
            color: voted === 'deny' ? '#fff' : '#ef4444',
            background: voted === 'deny' ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.04)',
            boxShadow: 'rgba(239,68,68,0.08) 0px 0px 0px 1px', border: 'none',
          }}>Deny · {item.denies}</button>
        <span className="text-[10px] ml-auto" style={{ color: '#62666d' }}>{item.posted_by} · {timeAgo(item.created_at)}</span>
      </div>
    </div>
  );
}

function Pill({ label }) {
  return (
    <span className="text-[10px] font-medium px-[7px] py-[2px] rounded-[4px] capitalize" style={{
      color: '#8a8f98', boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px',
    }}>{label}</span>
  );
}
