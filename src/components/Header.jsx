import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl" style={{
      background: 'rgba(8,9,10,0.85)',
      boxShadow: 'rgba(255,255,255,0.04) 0px 1px 0px',
    }}>
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #5e6ad2, #7170ff)',
            boxShadow: '0 0 12px rgba(113,112,255,0.25)',
          }}>
            <span className="text-white text-[11px] font-semibold">/</span>
          </div>
          <span className="text-[15px] font-medium text-[#f7f8f8] tracking-[-0.01em]">SlashCard</span>
        </Link>
        <div className="flex items-center gap-5">
          <span className="hidden sm:inline text-[11px] font-medium tracking-[0.08em] uppercase" style={{ color: '#62666d' }}>
            Crypto Card Reviews
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-[5px] rounded-full" style={{
            background: 'rgba(39,166,68,0.08)',
            boxShadow: 'rgba(39,166,68,0.15) 0px 0px 0px 1px',
          }}>
            <span className="w-[5px] h-[5px] rounded-full bg-[#27a644] animate-pulse"></span>
            <span className="text-[11px] font-medium text-[#27a644]">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
}
