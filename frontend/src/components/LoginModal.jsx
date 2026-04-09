import React, { useState } from 'react';
import './LoginModal.css';

// isOpen and onClose are passed in from Login.jsx
function LoginModal({ isOpen, onClose }) {
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in with:', { role, email, password });
    
    // --- THIS IS WHERE YOU WILL CALL YOUR BACKEND API ---
    // (We will build this later)
    
    onClose(); // Close the modal for now
  };

  // If the modal isn't supposed to be open, show nothing
  if (!isOpen) {
    return null;
  }

  return (
    // The dark background
    <div className="modal-overlay" onClick={onClose}>
      
      {/* The white modal box */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <h2>Member Login</h2>
        <p>Login as a Faculty Advisor or Student Treasurer.</p>

        <form onSubmit={handleLogin}>
          
          {/* --- ROLE SELECTOR (Student/Teacher) --- */}
          <div className="role-selector">
            <label className={role === 'student' ? 'active' : ''}>
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === 'student'}
                onChange={() => setRole('student')}
              />
              <span>Student Treasurer</span>
            </label>
            <label className={role === 'teacher' ? 'active' : ''}>
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={role === 'teacher'}
                onChange={() => setRole('teacher')}
              />
              <span>Faculty Advisor</span>
            </label>
          </div>

          {/* --- FORM FIELDS --- */}
          <div className="form-group">
            <label htmlFor="email">VJTI Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login
          </button>
        </form>

        {/* This matches your "no sign-up" requirement */}
        <p className="modal-footer">
          This is a private portal. Login credentials are provided
          by the college administration.
        </p>
      </div>
    </div>
  );
}

export default LoginModal;