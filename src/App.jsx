import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Students from './pages/Students';
import StudentProfile from './pages/StudentProfile';
import Attendance from './pages/Attendance';
import Waivers from './pages/Waivers';
import SignWaiver from './pages/SignWaiver';
import Send from './pages/Send';
import Login from './pages/Login';

function CoachRoute({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-waiver" element={<SignWaiver />} />
          <Route path="/" element={<CoachRoute><Home /></CoachRoute>} />
          <Route path="/students" element={<CoachRoute><Students /></CoachRoute>} />
          <Route path="/students/:id" element={<CoachRoute><StudentProfile /></CoachRoute>} />
          <Route path="/attendance" element={<CoachRoute><Attendance /></CoachRoute>} />
          <Route path="/waivers" element={<CoachRoute><Waivers /></CoachRoute>} />
          <Route path="/send" element={<CoachRoute><Send /></CoachRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
