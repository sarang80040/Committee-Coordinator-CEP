import React from 'react';
import { mockAnnouncements } from '../mockData'; 
import './Announcements.css'; 

function Announcements() {
  return (
    <div className="page-container">
      <div className="page-header" data-aos="fade-down">
        <h1>All Announcements</h1>
        <p>A complete archive of all official communication.</p>
      </div>

      <div className="full-announcements-list">
        {mockAnnouncements.map((announcement, index) => (
          // We use the global .card and add animations
          <div 
            className="card announcement-list-card" 
            key={announcement.id}
            data-aos="fade-up"
            data-aos-delay={index * 50}
          >
            <div className="announcement-content">
              <h3>{announcement.title}</h3>
              <span className="announcement-date">{announcement.date}</span>
              <p>{announcement.snippet}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Announcements;