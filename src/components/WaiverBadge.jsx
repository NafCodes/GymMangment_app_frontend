import { getWaiverStatus } from '../data/seedData';

const STATUS_CONFIG = {
  valid:    { label: 'Signed',   bg: '#14532d', color: '#4ade80', border: '#166534' },
  expiring: { label: 'Expiring', bg: '#713f12', color: '#FFD700', border: '#92400e' },
  expired:  { label: 'Expired',  bg: '#450a0a', color: '#f87171', border: '#7f1d1d' },
  missing:  { label: 'Missing',  bg: '#1c1c1c', color: '#888',    border: '#2a2a2a' },
};

export default function WaiverBadge({ student, size = 'sm' }) {
  const status = getWaiverStatus(student);
  const cfg = STATUS_CONFIG[status];
  const pad = size === 'sm' ? '2px 8px' : '4px 12px';
  const fontSize = size === 'sm' ? 11 : 12;

  return (
    <span style={{
      background: cfg.bg,
      color: cfg.color,
      border: `1px solid ${cfg.border}`,
      borderRadius: 99,
      padding: pad,
      fontSize,
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
}
