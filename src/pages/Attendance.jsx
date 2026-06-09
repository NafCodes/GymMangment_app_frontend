import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { apiStudentToUI, getBeltColor } from '../lib/adapters';
import BeltStripeBar from '../components/BeltStripeBar';

const TODAY = new Date();
const TODAY_KEY = TODAY.toISOString().split('T')[0];
const DATE_LABEL = TODAY.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

export default function Attendance() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [recordMap, setRecordMap] = useState({});
  const [present, setPresent] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    loadData();
    return () => clearTimeout(toastTimer.current);
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const [studentData, stripeRows, todayRecords] = await Promise.all([
        apiFetch('/students'),
        apiFetch('/stripes'),
        apiFetch(`/attendance?date=${TODAY_KEY}`),
      ]);

      const stripesByStudent = stripeRows.reduce((acc, row) => {
        if (!acc[row.student_id]) acc[row.student_id] = [];
        acc[row.student_id].push(row);
        return acc;
      }, {});

      const roster = studentData.map(s => apiStudentToUI(s, stripesByStudent[s.id] || []));
      const records = {};
      todayRecords.forEach(r => { records[r.student_id] = r.id; });

      setStudents(roster);
      setRecordMap(records);
      setPresent(new Set(Object.keys(records)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function showToast() {
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2200);
  }

  async function toggle(id) {
    const wasPresent = present.has(id);

    try {
      if (wasPresent) {
        const recordId = recordMap[id];
        if (recordId) {
          await apiFetch(`/attendance/${recordId}`, { method: 'DELETE' });
          setRecordMap(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }
        setPresent(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } else {
        const created = await apiFetch('/attendance', {
          method: 'POST',
          body: JSON.stringify({ student_id: id, session_date: TODAY_KEY }),
        });
        setRecordMap(prev => ({ ...prev, [id]: created.id }));
        setPresent(prev => new Set(prev).add(id));
      }
      showToast();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div style={{ background: '#0A0A0A', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <Header navigate={navigate} />
        <p style={{ color: '#555', fontSize: 14, padding: 20 }}>Loading attendance…</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div style={{ background: '#0A0A0A', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <Header navigate={navigate} />
        <div className="flex flex-col flex-1 items-center justify-center gap-4 p-8 text-center">
          <p style={{ color: '#888', fontSize: 15 }}>No students yet. Add students first.</p>
          <button
            onClick={() => navigate('/students')}
            style={{ background: '#DC2626', border: 'none', borderRadius: 12, padding: '12px 24px', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
          >
            Go to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: `translateX(-50%) translateY(${toast ? 0 : -60}px)`,
        transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
        background: '#166534', color: '#4ade80',
        padding: '10px 20px', borderRadius: '0 0 14px 14px',
        fontSize: 13, fontWeight: 600, zIndex: 60,
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)', whiteSpace: 'nowrap',
      }}>
        Attendance updated ✓
      </div>

      <Header navigate={navigate} />

      {error && (
        <p style={{ color: '#f87171', fontSize: 13, padding: '8px 20px', margin: 0 }}>{error}</p>
      )}

      <div style={{ padding: '20px 20px 8px', borderBottom: '1px solid #1a1a1a' }}>
        <h2 className="heading" style={{ fontSize: 30, margin: 0, color: '#F0F0F0', letterSpacing: 1 }}>
          {DATE_LABEL}
        </h2>
        <p style={{ fontSize: 12, color: '#555', margin: '4px 0 0', fontWeight: 500 }}>
          {present.size} / {students.length} present
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', paddingBottom: 80 }}>
        <div className="flex flex-col gap-2">
          {students.map(student => {
            const isPresent = present.has(student.id);
            return (
              <button
                key={student.id}
                onClick={() => toggle(student.id)}
                style={{
                  background: isPresent ? '#0f1a0f' : '#141414',
                  border: '1px solid transparent',
                  borderLeft: `3px solid ${isPresent ? '#DC2626' : 'transparent'}`,
                  borderRadius: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', transition: 'background 0.18s, border-color 0.18s',
                  textAlign: 'left', width: '100%',
                }}
                className="active:scale-98"
              >
                <Avatar student={student} beltColor={getBeltColor(student.belt)} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: '0 0 5px', fontSize: 15, fontWeight: 600,
                    color: isPresent ? '#F0F0F0' : '#888', transition: 'color 0.18s',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {student.name}
                  </p>
                  <BeltStripeBar stripes={student.stripes} size="sm" />
                </div>
                <div style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                  background: isPresent ? '#DC2626' : 'transparent',
                  border: `2px solid ${isPresent ? '#DC2626' : '#333'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.18s, border-color 0.18s',
                }}>
                  {isPresent && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 390,
        background: 'linear-gradient(to top, #0A0A0A 80%, transparent)',
        padding: '12px 16px 28px',
      }}>
        <p className="heading" style={{ fontSize: 22, color: '#F0F0F0', margin: 0, textAlign: 'center', letterSpacing: 1 }}>
          {present.size} / {students.length} <span style={{ color: '#555', fontSize: 16 }}>PRESENT</span>
        </p>
      </div>
    </div>
  );
}

function Header({ navigate }) {
  return (
    <div style={{ background: '#111', borderBottom: '1px solid #2a2a2a', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F0F0F0" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1 className="heading" style={{ fontSize: 22, margin: 0, color: '#F0F0F0' }}>ATTENDANCE</h1>
    </div>
  );
}

function Avatar({ student, beltColor }) {
  const initials = student.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: 40, height: 40, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
      background: `${beltColor}22`, border: `2px solid ${beltColor}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, color: beltColor }}>{initials}</span>
    </div>
  );
}
