const BELTS = ['White', 'Blue', 'Purple', 'Brown', 'Black'];

export function beltToUI(level) {
  if (!level) return 'White';
  const lower = level.toLowerCase();
  return BELTS.find(b => b.toLowerCase() === lower) || level;
}

export function beltToAPI(belt) {
  return (belt || 'White').toLowerCase();
}

export function apiStudentToUI(apiStudent, stripeRows = []) {
  return {
    id: apiStudent.id,
    name: apiStudent.name,
    email: apiStudent.email,
    belt: beltToUI(apiStudent.belt_level),
    joinDate: apiStudent.join_date,
    stripes: apiStripesToUI(stripeRows),
    waiver: {
      signed: !!apiStudent.waiver_active,
      dateSigned: null,
      expires: null,
    },
  };
}

export function uiStudentToApi(form) {
  return {
    name: form.name,
    email: form.email,
    belt_level: beltToAPI(form.belt),
    join_date: form.joinDate,
  };
}

export function apiStripesToUI(stripeRows) {
  const stripes = Array.from({ length: 4 }, () => ({ awarded: false, date: null, apiId: null }));

  stripeRows.forEach(row => {
    const index = row.stripe_number - 1;
    if (index >= 0 && index < 4) {
      stripes[index] = {
        awarded: true,
        date: row.awarded_date,
        apiId: row.id,
      };
    }
  });

  return stripes;
}

export function apiAttendanceToMap(records) {
  const map = {};
  records.forEach(r => {
    const key = r.session_date;
    if (!map[key]) map[key] = [];
    map[key].push(r.student_id);
  });
  return map;
}

export function getWaiverStatusFromAPI(student) {
  return student.waiver?.signed ? 'valid' : 'missing';
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
