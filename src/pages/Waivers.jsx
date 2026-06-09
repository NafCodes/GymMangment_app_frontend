import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { apiStudentToUI, getWaiverStatusFromAPI } from '../lib/adapters';
import WaiverQR from '../components/WaiverQR';
import { getWaiverUrl } from '../lib/waiverUrl';

const STATUS_META = {
  valid:    { label: 'Signed',        dot: '#4ade80', border: '#166534', bg: '#0d1f0d' },
  missing:  { label: 'Not Signed',    dot: '#444',    border: '#2a2a2a', bg: '#141414' },
};

export default function Waivers() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrOpen, setQrOpen]     = useState(false);
  const [copied, setCopied]     = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const qrUrl = getWaiverUrl();

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch('/students');
      setStudents(data.map(s => apiStudentToUI(s)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function doMarkSigned(id) {
    try {
      await apiFetch(`/students/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ waiver_active: true }),
      });
      setStudents(prev => prev.map(s =>
        s.id === id ? { ...s, waiver: { signed: true, dateSigned: null, expires: null } } : s
      ));
      setConfirmId(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCopy() {
    try { await navigator.clipboard.writeText(qrUrl); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const grouped = {
    missing: students.filter(s => getWaiverStatusFromAPI(s) === 'missing'),
    valid:   students.filter(s => getWaiverStatusFromAPI(s) === 'valid'),
  };

  return (
    <div className="flex flex-col flex-1" style={{ paddingBottom: 96 }}>
      <div style={{ background: '#111', borderBottom: '1px solid #2a2a2a', padding: '16px 20px' }} className="flex items-center gap-3">
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F0F0F0" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className="heading" style={{ fontSize: 22, margin: 0, color: '#F0F0F0' }}>WAIVERS</h1>
      </div>

      <div className="p-4 flex flex-col gap-5">
        {error && <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p>}

        {loading ? (
          <p style={{ color: '#555', fontSize: 14 }}>Loading waivers…</p>
        ) : (
          Object.entries(grouped).map(([status, list]) => {
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
                          {student.waiver?.signed ? 'Waiver on file' : 'No waiver on file'}
                        </p>
                      </div>

                      {status === 'missing' && (
                        confirmId === student.id ? (
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => setConfirmId(null)} style={{ background: '#222', border: '1px solid #333', borderRadius: 8, padding: '5px 10px', color: '#888', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                              Cancel
                            </button>
                            <button onClick={() => doMarkSigned(student.id)} style={{ background: '#DC2626', border: 'none', borderRadius: 8, padding: '5px 10px', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                              Confirm
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmId(student.id)} style={{ background: 'transparent', border: '1px solid #333', borderRadius: 8, padding: '5px 12px', color: '#888', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                            Mark Signed
                          </button>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

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

      {qrOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.78)' }} onClick={() => setQrOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1A1A1A', border: '1px solid #2a2a2a', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 390 }} className="p-6 pb-10 flex flex-col items-center gap-5">
            <div style={{ width: 40, height: 4, background: '#333', borderRadius: 99 }} />
            <h2 className="heading" style={{ fontSize: 22, color: '#F0F0F0', margin: 0 }}>WAIVER QR CODE</h2>
            <p style={{ fontSize: 13, color: '#888', textAlign: 'center', margin: 0 }}>
              Have students scan this to sign their waiver
            </p>
            <WaiverQR size={200} />
            <p style={{ fontSize: 11, color: '#3a3a3a', textAlign: 'center', wordBreak: 'break-all', margin: 0, padding: '0 8px' }}>
              {qrUrl}
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={handleCopy} style={{ flex: 1, background: copied ? '#14532d' : '#222', border: `1px solid ${copied ? '#166534' : '#333'}`, borderRadius: 12, padding: '13px 0', color: copied ? '#4ade80' : '#aaa', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}>
                {copied ? '✓ Copied' : 'Copy Link'}
              </button>
              <button onClick={() => setQrOpen(false)} style={{ flex: 1, background: '#DC2626', border: 'none', borderRadius: 12, padding: '13px 0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
