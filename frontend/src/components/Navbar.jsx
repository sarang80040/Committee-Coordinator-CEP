import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Import NavLink
import './Navbar.css';

function Navbar() {
  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        
        {/* The main Logo/Brand link */}
        <Link to="/" className="navbar-brand">
          Committee Coordinator
        </Link>

        {/* The new navigation links */}
        <div className="navbar-links">
          {/* We use NavLink so it can have an "active" style */}
          <NavLink 
            to="/announcements" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            All Announcements
          </NavLink>
          <NavLink 
            to="/faculty" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Faculty Advisors
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;