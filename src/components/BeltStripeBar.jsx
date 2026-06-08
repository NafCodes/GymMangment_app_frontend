export default function BeltStripeBar({ stripes, size = 'sm' }) {
  const height = size === 'lg' ? 22 : 14;
  const earned = Array.isArray(stripes) ? stripes.filter(s => s.awarded).length : 0;

  return (
    <div style={{
      display: 'flex',
      gap: 3,
      background: '#1A0A00',
      borderRadius: 99,
      padding: '3px 4px',
      width: '100%',
      maxWidth: size === 'lg' ? 128 : 84,
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.55), inset 0 -1px 2px rgba(255,255,255,0.04)',
    }}>
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height,
            borderRadius: 99,
            background: i < earned ? '#FFFFFF' : '#2A2A2A',
            boxShadow: i < earned
              ? '0 1px 3px rgba(255,255,255,0.25), inset 0 -1px 2px rgba(0,0,0,0.2)'
              : 'inset 0 1px 2px rgba(0,0,0,0.4)',
          }}
        />
      ))}
    </div>
  );
}
