import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../api';
import './Announcements.css';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/api/announcements`)
      .then(res => setAnnouncements(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header" data-aos="fade-down">
        <h1>Announcements</h1>
        <p>All updates from the administration.</p>
      </div>

      <div className="full-announcements-list">
        {loading && <p>Loading...</p>}
        {!loading && announcements.length === 0 && (
          <p style={{ color: 'var(--text-light)' }}>No announcements yet.</p>
        )}
        {!loading && announcements.map((ann) => (
          <div className="card announcement-list-card" key={ann._id}>
            <div className="announcement-content">
              <h3>{ann.title}</h3>
              <span className="announcement-date">
                {new Date(ann.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
                {ann.postedBy && (
                  <span className="ann-posted-by"> · {ann.postedBy.committee?.toUpperCase()}</span>
                )}
              </span>
              <p>{ann.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Announcements;
