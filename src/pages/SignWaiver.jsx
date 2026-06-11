import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const WAIVER_TEXT = `DNA BJJ CLUB
LIABILITY WAIVER & MEMBERSHIP AGREEMENT

This Liability Waiver and Membership Agreement ("Agreement") is entered into between the undersigned participant and DNA BJJ Club ("the Club"). Please read carefully before signing.

──────────────────────────────────────────

1. NATURE OF ACTIVITY

Brazilian Jiu-Jitsu (BJJ) is a contact-based martial art involving grappling, clinch work, takedowns, joint-lock submissions, and choke techniques applied to a resisting partner. Participation requires close physical contact with training partners of varying size, strength, and experience.

──────────────────────────────────────────

2. ASSUMPTION OF RISK

I voluntarily and knowingly assume all risks inherent in BJJ training, including but not limited to: sprains, muscle tears, joint injuries (including knee, shoulder, elbow, and neck), rib injuries, cuts and abrasions, concussions, fractures, dental injuries, and in rare cases permanent disability. I understand these risks exist even when proper safety protocols and supervision are in place, and that my training partners may inadvertently cause injury despite good intentions.

──────────────────────────────────────────

3. RELEASE OF LIABILITY

In consideration of being permitted to participate in Club activities, I hereby release, waive, discharge, and covenant not to sue DNA BJJ Club, its owners, directors, coaches, instructors, staff, agents, volunteers, and other members (collectively "Released Parties") from any and all liability, claims, demands, actions, or causes of action arising out of or related to any loss, damage, or injury — including death — that may be sustained by me while participating in any Club activity, whether caused by the negligence of the Released Parties or otherwise.

──────────────────────────────────────────

4. MEDICAL ACKNOWLEDGMENT

I represent that I am in adequate physical condition to participate in BJJ training. I have disclosed any pre-existing injuries, medical conditions, or physical limitations to my coach. I authorize the Club to seek emergency medical treatment on my behalf if I am unable to do so myself, and I agree to bear all associated costs. I understand the Club is not responsible for any medical expenses incurred.

──────────────────────────────────────────

5. GYM RULES & CODE OF CONDUCT

I agree to follow all Club rules at all times:

• Tap early and tap often — submissions must be released immediately upon any tap, verbal signal, or visible distress
• No slamming, spiking, or striking of any kind during training
• Respect all skill levels; adjust intensity appropriately when rolling with newer students
• Maintain personal hygiene: wash and fully dry your gi before every class, trim fingernails and toenails short, cover all open wounds
• No shoes on the mat; no street clothes worn on the mat during sparring
• Report injuries — your own and others' — to a coach immediately
• Aggressive, reckless, or unsafe behavior may result in immediate suspension or permanent removal from the program, at the Club's sole discretion

──────────────────────────────────────────

6. PHOTO & MEDIA RELEASE

I grant DNA BJJ Club the non-exclusive, royalty-free right to use photographs, video recordings, and other media of me taken during Club activities — including training, competitions, and events — for promotional, educational, and social media purposes, without compensation or prior approval. I may revoke this consent at any time by providing written notice to Club management.

──────────────────────────────────────────

7. ANNUAL RENEWAL

This waiver expires on January 1st of each calendar year and must be renewed to continue participation. The Club will make reasonable efforts to notify members before expiry. Participation after the expiry date without a renewed waiver on file is not permitted.

──────────────────────────────────────────

8. MINORS

Participants under the age of 18 require a parent or legal guardian to sign this waiver on their behalf. The guardian assumes all obligations set forth in this Agreement.

──────────────────────────────────────────

9. SEVERABILITY

If any provision of this Agreement is found to be unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect.

──────────────────────────────────────────

By signing below, I confirm that:
• I have read and understood this Agreement in its entirety
• I am 18 years of age or older, or have obtained the necessary parental/guardian consent
• I am signing voluntarily, without coercion
• I understand this is a legally binding document`;

// Expiry is next Jan 1; December signings push to year+2 Jan 1
function computeExpiry(now) {
  const year = now.getMonth() === 11 ? now.getFullYear() + 2 : now.getFullYear() + 1;
  return { expires: `${year}-01-01`, year };
}

export default function SignWaiver() {
  const [form, setForm]           = useState({ name: '', email: '', signature: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [apiError, setApiError]   = useState(null);
  const [signerName, setSignerName] = useState('');
  const [expiryYear, setExpiryYear] = useState(null);

  const today     = new Date();
  const dateLabel = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError(null);
    setLoading(true);

    const { expires, year } = computeExpiry(today);
    const dateSigned = today.toISOString().split('T')[0];

    try {
      const res = await fetch(`${API_URL}/waivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          signature: form.signature,
          date_signed: dateSigned,
          expires,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error (${res.status})`);
      }

      setSignerName(form.name);
      setExpiryYear(year);
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || 'Failed to submit waiver. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ background: '#FAFAFA', minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', gap: 20 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', border: '2px solid #4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: '#111', margin: '0 0 8px', letterSpacing: 2 }}>
            WAIVER SIGNED
          </h1>
          <p style={{ fontSize: 16, color: '#16a34a', fontWeight: 600, margin: 0 }}>Signed Successfully</p>
          <p style={{ fontSize: 14, color: '#555', marginTop: 8 }}>Thank you, {signerName}.</p>
          <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
            Your waiver is valid until{' '}
            <strong style={{ color: '#111' }}>January 1st, {expiryYear}</strong>.
          </p>
          <p style={{ fontSize: 12, color: '#bbb', marginTop: 20 }}>You may close this page.</p>
        </div>
      </div>
    );
  }

  // ── Waiver form ─────────────────────────────────────────────────
  return (
    <div style={{ background: '#FAFAFA', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: '#DC2626', padding: '28px 24px 20px' }}>
        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 30, color: '#fff', margin: 0, letterSpacing: 4 }}>DNA</p>
        <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#ffffff99', fontWeight: 500, margin: '4px 0 0' }}>
          Liability Waiver &amp; Membership Agreement
        </h1>
      </div>

      <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Scrollable waiver text */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: 12,
          padding: '16px 16px',
          maxHeight: 260,
          overflowY: 'auto',
        }}>
          <pre style={{
            fontSize: 11, color: '#555', lineHeight: 1.7,
            whiteSpace: 'pre-wrap', fontFamily: 'DM Sans, sans-serif',
            margin: 0,
          }}>
            {WAIVER_TEXT}
          </pre>
        </div>

        {/* Sign Below */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: '#e0e0e0' }} />
            <span style={{ fontSize: 12, color: '#999', fontWeight: 600, letterSpacing: 1 }}>SIGN BELOW</span>
            <div style={{ flex: 1, height: 1, background: '#e0e0e0' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Full Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text" required
                placeholder="Your full legal name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={lightInputStyle}
              />
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email" required
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={lightInputStyle}
              />
            </div>

            {/* Signature */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={labelStyle}>Digital Signature</label>
              <input
                type="text" required
                placeholder="Type your full name as signature"
                value={form.signature}
                onChange={e => setForm(f => ({ ...f, signature: e.target.value }))}
                style={{ ...lightInputStyle, fontStyle: 'italic', fontFamily: 'Georgia, serif', fontSize: 16, color: '#1a1a1a' }}
              />
              <p style={{ fontSize: 10, color: '#aaa', margin: '2px 0 0' }}>By typing your name above you are providing a legally binding digital signature.</p>
            </div>

            {/* Date — read only */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={labelStyle}>Date</label>
              <div style={{ ...lightInputStyle, color: '#888', cursor: 'default' }}>{dateLabel}</div>
            </div>

            {apiError && (
              <p style={{ fontSize: 13, color: '#DC2626', textAlign: 'center', margin: 0 }}>
                {apiError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ background: loading ? '#f87171' : '#DC2626', border: 'none', borderRadius: 14, padding: '15px 0', color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'default' : 'pointer', marginTop: 4 }}
            >
              {loading ? 'Submitting…' : 'I Agree & Sign'}
            </button>

            <p style={{ fontSize: 10, color: '#bbb', textAlign: 'center', margin: 0 }}>
              This waiver expires January 1st each year and must be renewed annually.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: 11, color: '#888', fontWeight: 600, letterSpacing: 0.5,
};

const lightInputStyle = {
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: 10,
  padding: '11px 14px',
  color: '#111',
  fontSize: 14,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};
