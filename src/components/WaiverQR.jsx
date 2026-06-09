import { QRCodeSVG } from 'qrcode.react';
import { getWaiverUrl } from '../lib/waiverUrl';
import dnaLogo from '../assets/dna-logo.png';

export default function WaiverQR({ size = 220 }) {
  const logoSize = Math.round(size * 0.22);

  return (
    <div style={{ background: '#fff', padding: Math.round(size * 0.09), borderRadius: Math.round(size * 0.09) }}>
      <QRCodeSVG
        value={getWaiverUrl()}
        size={size}
        level="H"
        imageSettings={{
          src: dnaLogo,
          height: logoSize,
          width: logoSize,
          excavate: true,
        }}
      />
    </div>
  );
}
