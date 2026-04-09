import React from 'react';
import { Link } from 'react-router-dom';
import { committees } from '../committees';
import { mockAnnouncements } from '../mockData';
import './Welcome.css'; // We will replace this file

// Get just the top 3 announcements
const announcementsPreview = mockAnnouncements.slice(0, 3);

// --- A "Bullhorn" SVG Icon ---
const BullhornIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M21.75 12a.75.75 0 0 1-.75.75H13.81l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 1.06l-1.72 1.72h7.19a.75.75 0 0 1 .75.75Z" />
    <path fillRule="evenodd" d="M11.03 2.522a.75.75 0 0 1 .622.868l-1.04 4.162a.75.75 0 0 1-.622.868H9.36l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 0 1 1.06 1.06l-1.72 1.72h.63l1.04-4.162a.75.75 0 0 1 .868-.622Z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M10.125 15.75a.75.75 0 0 1 .75.75v5.04l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72v-5.04a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M15.47 11.03a.75.75 0 0 1 1.06-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H15a.75.75 0 0 1 0-1.5h2.19l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

function Welcome() {
  return (
    <div className="welcome-container-aesthetic">
      
      {/* --- 1. AESTHETIC HERO --- */}
      <header className="aesthetic-hero">
        <div 
          className="hero-text-panel" 
          data-aos="fade-right" // Animation
        >
          <h1>Committee Coordinator</h1>
          <p>
            A VJTI portal for financial transparency, expense tracking, 
            and unified committee management.
          </p>
          <a href="#committee-grid" className="btn btn-primary">
            Select Your Committee
          </a>
        </div>
      </header>

      {/* --- 2. ANNOUNCEMENTS SECTION --- */}
      <section 
        className="announcements-container"
        data-aos="fade-up" // Animation
      >
        <div className="announcements-header">
          <h2>Live Announcements</h2>
          <p>General updates from the college administration</p>
        </div>
        <div className="announcements-list">
          {announcementsPreview.map((announcement, index) => (
            <div 
              className="announcement-card" 
              key={announcement.id}
              data-aos="fade-up" // Staggered animation
              data-aos-delay={index * 100}
            >
              <div className="announcement-icon"><BullhornIcon /></div>
              <div className="announcement-content">
                <h3>{announcement.title}</h3>
                <span className="announcement-date">{announcement.date}</span>
                <p>{announcement.snippet}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-container">
          <Link to="/announcements" className="btn-view-all">
            View All Announcements &rarr;
          </Link>
        </div>
      </section>

      {/* --- 3. COMMITTEE GRID SECTION --- */}
      <section 
        className="committee-grid-section" 
        id="committee-grid"
        data-aos="fade-up" // Animation
      >
        <div className="committee-grid-header">
          <h2>Select Your Committee</h2>
          <p>Choose your committee to log in and access your dashboard.</p>
        </div>
        <div className="committee-grid">
          {committees.map((committee, index) => (
            <Link
              to={`/login/${committee.id}`}
              className="committee-card-aesthetic"
              key={committee.id}
              data-aos="fade-up" // Staggered animation
              data-aos-delay={index * 50}
            >
              <div className="card-aesthetic-logo">
                <img src={committee.logo} alt={committee.name} />
              </div>
              <div className="card-aesthetic-name">
                <h3>{committee.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Welcome;