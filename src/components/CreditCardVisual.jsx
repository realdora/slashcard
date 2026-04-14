const cardGradients = {
  'Rain': ['#0c1445', '#1a237e', '#283593'],
  'RedotPay': ['#2d1b46', '#4a148c', '#7b1fa2'],
  'Bybit Card': ['#1a1a1a', '#212121', '#424242'],
  'Binance Card': ['#1a1a0e', '#2e2e14', '#3e3e1a'],
  'Crypto.com Card': ['#0a1929', '#0d2137', '#132f4c'],
  'Coinbase Card': ['#0a1628', '#0d47a1', '#1565c0'],
  'GnosisPay': ['#0a2918', '#1b5e20', '#2e7d32'],
  'EtherFi Cash': ['#1a0a2e', '#311b92', '#4527a0'],
  'Cypher': ['#0a2929', '#004d40', '#00695c'],
  'Holyheld': ['#1a1a2e', '#283593', '#3949ab'],
  'YouCard': ['#2e0a0a', '#b71c1c', '#c62828'],
  'Reap': ['#0a2020', '#00695c', '#00897b'],
  'Immersve': ['#1a0a2e', '#6a1b9a', '#8e24aa'],
  '1inch Card': ['#1a1020', '#880e4f', '#ad1457'],
  'MetaMask Card': ['#1e1408', '#e65100', '#ef6c00'],
};

const defaultGradient = ['#1a1a2e', '#2d2d44', '#5e6ad2'];

function getGradient(name) {
  return cardGradients[name] || defaultGradient;
}

function VisaLogo({ scale = 1 }) {
  return (
    <svg width={50 * scale} height={16 * scale} viewBox="0 0 100 32" fill="none">
      <path d="M40.3 1.2L34.6 30.6h-8.5L31.8 1.2h8.5z" fill="rgba(255,255,255,0.8)"/>
      <path d="M69.8 2c-1.7-0.7-4.3-1.4-7.6-1.4-8.4 0-14.3 4.5-14.3 10.9-0.1 4.7 4.2 7.4 7.5 9 3.3 1.6 4.4 2.7 4.4 4.1 0 2.2-2.6 3.2-5.1 3.2-3.4 0-5.2-0.5-8-1.7l-1.1-0.5-1.2 7.4c2 0.9 5.7 1.7 9.5 1.8 8.9 0 14.7-4.4 14.8-11.3 0-3.8-2.2-6.6-7.2-9-3-1.5-4.8-2.5-4.8-4.1 0-1.4 1.6-2.8 4.9-2.8 2.8 0 4.8 0.6 6.4 1.3l0.8 0.4 1.2-7.3z" fill="rgba(255,255,255,0.8)"/>
      <path d="M79.9 20.4c0.7-1.9 3.4-9.2 3.4-9.2 0 0 0.7-1.9 1.1-3.1l0.6 2.8s1.6 7.9 2 9.5h-7.1zM88.3 1.2h-6.6c-2 0-3.6 0.6-4.5 2.7L63.2 30.6h8.9s1.5-4 1.8-4.9h10.9c0.3 1.1 1 4.9 1 4.9h7.9L88.3 1.2z" fill="rgba(255,255,255,0.8)"/>
      <path d="M25.2 1.2L16.8 21.5l-0.9-4.6c-1.6-5.3-6.4-11-11.8-13.9l7.6 27.5h9l13.4-29.3h-8.9z" fill="rgba(255,255,255,0.8)"/>
      <path d="M10.4 1.2H0.2L0 1.8c10.6 2.7 17.6 9.3 20.5 17.2L17.4 4c-0.5-2-2-2.7-3.8-2.8h-3.2z" fill="rgba(255,255,255,0.65)"/>
    </svg>
  );
}

function MastercardLogo({ scale = 1 }) {
  return (
    <svg width={40 * scale} height={25 * scale} viewBox="0 0 40 25" fill="none">
      <circle cx="15" cy="12.5" r="11" fill="rgba(235,80,60,0.75)"/>
      <circle cx="25" cy="12.5" r="11" fill="rgba(245,180,50,0.65)"/>
    </svg>
  );
}

function ChipIcon({ scale = 1 }) {
  const w = 32 * scale;
  const h = 24 * scale;
  return (
    <div style={{
      width: w, height: h, borderRadius: 4 * scale,
      background: 'linear-gradient(145deg, #d4a853, #b8943a, #e6c36a)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 2.5 * scale, borderRadius: 2 * scale, border: '0.5px solid rgba(160,120,40,0.5)' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 0.5, background: 'rgba(160,120,40,0.4)' }}/>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 0.5, background: 'rgba(160,120,40,0.4)' }}/>
      </div>
    </div>
  );
}

function ContactlessIcon({ scale = 1 }) {
  const s = 14 * scale;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ opacity: 0.45, transform: 'rotate(90deg)' }}>
      <path d="M9 6a3 3 0 0 1 0 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 6a6 6 0 0 1 0 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 6a9 9 0 0 1 0 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function CreditCardVisual({ card, status, size = 'md', hasPromo = false }) {
  const [c1, c2, c3] = getGradient(card.name);
  const isMastercard = card.card_network?.toLowerCase() === 'mastercard';

  const sizeConfig = {
    sm: { width: '100%', height: 0, padTop: '63%', nameSize: 12, typeSize: 9, pad: 16, chipScale: 0.65, logoScale: 0.6 },
    md: { width: 320, height: 202, padTop: null, nameSize: 14, typeSize: 10, pad: 20, chipScale: 0.8, logoScale: 0.75 },
    lg: { width: 400, height: 252, padTop: null, nameSize: 17, typeSize: 11, pad: 26, chipScale: 1, logoScale: 0.9 },
  };
  const cfg = sizeConfig[size] || sizeConfig.md;

  const glowShadow = status === 'red'
    ? '0 0 40px rgba(239,68,68,0.2), 0 8px 32px rgba(0,0,0,0.4)'
    : status === 'yellow'
    ? '0 0 40px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)'
    : '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)';

  const containerStyle = size === 'sm'
    ? { width: '100%', paddingTop: cfg.padTop, position: 'relative', borderRadius: 14, overflow: 'hidden', background: `linear-gradient(135deg, ${c1}, ${c2} 45%, ${c3})`, boxShadow: glowShadow }
    : { width: cfg.width, height: cfg.height, position: 'relative', borderRadius: 14, overflow: 'hidden', background: `linear-gradient(135deg, ${c1}, ${c2} 45%, ${c3})`, boxShadow: glowShadow, flexShrink: 0 };

  return (
    <div className="credit-card-visual" style={containerStyle}>
      {/* Noise overlay */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.025, zIndex: 1, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '128px' }}/>

      {/* Gradient orbs */}
      <div style={{ position: 'absolute', top: '-25%', right: '-15%', width: '55%', height: '70%', borderRadius: '50%', background: `radial-gradient(circle, ${c3}40 0%, transparent 65%)`, zIndex: 1 }}/>

      {/* Inner border */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 14, zIndex: 2, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.1)' }}/>

      {/* Content */}
      <div style={{
        position: size === 'sm' ? 'absolute' : 'relative',
        inset: size === 'sm' ? 0 : undefined,
        zIndex: 3, padding: cfg.pad,
        height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <ChipIcon scale={cfg.chipScale} />
          <ContactlessIcon scale={cfg.chipScale} />
        </div>

        <div>
          <div style={{ fontSize: cfg.nameSize, fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.2 }}>
            {card.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: cfg.typeSize, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
              {card.card_type}
            </span>
            {isMastercard ? <MastercardLogo scale={cfg.logoScale} /> : <VisaLogo scale={cfg.logoScale} />}
          </div>
        </div>
      </div>

      {/* Promo shimmer */}
      {hasPromo && <div className="promo-shimmer" style={{ position: 'absolute', inset: 0, zIndex: 4, borderRadius: 14, pointerEvents: 'none' }}/>}
    </div>
  );
}
