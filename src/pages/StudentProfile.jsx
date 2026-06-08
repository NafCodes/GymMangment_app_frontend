import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudents, saveStudents, getAttendance, getBeltColor, getWaiverStatus } from '../data/seedData';
import BeltStripeBar from '../components/BeltStripeBar';
import StripeModal from '../components/StripeModal';

// ── Waiver dot ────────────────────────────────────────────────────
const WAIVER_DOT = {
  valid:    { color: '#4ade80', label: 'Signed' },
  expiring: { color: '#FFD700', label: 'Expiring' },
  expired:  { color: '#f87171', label: 'Expired' },
  missing:  { color: '#555',    label: 'No Waiver' },
};

// ── Weekly chart helpers ──────────────────────────────────────────
function getMondayOf(offsetWeeks) {
  const now = new Date();
  const dow = now.getDay(); // 0=Sun
  const daysToMon = dow === 0 ? 6 : dow - 1;
  const mon = new Date(now);
  mon.setDate(now.getDate() - daysToMon + offsetWeeks * 7);
  mon.setHours(0, 0, 0, 0);
  return mon;
}

function getWeekDays(offsetWeeks) {
  const mon = getMondayOf(offsetWeeks);
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

function weekRangeLabel(days) {
  const fmt = { month: 'short', day: 'numeric' };
  return `${days[0].toLocaleDateString('en-US', fmt)} – ${days[4].toLocaleDateString('en-US', fmt)}`;
}

// ── 6-month helpers ───────────────────────────────────────────────
function getMonthLabel(year, month) {
  return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function buildMonthlyAttendance(studentId, attendance) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    let count = 0;
    Object.entries(attendance).forEach(([dateStr, ids]) => {
      const dd = new Date(dateStr);
      if (dd.getFullYear() === year && dd.getMonth() === month && ids.includes(studentId)) count++;
    });
    return { label: getMonthLabel(year, month), count };
  });
}

// ─────────────────────────────────────────────────────────────────
export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const attendance = getAttendance();

  const [student, setStudent] = useState(() => getStudents().find(s => s.id === id));
  const [modal, setModal] = useState(null);

  if (!student) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center pb-6">
        <p style={{ color: '#888' }}>Student not found.</p>
        <button onClick={() => navigate('/students')} style={{ color: '#DC2626', marginTop: 12, background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
      </div>
    );
  }

  const monthlyStats = buildMonthlyAttendance(student.id, attendance);
  const maxCount     = Math.max(...monthlyStats.map(m => m.count), 1);
  const waiverStatus = getWaiverStatus(student);
  const waiverDot    = WAIVER_DOT[waiverStatus];

  function handleStripeConfirm(date) {
    const { mode, index } = modal;
    const stripes = student.stripes.map((s, i) => {
      if (i !== index) return s;
      return mode === 'award' ? { awarded: true, date } : { awarded: false, date: null };
    });
    const updated = getStudents().map(s => s.id === student.id ? { ...s, stripes } : s);
    saveStudents(updated);
    setStudent(prev => ({ ...prev, stripes }));
    setModal(null);
  }

  return (
    <div className="flex flex-col flex-1 pb-6">
      {/* Header bar */}
      <div style={{ background: '#111', borderBottom: '1px solid #2a2a2a', padding: '16px 20px' }} className="flex items-center gap-3">
        <button onClick={() => navigate('/students')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F0F0F0" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className="heading" style={{ fontSize: 22, margin: 0, color: '#F0F0F0' }}>PROFILE</h1>
      </div>

      <div className="p-4 flex flex-col gap-4">

        {/* ── Student info card ── */}
        <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 14 }} className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div style={{
              width: 50, height: 50, borderRadius: 14, flexShrink: 0,
              background: `${getBeltColor(student.belt)}22`,
              border: `2px solid ${getBeltColor(student.belt)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {student.photo
                ? <img src={student.photo} alt={student.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: getBeltColor(student.belt) }}>{student.name.charAt(0)}</span>
              }
            </div>

            <div className="flex-1 min-w-0">
              {/* Name + waiver dot */}
              <div className="flex items-center gap-2" style={{ marginBottom: 5 }}>
                <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 22, margin: 0, color: '#F0F0F0', lineHeight: 1 }}>
                  {student.name}
                </h2>
                <div
                  title={waiverDot.label}
                  style={{ width: 9, height: 9, borderRadius: '50%', background: waiverDot.color, flexShrink: 0, marginTop: 1 }}
                />
              </div>

              {/* Belt label + stripe bar */}
              <div className="flex items-center gap-2 mb-2">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: getBeltColor(student.belt), flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#888' }}>{student.belt} Belt</span>
              </div>
              <BeltStripeBar stripes={student.stripes} size="lg" />
            </div>
          </div>

          {/* Email + join date */}
          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 12 }} className="flex flex-col gap-2">
            <Row label="Email" value={student.email} />
            <Row label="Member Since" value={new Date(student.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
          </div>
        </div>

        {/* ── Stripes section ── */}
        <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 14 }} className="p-4 flex flex-col gap-3">
          <span className="heading" style={{ fontSize: 18, color: '#F0F0F0' }}>STRIPES</span>
          <div className="flex gap-3">
            {student.stripes.map((stripe, i) => (
              <button
                key={i}
                onClick={() => setModal({ mode: stripe.awarded ? 'remove' : 'award', index: i })}
                style={{
                  flex: 1,
                  background: stripe.awarded ? '#1A0A00' : '#111',
                  border: `2px solid ${stripe.awarded ? '#fff' : '#333'}`,
                  borderRadius: 10, padding: '10px 4px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}
                className="active:opacity-70"
              >
                <div style={{ width: '100%', height: 28, borderRadius: 6, background: stripe.awarded ? '#FFFFFF' : '#2A2A2A' }} />
                {stripe.awarded
                  ? <span style={{ fontSize: 9, color: '#888', textAlign: 'center', lineHeight: 1.2 }}>
                      {new Date(stripe.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  : <span style={{ fontSize: 16, color: '#444' }}>+</span>
                }
              </button>
            ))}
          </div>
        </div>

        {/* ── Weekly attendance chart ── */}
        <WeeklyChart studentId={student.id} attendance={attendance} />

        {/* ── 6-month bar chart ── */}
        <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 14 }} className="p-4 flex flex-col gap-4">
          <span className="heading" style={{ fontSize: 18, color: '#F0F0F0' }}>6-MONTH ATTENDANCE</span>
          <div className="flex items-end gap-2" style={{ height: 80 }}>
            {monthlyStats.map(({ label, count }) => (
              <div key={label} className="flex flex-col items-center gap-1 flex-1">
                <span style={{ fontSize: 11, color: count === 0 ? '#f87171' : '#888' }}>{count}</span>
                <div style={{
                  width: '100%',
                  height: count === 0 ? 4 : Math.max(8, (count / maxCount) * 56),
                  background: count === 0 ? '#450a0a' : '#DC2626',
                  borderRadius: 4,
                }} />
                <span style={{ fontSize: 10, color: '#555' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {modal && (
        <StripeModal
          mode={modal.mode}
          stripeIndex={modal.index}
          existingDate={student.stripes[modal.index]?.date}
          onConfirm={handleStripeConfirm}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// ── Weekly chart component ────────────────────────────────────────
function WeeklyChart({ studentId, attendance }) {
  const [weekOffset, setWeekOffset]   = useState(0);
  const [dragX, setDragX]             = useState(0);
  const isDragging                    = useRef(false);
  const touchStartX                   = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days  = getWeekDays(weekOffset);
  const label = weekRangeLabel(days);

  function goBack()    { setWeekOffset(o => o - 1); }
  function goForward() { if (weekOffset < 0) setWeekOffset(o => o + 1); }

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current  = true;
  }

  function onTouchMove(e) {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    // Resist right-swipe at current week boundary
    if (dx > 0 && weekOffset === 0) {
      setDragX(Math.min(dx * 0.12, 14));
    } else {
      setDragX(Math.max(Math.min(dx, 72), -72));
    }
  }

  function onTouchEnd(e) {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    setDragX(0);
    if (dx < -50)                    goBack();
    else if (dx > 50 && weekOffset < 0) goForward();
  }

  return (
    <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 14 }} className="p-4 flex flex-col gap-3">

      {/* Title + week nav */}
      <div className="flex items-center justify-between">
        <span className="heading" style={{ fontSize: 18, color: '#F0F0F0' }}>THIS WEEK</span>
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', color: '#888' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span style={{ fontSize: 11, color: '#555', minWidth: 110, textAlign: 'center' }}>{label}</span>
          <button
            onClick={goForward}
            disabled={weekOffset === 0}
            style={{ background: 'none', border: 'none', cursor: weekOffset === 0 ? 'default' : 'pointer', padding: '2px 6px', color: weekOffset === 0 ? '#2a2a2a' : '#888' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Day bars — swipeable */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ overflow: 'hidden' }}
      >
        <div style={{
          display: 'flex', gap: 6,
          transform: `translateX(${dragX}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.22s ease',
          userSelect: 'none',
        }}>
          {days.map(day => {
            const key      = day.toISOString().split('T')[0];
            const isFuture = day > today;
            const isToday  = day.getTime() === today.getTime();
            const attended = !isFuture && (attendance[key] || []).includes(studentId);
            const dayName  = day.toLocaleDateString('en-US', { weekday: 'short' });
            const dateNum  = day.getDate();

            let barColor;
            if (isFuture)  barColor = '#1e1e1e';
            else if (attended) barColor = '#DC2626';
            else           barColor = '#2A2A2A';

            return (
              <div key={key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 10, color: isToday ? '#F0F0F0' : '#555', fontWeight: isToday ? 700 : 400 }}>
                  {dayName}
                </span>
                <div style={{
                  width: '100%', height: 52, borderRadius: 8,
                  background: barColor,
                  boxShadow: attended ? '0 0 8px rgba(220,38,38,0.3)' : 'none',
                  transition: 'background 0.15s',
                  position: 'relative',
                }}>
                  {/* Small dot indicator if attended */}
                  {attended && (
                    <div style={{
                      position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
                      width: 5, height: 5, borderRadius: '50%', background: '#fff',
                    }} />
                  )}
                </div>
                <span style={{ fontSize: 10, color: isToday ? '#F0F0F0' : isFuture ? '#2a2a2a' : '#555', fontWeight: isToday ? 700 : 400 }}>
                  {dateNum}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Swipe hint — only on current week */}
      {weekOffset === 0 && (
        <p style={{ fontSize: 10, color: '#2a2a2a', textAlign: 'center', margin: 0 }}>← swipe for previous weeks</p>
      )}
    </div>
  );
}

// ── Row helper ────────────────────────────────────────────────────
function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span style={{ fontSize: 12, color: '#888' }}>{label}</span>
      <span style={{ fontSize: 13, color: '#F0F0F0', fontWeight: 500 }}>{value}</span>
    </div>
  );
}
