import React from 'react';
import { Link } from 'react-router-dom';
import { committees } from '../committees';
import { mockAnnouncements } from '../mockData';
import './Welcome.css';

const announcementsPreview = mockAnnouncements.slice(0, 3);

function Welcome() {
  return (
    <div className="welcome-container">

      {/* ── HERO ── */}
      <header className="welcome-hero">
        <div className="hero-content">
          <span className="hero-eyebrow">VJTI · Mumbai</span>
          <h1>Committee Coordinator</h1>
          <p>
            Track expenses, manage sponsorships, and keep your
            committee's finances in one place.
          </p>
          <a href="#committees" className="hero-cta">
            Select your committee
          </a>
        </div>
      </header>

      <div className="welcome-body">

        {/* ── ANNOUNCEMENTS ── */}
        <section className="announcements-section">
          <div className="announcements-head">
            <p className="section-label">Notice Board</p>
            <h2 className="section-heading">Announcements</h2>
            <p className="section-sub">Updates from the administration</p>
          </div>

          <div className="announcements-stack">
            {announcementsPreview.map((ann) => (
              <div className="announcement-row" key={ann.id}>
                <div className="ann-dot" />
                <div className="ann-body">
                  <h3>{ann.title}</h3>
                  <span className="ann-meta">{ann.date}</span>
                  <p>{ann.snippet}</p>
                </div>
              </div>
            ))}
          </div>

          <Link to="/announcements" className="view-all-link">
            View all announcements →
          </Link>
        </section>

        {/* ── COMMITTEE GRID ── */}
        <section className="committees-section" id="committees">
          <div className="committees-head">
            <p className="section-label">Committees</p>
            <h2 className="section-heading">Select your committee</h2>
            <p className="section-sub">Click a card to log in</p>
          </div>

          <div className="committee-grid">
            {committees.map((committee) => (
              <Link
                to={`/login/${committee.id}`}
                className="committee-card"
                key={committee.id}
              >
                <div className="committee-card-logo">
                  <img src={committee.logo} alt={committee.name} />
                </div>
                <div className="committee-card-name">
                  <h3>{committee.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default Welcome;
