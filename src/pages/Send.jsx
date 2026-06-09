import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WaiverQR from '../components/WaiverQR';
import { getWaiverUrl } from '../lib/waiverUrl';

export default function Send() {
  const navigate = useNavigate();
  const url = getWaiverUrl();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for environments without clipboard API
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'DNA BJJ Waiver', url });
      } catch {
        // user cancelled or share failed
      }
    }
  }

  return (
    <div className="flex flex-col flex-1 pb-6">
      {/* Header */}
      <div style={{ background: '#111', borderBottom: '1px solid #2a2a2a', padding: '16px 20px' }} className="flex items-center gap-3">
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F0F0F0" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="heading" style={{ fontSize: 22, margin: 0, color: '#F0F0F0' }}>SEND TO STUDENTS</h1>
      </div>

      <div className="flex flex-col items-center p-6 gap-6 flex-1 justify-center">
        <p style={{ fontSize: 13, color: '#888', textAlign: 'center' }}>
          Students scan this QR code to sign the waiver on their phone
        </p>

        <WaiverQR size={220} />

        <p style={{ fontSize: 11, color: '#444', textAlign: 'center', wordBreak: 'break-all', padding: '0 8px' }}>{url}</p>

        {/* Action buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={handleCopy}
            style={{
              flex: 1,
              background: copied ? '#14532d' : '#161616',
              border: `1px solid ${copied ? '#166534' : '#2a2a2a'}`,
              borderRadius: 14, padding: '14px 0',
              color: copied ? '#4ade80' : '#F0F0F0',
              fontWeight: 600, fontSize: 14,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Copied' : 'Copy Link'}
          </button>
          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={handleShare}
              style={{
                flex: 1,
                background: '#C8102E', border: 'none',
                borderRadius: 14, padding: '14px 0',
                color: '#fff', fontWeight: 600, fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
