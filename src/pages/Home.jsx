import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const CARDS = [
  {
    to: '/students',
    label: 'Students',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    to: '/attendance',
    label: 'Attendance',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <polyline points="9 16 11 18 15 14"/>
      </svg>
    ),
  },
  {
    to: '/waivers',
    label: 'Waivers',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    to: '/send',
    label: 'Send to Students',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="5" height="5"/><rect x="16" y="3" width="5" height="5"/>
        <rect x="3" y="16" width="5" height="5"/>
        <path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
        <path d="M21 21v.01"/>
        <path d="M12 7v3a2 2 0 0 1-2 2H7"/>
        <path d="M3 12h.01"/><path d="M12 3h.01"/>
        <path d="M12 16v.01"/><path d="M16 12h1"/>
        <path d="M21 12v.01"/><path d="M12 21v-1"/>
      </svg>
    ),
  },
];

export default function Home() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: '0 16px 24px' }}>
      {/* Header */}
      <div style={{ paddingTop: 56, textAlign: 'center', marginBottom: 8, position: 'relative' }}>
        <button
          onClick={handleLogout}
          style={{
            position: 'absolute', top: 56, right: 0,
            background: 'transparent', border: '1px solid #333',
            borderRadius: 8, padding: '6px 12px',
            color: '#666', fontSize: 11, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Log Out
        </button>
        <h1 className="heading" style={{ fontSize: 64, margin: 0, color: '#FFFFFF', letterSpacing: 6, lineHeight: 1 }}>
          DNA
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#555', margin: '6px 0 0', letterSpacing: 2, textTransform: 'uppercase' }}>
          Coach Dashboard
        </p>
      </div>

      {/* 2×2 grid — fills remaining height */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12, marginTop: 24 }}>
        {CARDS.map(({ to, label, icon }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            style={{
              background: '#1A1A1A',
              border: '1px solid #2a2a2a',
              borderRadius: 20,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: 16,
            }}
            className="active:opacity-70 active:scale-95 transition-all"
          >
            {icon}
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: '#F0F0F0' }}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
