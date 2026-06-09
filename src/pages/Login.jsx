import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    navigate(from, { replace: true });
  }

  return (
    <div style={{
      background: '#0A0A0A', minHeight: '100dvh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 className="heading" style={{ fontSize: 64, margin: 0, color: '#FFFFFF', letterSpacing: 6, lineHeight: 1 }}>
          DNA
        </h1>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#555', margin: '6px 0 0', letterSpacing: 2, textTransform: 'uppercase' }}>
          Coach Login
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 6, fontWeight: 600, letterSpacing: 0.5 }}>
            EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#161616', border: '1px solid #2a2a2a',
              borderRadius: 10, padding: '12px 14px',
              color: '#F0F0F0', fontSize: 15, outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 6, fontWeight: 600, letterSpacing: 0.5 }}>
            PASSWORD
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#161616', border: '1px solid #2a2a2a',
              borderRadius: 10, padding: '12px 14px',
              color: '#F0F0F0', fontSize: 15, outline: 'none',
            }}
          />
        </div>

        {error && (
          <p style={{ color: '#f87171', fontSize: 13, margin: 0, textAlign: 'center' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', marginTop: 8,
            background: loading ? '#7f1d1d' : '#C8102E',
            border: 'none', borderRadius: 12,
            padding: '14px 0', color: '#fff',
            fontWeight: 700, fontSize: 15,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
