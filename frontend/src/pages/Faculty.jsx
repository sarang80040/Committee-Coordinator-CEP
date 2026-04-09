import React from 'react';
// We don't need useEffect here, App.jsx handles AOS
import { mockFaculty, headOfStudentActivities } from '../mockData';
import './Faculty.css'; // We will replace this file

function Faculty() {
  const headAdvisor = headOfStudentActivities;

  return (
    <div className="page-container">
      <div className="page-header" data-aos="fade-down">
        <h1>Faculty Advisors</h1>
        <p>Official faculty managers for VJTI committees.</p>
      </div>

      {/* --- 1. "HEAD ADVISOR" - SEPARATE & PREMIUM --- */}
      <section className="head-advisor-section">
        <div 
          className="card faculty-card-head" 
          data-aos="fade-down" // Animation
        >
          <img src={headAdvisor.photo} alt={headAdvisor.name} />
          <div className="faculty-info-head">
            <h3>{headAdvisor.name}</h3>
            <p className="faculty-dept-head">{headAdvisor.department}</p>
          </div>
          <span className="faculty-committee-tag-head">
            {headAdvisor.committees[0]}
          </span>
        </div>
      </section>

      {/* --- 2. "COMMITTEE ADVISORS" GRID (FIXED) --- */}
      <section className="committee-advisor-grid">
        <h2 className="grid-header" data-aos="fade-up">
          Committee Advisors
        </h2>
        
        {/* We use the global .committee-grid-layout class */}
        <div className="committee-grid-layout">
          {mockFaculty.map((faculty, index) => (
            // This is the "perfected" vertical card
            <div 
              className="card faculty-card-vertical" 
              key={faculty.id}
              data-aos="fade-up" // Staggered animation
              data-aos-delay={index * 50} 
            >
              <div className="faculty-photo">
                <img src={faculty.photo} alt={faculty.name} />
              </div>
              <div className="faculty-info-vertical">
                <h3>{faculty.name}</h3>
                <p className="faculty-dept-vertical">{faculty.department}</p>
                <span className="faculty-committee-tag">
                  {faculty.committees[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Faculty;