import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

export default function ReportPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
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
    setTimeout(() => navigate(`/card/${slug}`), 1500);
  };

  if (submitted) {
    return (
      <div className="max-w-[520px] mx-auto px-6 py-20 text-center">
        <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-xl mb-4" style={{
          background: 'rgba(239,68,68,0.06)', boxShadow: 'rgba(239,68,68,0.20) 0px 0px 0px 1px', color: '#ef4444',
        }}>/</div>
        <h2 className="text-[18px] font-medium text-[#f7f8f8]">Report submitted</h2>
        <p className="text-[13px] mt-2" style={{ color: '#62666d' }}>Thanks for keeping the community informed.</p>
      </div>
    );
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
