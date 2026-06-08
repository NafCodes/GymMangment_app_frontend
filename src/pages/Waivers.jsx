import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents, saveStudents, getWaiverStatus } from '../data/seedData';
import { QRCodeSVG } from 'qrcode.react';

const STATUS_META = {
  valid:    { label: 'Signed',        dot: '#4ade80', border: '#166534', bg: '#0d1f0d' },
  expiring: { label: 'Expiring Soon', dot: '#FFD700', border: '#92400e', bg: '#1c1200' },
  expired:  { label: 'Expired',       dot: '#f87171', border: '#7f1d1d', bg: '#1a0505' },
  missing:  { label: 'Not Signed',    dot: '#444',    border: '#2a2a2a', bg: '#141414' },
};

// Expiry is next Jan 1; if signed in December push to year+2 Jan 1 (too close)
function computeExpiry(now) {
  const year = now.getMonth() === 11 ? now.getFullYear() + 2 : now.getFullYear() + 1;
  return `${year}-01-01`;
}

export default function Waivers() {
  const navigate = useNavigate();
  const [students, setStudents] = useState(getStudents);
  const [qrOpen, setQrOpen]     = useState(false);
  const [copied, setCopied]     = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const qrUrl = `${window.location.origin}/sign-waiver`;

  function doMarkSigned(id) {
    const now = new Date();
    const updated = students.map(s =>
      s.id === id
        ? { ...s, waiver: { signed: true, dateSigned: now.toISOString().split('T')[0], expires: computeExpiry(now) } }
        : s
    );
    saveStudents(updated);
    setStudents(updated);
    setConfirmId(null);
  }

  async function handleCopy() {
    try { await navigator.clipboard.writeText(qrUrl); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const grouped = {
    expiring: students.filter(s => getWaiverStatus(s) === 'expiring'),
    expired:  students.filter(s => getWaiverStatus(s) === 'expired'),
    missing:  students.filter(s => getWaiverStatus(s) === 'missing'),
    valid:    students.filter(s => getWaiverStatus(s) === 'valid'),
  };

  return (
    <div className="flex flex-col flex-1" style={{ paddingBottom: 96 }}>
      {/* Header */}
      <div style={{ background: '#111', borderBottom: '1px solid #2a2a2a', padding: '16px 20px' }} className="flex items-center gap-3">
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F0F0F0" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className="heading" style={{ fontSize: 22, margin: 0, color: '#F0F0F0' }}>WAIVERS</h1>
      </div>

      <div className="p-4 flex flex-col gap-5">
        {Object.entries(grouped).map(([status, list]) => {
          if (!list.length) return null;
          const meta = STATUS_META[status];
          return (
            <div key={status}>
              <p className="heading" style={{ fontSize: 13, color: '#555', marginBottom: 8, letterSpacing: 1 }}>
                {meta.label.toUpperCase()} · {list.length}
              </p>
              <div className="flex flex-col gap-2">
                {list.map(student => (
                  <div
                    key={student.id}
                    style={{ background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: 12 }}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: meta.dot, flexShrink: 0 }} />

                    <div className="flex-1 min-w-0">
                      <p style={{ fontWeight: 600, fontSize: 14, color: '#F0F0F0', margin: 0 }} className="truncate">
                        {student.name}
                      </p>
                      <p style={{ fontSize: 11, color: '#888', margin: '2px 0 0' }}>
                        {student.waiver?.signed
                          ? `Expires ${new Date(student.waiver.expires).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                          : 'No waiver on file'}
                      </p>
                    </div>

                    {/* Mark Signed — two-step confirm */}
                    {(status === 'missing' || status === 'expired') && (
                      confirmId === student.id ? (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => setConfirmId(null)}
                            style={{ background: '#222', border: '1px solid #333', borderRadius: 8, padding: '5px 10px', color: '#888', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => doMarkSigned(student.id)}
                            style={{ background: '#DC2626', border: 'none', borderRadius: 8, padding: '5px 10px', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                          >
                            Confirm
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(student.id)}
                          style={{ background: 'transparent', border: '1px solid #333', borderRadius: 8, padding: '5px 12px', color: '#888', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                        >
                          Mark Signed
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed bottom — Generate QR */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 390,
        background: 'linear-gradient(to top, #0A0A0A 75%, transparent)',
        padding: '12px 16px 28px',
      }}>
        <button
          onClick={() => setQrOpen(true)}
          style={{ width: '100%', background: '#DC2626', border: 'none', borderRadius: 14, padding: '15px 0', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
        >
          Generate QR Code
        </button>
      </div>

      {/* QR Modal */}
      {qrOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.78)' }}
          onClick={() => setQrOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#1A1A1A', border: '1px solid #2a2a2a', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 390 }}
            className="p-6 pb-10 flex flex-col items-center gap-5"
          >
            <div style={{ width: 40, height: 4, background: '#333', borderRadius: 99 }} />

            <h2 className="heading" style={{ fontSize: 22, color: '#F0F0F0', margin: 0 }}>WAIVER QR CODE</h2>
            <p style={{ fontSize: 13, color: '#888', textAlign: 'center', margin: 0 }}>
              Have students scan this to sign their waiver
            </p>

            <div style={{ background: '#fff', padding: 18, borderRadius: 18 }}>
              <QRCodeSVG value={qrUrl} size={200} />
            </div>

            <p style={{ fontSize: 11, color: '#3a3a3a', textAlign: 'center', wordBreak: 'break-all', margin: 0, padding: '0 8px' }}>
              {qrUrl}
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={handleCopy}
                style={{
                  flex: 1, background: copied ? '#14532d' : '#222',
                  border: `1px solid ${copied ? '#166534' : '#333'}`,
                  borderRadius: 12, padding: '13px 0',
                  color: copied ? '#4ade80' : '#aaa',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {copied ? '✓ Copied' : 'Copy Link'}
              </button>
              <button
                onClick={() => setQrOpen(false)}
                style={{ flex: 1, background: '#DC2626', border: 'none', borderRadius: 12, padding: '13px 0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
