import { useState } from 'react';

export default function StripeModal({ mode, stripeIndex, existingDate, onConfirm, onClose }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(existingDate || today);
  const [confirmRemove, setConfirmRemove] = useState(false);

  if (mode === 'remove') {
    return (
      <Backdrop onClose={onClose}>
        <Handle />
        <h2 className="heading" style={{ fontSize: 22, color: '#F0F0F0', margin: 0 }}>
          REMOVE STRIPE {stripeIndex + 1}?
        </h2>
        <p style={{ fontSize: 13, color: '#888', textAlign: 'center' }}>
          This will remove the stripe awarded on{' '}
          <strong style={{ color: '#F0F0F0' }}>{new Date(existingDate).toLocaleDateString()}</strong>.
        </p>
        {!confirmRemove ? (
          <div className="flex gap-3 w-full">
            <button onClick={onClose} style={btnStyle('#222', '#888', '1px solid #2a2a2a')}>Cancel</button>
            <button onClick={() => setConfirmRemove(true)} style={btnStyle('#7f1d1d', '#f87171', '1px solid #7f1d1d')}>Remove</button>
          </div>
        ) : (
          <div className="flex gap-3 w-full">
            <button onClick={onClose} style={btnStyle('#222', '#888', '1px solid #2a2a2a')}>Cancel</button>
            <button onClick={() => onConfirm(null)} style={btnStyle('#C8102E', '#fff', 'none')}>Yes, Remove</button>
          </div>
        )}
      </Backdrop>
    );
  }

  return (
    <Backdrop onClose={onClose}>
      <Handle />
      <h2 className="heading" style={{ fontSize: 22, color: '#F0F0F0', margin: 0 }}>
        AWARD STRIPE {stripeIndex + 1}
      </h2>
      <div className="flex flex-col gap-1 w-full">
        <label style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>Award Date</label>
        <input
          type="date"
          value={date}
          max={today}
          onChange={e => setDate(e.target.value)}
          style={{ background: '#0A0A0A', border: '1px solid #2a2a2a', borderRadius: 8, padding: '10px 12px', color: '#F0F0F0', fontSize: 14, outline: 'none', width: '100%' }}
        />
      </div>
      <div className="flex gap-3 w-full">
        <button onClick={onClose} style={btnStyle('#222', '#888', '1px solid #2a2a2a')}>Cancel</button>
        <button onClick={() => onConfirm(date)} style={btnStyle('#C8102E', '#fff', 'none')}>Award Stripe</button>
      </div>
    </Backdrop>
  );
}

function btnStyle(bg, color, border) {
  return { flex: 1, background: bg, border, borderRadius: 12, padding: '12px 0', color, fontWeight: 600, fontSize: 14, cursor: 'pointer' };
}

function Backdrop({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 768 }} className="p-6 pb-10 flex flex-col items-center gap-4">
        {children}
      </div>
    </div>
  );
}

function Handle() {
  return <div style={{ width: 40, height: 4, background: '#333', borderRadius: 99 }} />;
}
