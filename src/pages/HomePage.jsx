import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { StarDisplay } from '../components/StarRating';
import StatusBadge from '../components/StatusBadge';
import CreditCardVisual from '../components/CreditCardVisual';
import LiveFeed from '../components/LiveFeed';

const sortOptions = [
  { value: 'trending', label: 'Trending' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
];

const categoryFilters = [
  { value: 'all', label: 'All' },
  { value: 'cex', label: 'CEX Cards' },
  { value: 'defi', label: 'DeFi Native' },
  { value: 'prepaid', label: 'Prepaid' },
  { value: 'debit', label: 'Debit' },
];

const cexCards = ['Bybit Card', 'Binance Card', 'Crypto.com Card', 'Coinbase Card'];
const defiCards = ['GnosisPay', 'EtherFi Cash', 'Holyheld', 'Immersve', '1inch Card', 'MetaMask Card'];

function matchesCategory(card, category) {
  if (category === 'all') return true;
  if (category === 'cex') return cexCards.includes(card.name);
  if (category === 'defi') return defiCards.includes(card.name);
  if (category === 'prepaid') return card.card_type === 'prepaid';
  if (category === 'debit') return card.card_type === 'debit';
  return true;
}

export default function HomePage() {
  const { cards, getCardStats } = useData();
  const [sortBy, setSortBy] = useState('trending');
  const [category, setCategory] = useState('all');

  const sortedCards = useMemo(() => {
    const withStats = cards.map(card => ({ ...card, stats: getCardStats(card.id) }));
    const filtered = withStats.filter(card => matchesCategory(card, category));
    switch (sortBy) {
      case 'rating': return [...filtered].sort((a, b) => b.stats.avgRating - a.stats.avgRating);
      case 'reviews': return [...filtered].sort((a, b) => b.stats.reviewCount - a.stats.reviewCount);
      case 'trending': return [...filtered].sort((a, b) => b.stats.recentSlashCount - a.stats.recentSlashCount || b.stats.reviewCount - a.stats.reviewCount);
      default: return filtered;
    }
  }, [cards, getCardStats, sortBy, category]);

  // Find the top-issue card for the alert banner
  const alertCard = sortedCards.find(c => c.stats.status === 'red' || c.stats.status === 'yellow');

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        {alertCard && (
          <Link
            to={`/card/${alertCard.slug}`}
            className="inline-flex items-center gap-2 px-3.5 py-[7px] rounded-full mb-6 no-underline transition-all hover:scale-[1.02]"
            style={{
              background: alertCard.stats.status === 'red' ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)',
              boxShadow: alertCard.stats.status === 'red'
                ? 'rgba(239,68,68,0.15) 0px 0px 0px 1px'
                : 'rgba(245,158,11,0.15) 0px 0px 0px 1px',
            }}
          >
            <span className="w-[5px] h-[5px] rounded-full animate-pulse" style={{
              background: alertCard.stats.status === 'red' ? '#ef4444' : '#f59e0b',
            }}></span>
            <span className="text-[12px] font-medium" style={{
              color: alertCard.stats.status === 'red' ? '#ef4444' : '#f59e0b',
            }}>
              {alertCard.name} — {alertCard.stats.recentSlashCount} reports this week
            </span>
            <span className="text-[12px]" style={{ color: '#62666d' }}>→</span>
          </Link>
        )}
        <h1 className="display-heading text-[44px] sm:text-[56px] leading-[1.05]">
          Real reviews for<br />crypto cards
        </h1>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center justify-center gap-1 mb-8">
        <div className="flex gap-[2px] p-[3px] rounded-lg" style={{
          background: 'rgba(255,255,255,0.02)',
          boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px',
        }}>
          {categoryFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setCategory(f.value)}
              className="px-4 py-[7px] text-[12px] font-medium rounded-[6px] transition-all cursor-pointer"
              style={{
                background: category === f.value ? 'rgba(255,255,255,0.07)' : 'transparent',
                color: category === f.value ? '#f7f8f8' : '#62666d',
                boxShadow: category === f.value ? 'rgba(255,255,255,0.08) 0px 0px 0px 1px' : 'none',
                border: 'none',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Sort + count */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-[13px] font-medium" style={{ color: '#62666d' }}>{sortedCards.length} cards</span>
            <div className="flex gap-[2px] p-[3px] rounded-lg" style={{
              background: 'rgba(255,255,255,0.03)',
              boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px',
            }}>
              {sortOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className="px-3 py-[6px] text-[12px] font-medium rounded-[5px] transition-all cursor-pointer"
                  style={{
                    background: sortBy === opt.value ? 'rgba(255,255,255,0.06)' : 'transparent',
                    color: sortBy === opt.value ? '#f7f8f8' : '#62666d',
                    boxShadow: sortBy === opt.value ? 'rgba(255,255,255,0.08) 0px 0px 0px 1px' : 'none',
                    border: 'none',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card grid */}
          <div className="card-grid">
            {sortedCards.map((card) => (
              <Link
                key={card.id}
                to={`/card/${card.slug}`}
                className="group block rounded-2xl overflow-hidden transition-all no-underline card-grid-item card-border"
                style={{ background: 'rgba(15,16,17,0.5)' }}
              >
                {/* Card visual - full width */}
                <div className="px-5 pt-5">
                  <CreditCardVisual
                    card={card}
                    status={card.stats.status}
                    size="sm"
                    hasPromo={card.stats.activePromos > 0}
                  />
                </div>

                {/* Card info */}
                <div className="px-5 pt-4 pb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-semibold text-[#f7f8f8] group-hover:text-white transition-colors tracking-[-0.01em]">
                        {card.name}
                      </span>
                      {card.name_zh && <span className="text-[11px]" style={{ color: '#62666d' }}>{card.name_zh}</span>}
                    </div>
                    <StatusBadge status={card.stats.status} count={card.stats.recentSlashCount} />
                  </div>

                  {/* Rating row */}
                  <div className="flex items-center gap-2.5 mt-2.5">
                    {card.stats.reviewCount > 0 ? (
                      <>
                        <StarDisplay rating={card.stats.avgRating} />
                        <span className="text-[12px] font-medium tabular-nums" style={{ color: '#d0d6e0', fontFeatureSettings: '"tnum"' }}>
                          {card.stats.avgRating.toFixed(1)}
                        </span>
                        <span className="text-[11px]" style={{ color: '#62666d' }}>
                          {card.stats.reviewCount} review{card.stats.reviewCount !== 1 ? 's' : ''}
                        </span>
                      </>
                    ) : (
                      <span className="text-[11px]" style={{ color: '#62666d' }}>No reviews yet</span>
                    )}
                    {card.stats.activePromos > 0 && (
                      <span className="promo-badge text-[10px] font-medium px-[6px] py-[2px] rounded-full inline-flex items-center gap-1 ml-auto" style={{
                        color: '#27a644', background: 'rgba(39,166,68,0.08)',
                        boxShadow: 'rgba(39,166,68,0.15) 0px 0px 0px 1px',
                      }}>
                        <span className="promo-dot"></span>
                        Promo
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    <Pill label={card.card_network} />
                    <Pill label={card.card_type} />
                    {card.supported_chains.slice(0, 2).map(c => <Pill key={c} label={c} />)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-[300px] flex-shrink-0">
          <div className="lg:sticky lg:top-[72px]">
            <LiveFeed />
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ label }) {
  return (
    <span className="text-[10px] font-medium px-[7px] py-[2px] rounded-[4px] capitalize" style={{
      color: '#8a8f98',
      boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px',
    }}>
      {label}
    </span>
  );
}
