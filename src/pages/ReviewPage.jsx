import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { StarInput } from '../components/StarRating';
import CardLogo from '../components/CardLogo';

export default function ReviewPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { cards, addReview } = useData();
  const card = cards.find(c => c.slug === slug);

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!card) return <div className="max-w-[520px] mx-auto px-6 py-20 text-center" style={{ color: '#62666d' }}>Card not found</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating'); return; }
    if (content.trim().length < 10) { setError('Review must be at least 10 characters'); return; }
    if (!displayName.trim()) { setError('Please enter a display name'); return; }
    addReview({ card_id: card.id, rating, content: content.trim(), display_name: displayName.trim(), screenshot_url: screenshot ? URL.createObjectURL(screenshot) : null });
    setSubmitted(true);
    setTimeout(() => navigate(`/card/${slug}`), 1500);
  };

  if (submitted) {
    return (
      <div className="max-w-[520px] mx-auto px-6 py-20 text-center">
        <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-xl mb-4" style={{
          background: 'rgba(39,166,68,0.08)', boxShadow: 'rgba(39,166,68,0.15) 0px 0px 0px 1px', color: '#27a644',
        }}>✓</div>
        <h2 className="text-[18px] font-medium text-[#f7f8f8]">Review submitted</h2>
        <p className="text-[13px] mt-2" style={{ color: '#62666d' }}>Redirecting to {card.name}...</p>
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
        <div className="flex items-center gap-3 mb-6">
          <CardLogo card={card} />
          <div>
            <h1 className="text-[16px] font-medium text-[#f7f8f8]">Review {card.name}</h1>
            <p className="text-[12px]" style={{ color: '#62666d' }}>Share your real experience</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[13px] font-medium text-[#d0d6e0] mb-3">Overall Rating</label>
            <StarInput value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#d0d6e0] mb-2">Your Review</label>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Top-up speed? Freeze issues? Support quality?"
              rows={4} className="w-full rounded-lg px-4 py-3 text-[13px] text-[#d0d6e0] placeholder:text-[#4a4d54] focus:outline-none resize-none transition-all" style={{
                background: 'rgba(255,255,255,0.02)',
                boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px',
              }}
              onFocus={e => e.target.style.boxShadow = 'rgba(113,112,255,0.30) 0px 0px 0px 1px, rgba(113,112,255,0.10) 0px 0px 0px 4px'}
              onBlur={e => e.target.style.boxShadow = 'rgba(255,255,255,0.06) 0px 0px 0px 1px'}
            />
            <span className="text-[11px] mt-1 block" style={{ color: '#62666d' }}>{content.length} chars (min 10)</span>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#d0d6e0] mb-2">
              Screenshot <span style={{ color: '#62666d', fontWeight: 400 }}>— adds credibility</span>
            </label>
            <label className="flex items-center justify-center gap-2 w-full py-4 rounded-lg cursor-pointer transition-all hover:bg-white/[0.02]" style={{
              boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px',
              borderStyle: 'dashed',
            }}>
              <input type="file" accept="image/*" className="hidden" onChange={e => setScreenshot(e.target.files[0])} />
              {screenshot
                ? <span className="text-[13px] font-medium" style={{ color: '#27a644' }}>📎 {screenshot.name}</span>
                : <span className="text-[13px]" style={{ color: '#62666d' }}>📷 Upload transaction screenshot</span>
              }
            </label>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#d0d6e0] mb-2">Display Name</label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name or handle"
              className="w-full rounded-lg px-4 py-[10px] text-[13px] text-[#d0d6e0] placeholder:text-[#4a4d54] focus:outline-none transition-all" style={{
                background: 'rgba(255,255,255,0.02)',
                boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px',
              }}
              onFocus={e => e.target.style.boxShadow = 'rgba(113,112,255,0.30) 0px 0px 0px 1px, rgba(113,112,255,0.10) 0px 0px 0px 4px'}
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
            background: 'linear-gradient(135deg, #5e6ad2, #7170ff)',
            boxShadow: 'rgba(113,112,255,0.25) 0px 4px 12px',
          }}>Submit Review</button>
        </form>
      </div>
    </div>
  );
}
