import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { initializeStorage } from './data/seedData';
import Home from './pages/Home';
import Students from './pages/Students';
import StudentProfile from './pages/StudentProfile';
import Attendance from './pages/Attendance';
import Waivers from './pages/Waivers';
import SignWaiver from './pages/SignWaiver';
import Send from './pages/Send';

export default function App() {
  useEffect(() => { initializeStorage(); }, []);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/sign-waiver" element={<SignWaiver />} />
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/waivers" element={<Waivers />} />
          <Route path="/send" element={<Send />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
