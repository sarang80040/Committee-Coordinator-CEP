import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import CommitteeLogin from './pages/CommitteeLogin';
import Announcements from './pages/Announcements';
import Faculty from './pages/Faculty';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import './App.css'; 

function App() {
  
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: 'ease-in-out-quad',
      offset: 50,
    });
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login/:committeeId" element={<CommitteeLogin />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;