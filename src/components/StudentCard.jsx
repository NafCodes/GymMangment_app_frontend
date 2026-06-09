import { useNavigate } from 'react-router-dom';
import WaiverBadge from './WaiverBadge';
import BeltStripeBar from './BeltStripeBar';
import { getBeltColor } from '../lib/adapters';

export default function StudentCard({ student }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/students/${student.id}`)}
      style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 12 }}
      className="w-full flex items-center gap-3 px-4 py-3 text-left active:opacity-70 transition-opacity"
    >
      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        background: getBeltColor(student.belt),
        flexShrink: 0,
        boxShadow: `0 0 6px ${getBeltColor(student.belt)}88`,
      }} />
      <div className="flex-1 min-w-0">
        <p style={{ fontWeight: 600, fontSize: 15, color: '#F0F0F0', marginBottom: 4 }} className="truncate">{student.name}</p>
        <BeltStripeBar stripes={student.stripes} size="sm" />
      </div>
      <WaiverBadge student={student} />
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  );
}
