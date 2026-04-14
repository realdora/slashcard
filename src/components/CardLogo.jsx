import { useState } from 'react';

const gradients = [
  'linear-gradient(135deg, #5e6ad2, #7170ff)',
  'linear-gradient(135deg, #0a72ef, #3b9eff)',
  'linear-gradient(135deg, #e11d48, #f43f5e)',
  'linear-gradient(135deg, #f59e0b, #f97316)',
  'linear-gradient(135deg, #10b981, #059669)',
];

export default function CardLogo({ card, size = 'md' }) {
  const [error, setError] = useState(false);
  const dim = size === 'sm' ? 32 : size === 'md' ? 40 : 52;
  const fontSize = size === 'sm' ? 12 : size === 'md' ? 14 : 18;
  const radius = size === 'sm' ? 8 : size === 'md' ? 10 : 14;
  const gradient = gradients[card.name.charCodeAt(0) % gradients.length];

  if (!card.logo_url || error) {
    return (
      <div
        className="flex items-center justify-center font-semibold text-white flex-shrink-0"
        style={{
          width: dim, height: dim, borderRadius: radius,
          background: gradient,
          fontSize,
          boxShadow: 'rgba(50,50,93,0.15) 0px 2px 8px',
        }}
      >
        {card.name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={card.logo_url}
      alt={card.name}
      className="object-cover flex-shrink-0"
      style={{
        width: dim, height: dim, borderRadius: radius,
        background: '#0f1011',
        boxShadow: 'rgba(255,255,255,0.06) 0px 0px 0px 1px',
      }}
      onError={() => setError(true)}
    />
  );
}
