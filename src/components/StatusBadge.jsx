const statusConfig = {
  green: {
    bg: 'rgba(39,166,68,0.08)',
    shadow: 'rgba(39,166,68,0.15) 0px 0px 0px 1px',
    text: '#27a644',
    label: 'Normal',
  },
  yellow: {
    bg: 'rgba(245,158,11,0.08)',
    shadow: 'rgba(245,158,11,0.20) 0px 0px 0px 1px',
    text: '#f59e0b',
    label: 'Issues',
  },
  red: {
    bg: 'rgba(239,68,68,0.08)',
    shadow: 'rgba(239,68,68,0.25) 0px 0px 0px 1px',
    text: '#ef4444',
    label: 'Critical',
  },
};

export default function StatusBadge({ status, count }) {
  const cfg = statusConfig[status] || statusConfig.green;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full text-[11px] font-medium"
      style={{ background: cfg.bg, boxShadow: cfg.shadow, color: cfg.text }}
    >
      <span
        className={`w-[5px] h-[5px] rounded-full ${status !== 'green' ? 'animate-pulse' : ''}`}
        style={{ background: cfg.text }}
      />
      {cfg.label}
      {count > 0 && status !== 'green' && <span style={{ opacity: 0.6 }}>{count}</span>}
    </span>
  );
}
