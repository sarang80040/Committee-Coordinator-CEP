import React from 'react';
import { mockAnnouncements } from '../mockData'; 
import './Announcements.css'; 

function Announcements() {
  return (
    <div className="page-container">
      <div className="page-header" data-aos="fade-down">
        <h1>Announcements</h1>
        <p>All updates from the administration.</p>
      </div>

      <div className="full-announcements-list">
        {mockAnnouncements.map((announcement) => (
          <div
            className="card announcement-list-card"
            key={announcement.id}
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