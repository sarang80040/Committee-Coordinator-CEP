import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { committees } from '../committees';
import './CommitteeLogin.css';
import axios from 'axios';

function CommitteeLogin() {
  const [role, setRole] = useState('student');
  // --- We now use 'username' state instead of 'email' ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentCommittee, setCurrentCommittee] = useState(null);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { committeeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const committee = committees.find(c => c.id === committeeId);
    if (committee) {
      setCurrentCommittee(committee);
    } else {
      navigate('/');
    }
  }, [committeeId, navigate]);

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // --- We now send 'username' in the API call ---
      const loginData = {
        username,
        password,
        role,
      };
      
      const response = await axios.post(
        'http://localhost:5000/api/auth/login', 
        loginData
      );

      // --- LOGIN SUCCESS (No change here) ---
      setLoading(false);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      
      if (user.role === 'student') {
        navigate('/student-dashboard');
      } else if (user.role === 'teacher') {
        navigate('/teacher-dashboard');
      }

    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
    }
  };

  if (!currentCommittee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="login-page-fullscreen-wrapper">
      <div className="parallax-grid-bg" />

      <div className="card login-card-layout">
        
        <div className="login-identity-panel">
          <img 
            src={currentCommittee.logo} 
            alt={currentCommittee.name} 
            className="committee-login-logo" 
          />
          <h2>{currentCommittee.name}</h2>
          <p>Faculty & Treasurer Login</p>
        </div>

        <div className="login-form-panel">
          <form onSubmit={handleLogin}>
            <div className="role-selector">
              <label className={role === 'student' ? 'active' : ''}>
                <input
                  type="radio" name="role" value="student"
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                />
                <span>Student Treasurer</span>
              </label>
              <label className={role === 'teacher' ? 'active' : ''}>
                <input
                  type="radio" name="role" value="teacher"
                  checked={role === 'teacher'}
                  onChange={() => setRole('teacher')}
                />
                <span>Faculty Advisor</span>
              </label>
            </div>

            {/* --- THIS FORM GROUP IS NOW FOR 'username' --- */}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            
            {error && (
              <div className="login-error-message">
                {error}
              </div>
            )}
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="login-footer">
            Credentials are provided by college administration.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CommitteeLogin;