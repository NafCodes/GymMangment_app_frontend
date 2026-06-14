import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { apiStudentToUI, uiStudentToApi } from '../lib/adapters';
import StudentCard from '../components/StudentCard';

const BELTS = ['White', 'Blue', 'Purple', 'Brown', 'Black'];
const today = new Date().toISOString().split('T')[0];
const EMPTY_FORM = { name: '', email: '', belt: 'White', joinDate: today };

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch('/students');
      const stripeRows = await apiFetch('/stripes');
      const stripesByStudent = stripeRows.reduce((acc, row) => {
        if (!acc[row.student_id]) acc[row.student_id] = [];
        acc[row.student_id].push(row);
        return acc;
      }, {});
      setStudents(data.map(s => apiStudentToUI(s, stripesByStudent[s.id] || [])));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openModal() {
    setForm(EMPTY_FORM);
    setShowModal(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)));
  }

  function closeModal() {
    setAnimateIn(false);
    setTimeout(() => setShowModal(false), 280);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = uiStudentToApi(form);
      if (!form.email.trim()) delete payload.email;
      const created = await apiFetch('/students', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setStudents(prev => [apiStudentToUI(created), ...prev]);
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.belt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1" style={{ paddingBottom: 100 }}>
      <div style={{ background: '#111', borderBottom: '1px solid #2a2a2a', padding: '16px 20px' }} className="flex items-center gap-3">
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 11, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F0F0F0" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className="heading" style={{ fontSize: 22, margin: 0, color: '#F0F0F0', flex: 1 }}>STUDENTS</h1>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 10 }} className="flex items-center gap-2 px-3 py-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students..."
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#F0F0F0', fontSize: 14, flex: 1 }}
          />
        </div>

        {error && <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p>}

        {loading ? (
          <p style={{ color: '#555', fontSize: 14 }}>Loading students…</p>
        ) : (
          <>
            <p style={{ fontSize: 12, color: '#888' }}>{filtered.length} student{filtered.length !== 1 ? 's' : ''}</p>
            {filtered.map(s => <StudentCard key={s.id} student={s} />)}
          </>
        )}
      </div>

      <button
        onClick={openModal}
        style={{
          position: 'fixed', bottom: 28, right: 24,
          width: 56, height: 56, borderRadius: '50%',
          background: '#DC2626', border: 'none',
          boxShadow: '0 4px 20px rgba(220,38,38,0.45)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40,
        }}
        className="active:scale-90 transition-transform"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.72)' }}
          onClick={closeModal}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1A1A1A', border: '1px solid #2a2a2a',
              borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 768,
              transform: animateIn ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.28s cubic-bezier(0.32,0.72,0,1)',
            }}
            className="p-6 pb-10 flex flex-col gap-4"
          >
            <div style={{ width: 40, height: 4, background: '#333', borderRadius: 99, margin: '0 auto' }} />
            <h2 className="heading" style={{ fontSize: 24, color: '#F0F0F0', margin: 0 }}>ADD STUDENT</h2>

            <form onSubmit={handleAdd} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>Full Name</label>
                <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
              </div>

              <div className="flex flex-col gap-1">
                <label style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>
                  Email <span style={{ fontWeight: 400, color: '#555' }}>(optional)</span>
                </label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
              </div>

              <div className="flex flex-col gap-1">
                <label style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>Belt Level</label>
                <select value={form.belt} onChange={e => setForm(f => ({ ...f, belt: e.target.value }))} style={inputStyle}>
                  {BELTS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>Join Date</label>
                <input type="date" required value={form.joinDate} onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))} style={inputStyle} />
              </div>

              <div className="flex gap-3 mt-1">
                <button type="button" onClick={closeModal} style={{ flex: 1, background: '#222', border: '1px solid #2a2a2a', borderRadius: 14, padding: '13px 0', color: '#888', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={{ flex: 2, background: '#DC2626', border: 'none', borderRadius: 14, padding: '13px 0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Adding…' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  background: '#0A0A0A',
  border: '1px solid #2a2a2a',
  borderRadius: 10,
  padding: '10px 12px',
  color: '#F0F0F0',
  fontSize: 14,
  outline: 'none',
  width: '100%',
};
