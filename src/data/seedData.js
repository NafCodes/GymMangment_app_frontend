const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();

// Stripe dates spread across the last 12 months: oldest stripe first
// MONTHS_AGO[i] = how many months ago stripe i was awarded
const STRIPE_MONTHS_AGO = [11, 7, 4, 1];

function makeStripes(count) {
  return Array.from({ length: 4 }, (_, i) => {
    if (i >= count) return { awarded: false, date: null };
    const d = new Date(TODAY.getFullYear(), TODAY.getMonth() - STRIPE_MONTHS_AGO[i], 15);
    return { awarded: true, date: d.toISOString().split('T')[0] };
  });
}

function randomAttendance(studentIds) {
  const records = {};
  for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
    const baseDate = new Date(TODAY.getFullYear(), TODAY.getMonth() - monthOffset, 1);
    const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), day);
      if (d > TODAY) break;
      const dow = d.getDay();
      if (dow === 1 || dow === 3 || dow === 5) {
        const key = d.toISOString().split('T')[0];
        records[key] = studentIds.filter(() => Math.random() > 0.3);
      }
    }
  }
  return records;
}

export const SEED_STUDENTS = [
  {
    id: 'stu-1',
    name: 'Marcus Rivera',
    email: 'marcus.rivera@dna.edu',
    belt: 'Purple',
    joinDate: '2022-08-15',
    stripes: makeStripes(3),
    waiver: { signed: true, dateSigned: `${CURRENT_YEAR}-01-10`, expires: `${CURRENT_YEAR + 1}-01-01` },
  },
  {
    id: 'stu-2',
    name: 'Jordan Lee',
    email: 'jordan.lee@dna.edu',
    belt: 'Blue',
    joinDate: '2023-01-20',
    stripes: makeStripes(2),
    waiver: { signed: true, dateSigned: `${CURRENT_YEAR}-03-05`, expires: `${CURRENT_YEAR + 1}-01-01` },
  },
  {
    id: 'stu-3',
    name: 'Sofia Nakamura',
    email: 'sofia.n@dna.edu',
    belt: 'Blue',
    joinDate: '2023-09-01',
    stripes: makeStripes(4),
    waiver: { signed: true, dateSigned: `${CURRENT_YEAR - 1}-11-20`, expires: `${CURRENT_YEAR}-01-01` },
  },
  {
    id: 'stu-4',
    name: 'Daniel Okafor',
    email: 'dokafor@dna.edu',
    belt: 'White',
    joinDate: '2024-02-10',
    stripes: makeStripes(0),
    waiver: { signed: false, dateSigned: null, expires: null },
  },
  {
    id: 'stu-5',
    name: 'Priya Mehta',
    email: 'priya.mehta@dna.edu',
    belt: 'White',
    joinDate: '2024-09-05',
    stripes: makeStripes(1),
    waiver: { signed: true, dateSigned: `${CURRENT_YEAR}-01-15`, expires: `${CURRENT_YEAR + 1}-01-01` },
  },
  {
    id: 'stu-6',
    name: 'Tyler Brooks',
    email: 'tyler.b@dna.edu',
    belt: 'Blue',
    joinDate: '2023-06-12',
    stripes: makeStripes(0),
    waiver: { signed: false, dateSigned: null, expires: null },
  },
  {
    id: 'stu-7',
    name: 'Amara Diallo',
    email: 'amara.d@dna.edu',
    belt: 'White',
    joinDate: '2025-01-08',
    stripes: makeStripes(2),
    waiver: { signed: true, dateSigned: `${CURRENT_YEAR}-01-09`, expires: `${CURRENT_YEAR}-06-15` }, // demo: expiring soon
  },
  {
    id: 'stu-8',
    name: 'Kevin Zhao',
    email: 'kevin.zhao@dna.edu',
    belt: 'Purple',
    joinDate: '2021-11-03',
    stripes: makeStripes(4),
    waiver: { signed: true, dateSigned: `${CURRENT_YEAR}-02-14`, expires: `${CURRENT_YEAR + 1}-01-01` },
  },
];

export const SEED_ATTENDANCE = randomAttendance(SEED_STUDENTS.map(s => s.id));

const DEFAULT_STRIPES = Array.from({ length: 4 }, () => ({ awarded: false, date: null }));

export function initializeStorage() {
  if (!localStorage.getItem('bjj_initialized')) {
    localStorage.setItem('bjj_students', JSON.stringify(SEED_STUDENTS));
    localStorage.setItem('bjj_attendance', JSON.stringify(SEED_ATTENDANCE));
    localStorage.setItem('bjj_waivers', JSON.stringify([]));
    localStorage.setItem('bjj_initialized', 'true');
  }
  // Non-destructive migration: add stripes to any student that's missing them
  migrateStripes();
}

function migrateStripes() {
  const students = JSON.parse(localStorage.getItem('bjj_students') || '[]');
  let changed = false;
  const migrated = students.map(s => {
    if (!s.stripes) {
      changed = true;
      return { ...s, stripes: DEFAULT_STRIPES };
    }
    return s;
  });
  if (changed) localStorage.setItem('bjj_students', JSON.stringify(migrated));
}

export function getStudents() {
  return JSON.parse(localStorage.getItem('bjj_students') || '[]');
}

export function saveStudents(students) {
  localStorage.setItem('bjj_students', JSON.stringify(students));
}

export function getAttendance() {
  return JSON.parse(localStorage.getItem('bjj_attendance') || '{}');
}

export function saveAttendance(attendance) {
  localStorage.setItem('bjj_attendance', JSON.stringify(attendance));
}

export function getWaivers() {
  return JSON.parse(localStorage.getItem('bjj_waivers') || '[]');
}

export function saveWaivers(waivers) {
  localStorage.setItem('bjj_waivers', JSON.stringify(waivers));
}

export function getWaiverStatus(student) {
  if (!student.waiver?.signed) return 'missing';
  const expires = new Date(student.waiver.expires);
  const now = new Date();
  if (expires <= now) return 'expired';
  const daysLeft = (expires - now) / (1000 * 60 * 60 * 24);
  if (daysLeft <= 30) return 'expiring';
  return 'valid';
}

export function getBeltColor(belt) {
  const map = {
    White: '#e5e5e5',
    Blue: '#3b82f6',
    Purple: '#a855f7',
    Brown: '#92400e',
    Black: '#1f2937',
  };
  return map[belt] || '#e5e5e5';
}

export const DEFAULT_STUDENT_STRIPES = DEFAULT_STRIPES;
