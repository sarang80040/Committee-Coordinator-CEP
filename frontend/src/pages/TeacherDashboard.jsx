import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeacherDashboard.css';
import ExpenseDetailModal from '../components/ExpenseDetailModal'; // <-- CHANGE 1: IMPORT

// --- Icons (TYPO FIXED) ---
const FundsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h21a.75.75 0 0 1 .75.75Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5v15m0 0a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 1.5 0v14.25a.75.75 0 0 1-.75.75Z" clipRule="evenodd" /></svg>;
const ExpensesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 1.5 0v14.25a.75.75 0 0 1-.75.75Z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" /></svg>; // <-- Typo was here (d=)
const SponsorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A1.875 1.875 0 0 1 18 22.5h-12a1.875 1.875 0 0 1-1.499-2.382Z" /></svg>;
const ChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;


function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  
  const [transactions, setTransactions] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [funds, setFunds] = useState({ totalFunds: 0, totalExpenses: 0 });
  
  const [expandedId, setExpandedId] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null); // <-- CHANGE 2: NEW STATE
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token');
  const authConfig = { headers: { Authorization: `Bearer ${getToken()}` } };

  // --- API Call: Fetch All Data ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: fundData } = await axios.get('http://localhost:5000/api/funds/my-committee', authConfig);
      setFunds(fundData);
      
      const { data: expenseData } = await axios.get('http://localhost:5000/api/transactions/committee', authConfig);
      setTransactions(expenseData);
      
      const { data: sponsorData } = await axios.get('http://localhost:5000/api/sponsorships/committee', authConfig);
      setSponsorships(sponsorData);

    } catch (err) { console.error('Error fetching data:', err); setError('Could not fetch data.'); }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- API Call: Update Expense Status ---
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json', ...authConfig.headers } };
      await axios.put(`http://localhost:5000/api/transactions/${id}/status`, { status: newStatus }, config);
      fetchData(); // Refresh ALL data
    } catch (err) { console.error('Error updating status:', err); }
  };
  
  // --- API Call: Update Sponsorship Status ---
  const handleUpdateSponsorshipStatus = async (id, newStatus) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json', ...authConfig.headers } };
      await axios.put(`http://localhost:5000/api/sponsorships/${id}/status`, { status: newStatus }, config);
      fetchData(); // Refresh ALL data
    } catch (err) { console.error('Error updating status:', err); }
  };

  // --- Helper lists to render ---
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const pendingSponsorships = sponsorships.filter(s => s.status === 'pending');
  const allOtherTransactions = transactions.filter(t => t.status !== 'pending');

  return (
    <div className="page-container">
      <div className="page-header" data-aos="fade-down">
        <h1>Faculty Dashboard</h1>
        <p>Welcome, Faculty Advisor!</p>
      </div>

      {/* --- STAT CARDS (Now with REAL data) --- */}
      <div className="stat-card-row" data-aos="fade-up">
        <div className="card stat-card">
          <div className="stat-icon green"><FundsIcon /></div>
          <div className="stat-info">
            <h3>Total Funds</h3>
            <p>₹{funds.totalFunds.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon red"><ExpensesIcon /></div>
          <div className="stat-info">
            <h3>Total Expenses</h3>
            <p>₹{funds.totalExpenses.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon blue"><SponsorIcon /></div>
          <div className="stat-info">
            <h3>Pending Sponsorships</h3>
            <p>{pendingSponsorships.length} Items</p>
          </div>
        </div>
      </div>

      {/* --- TABBED INTERFACE (UPDATED) --- */}
      <div className="card" data-aos="fade-up" data-aos-delay="200">
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Expense Queue ({pendingTransactions.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'sponsorships' ? 'active' : ''}`}
            onClick={() => setActiveTab('sponsorships')}
          >
            Sponsorship Queue ({pendingSponsorships.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Full Expense History
          </button>
        </div>

        {/* --- TAB CONTENT --- */}
        <div className="tab-content">
          
          {/* --- Tab 1: Expense Queue --- */}
          {activeTab === 'pending' && (
            <div className="transaction-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Receipt</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan="5">Loading...</td></tr>}
                  {!loading && pendingTransactions.length === 0 && (
                    <tr><td colSpan="5">No pending expenses.</td></tr>
                  )}
                  {!loading && pendingTransactions.map(t => (
                    <tr key={t._id}>
                      <td>{t.user.username}</td>
                      <td>{t.title}</td>
                      <td>₹{t.amount.toLocaleString('en-IN')}</td>
                      <td>
                        <a href={t.receiptLink} target="_blank" rel="noopener noreferrer">View Proof</a>
                      </td>
                      <td className="actions-cell">
                        <button className="btn-action btn-approve" onClick={() => handleUpdateStatus(t._id, 'approved')}>
                          Approve
                        </button>
                        <button className="btn-action btn-reject" onClick={() => handleUpdateStatus(t._id, 'rejected')}>
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* --- Tab 2: Sponsorship Queue --- */}
          {activeTab === 'sponsorships' && (
            <div className="queue-card-list">
              {loading && <p>Loading...</p>}
              {!loading && pendingSponsorships.length === 0 && (
                <p>No pending sponsorships.</p>
              )}
              {!loading && pendingSponsorships.map(s => (
                <div className="card queue-card" key={s._id}>
                  <div className="queue-card-main">
                    <div className="queue-card-info">
                      <h3>{s.companyName}</h3>
                      <p>
                        <span>Pledged:</span> ₹{s.amountPledged.toLocaleString('en-IN')}
                        <span style={{margin: '0 8px'}}>|</span>
                        <span>By:</span> {s.user.username}
                      </p>
                    </div>
                    <div className="queue-card-actions">
                      <button 
                        className="btn-action btn-expand"
                        onClick={() => setExpandedId(expandedId === s._id ? null : s._id)}
                      >
                        Details <ChevronDown />
                      </button>
                      <button 
                        className="btn-action btn-approve"
                        onClick={() => handleUpdateSponsorshipStatus(s._id, 'confirmed')}
                      >
                        Confirm Funds
                      </button>
                    </div>
                  </div>
                  
                  {expandedId === s._id && (
                    <div className="queue-card-details">
                      <strong>Description:</strong>
                      <p>{s.description || 'N/A'}</p>
                      <strong>Contact:</strong>
                      <p>{s.contactPerson} ({s.contactEmail || 'N/A'})</p>
                      <strong>Company Origin:</strong>
                      <p>{s.companyOrigin}</p>
                      <strong>Documents:</strong>
                      <p><a href={s.documentLink} target="_blank" rel="noopener noreferrer">View Official Docs</a></p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* --- Tab 3: Full History (NOW "DYNAMIC"!) --- */}
          {activeTab === 'history' && (
             <div className="transaction-table">
               <table>
                 <thead>
                   <tr>
                     <th>Student</th>
                     <th>Title</th>
                     <th>Amount</th>
                     <th>Status</th>
                     <th>Details</th> {/* <-- CHANGE 3: NEW COLUMN HEADER --> */}
                   </tr>
                 </thead>
                 <tbody>
                   {loading && <tr><td colSpan="5">Loading...</td></tr>}
                   {!loading && allOtherTransactions.length === 0 && (
                     <tr><td colSpan="5">No approved or rejected expenses.</td></tr>
                   )}
                   {!loading && allOtherTransactions.map(t => (
                     <tr key={t._id}>
                       <td>{t.user.username}</td>
                       <td>{t.title}</td>
                       <td>₹{t.amount.toLocaleString('en-IN')}</td>
                       <td>
                         <span className={`status-badge ${t.status === 'approved' ? 'status-approved' : 'status-rejected'}`}>
                           {t.status}
                         </span>
                       </td>
                       <td className="actions-cell"> {/* <-- CHANGE 3: NEW COLUMN DATA --> */}
                         <button 
                           className="btn-action btn-view" 
                           onClick={() => setSelectedTransaction(t)}
                         >
                           View
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          )}
        </div>
      </div>

      {/* --- CHANGE 4: RENDER THE MODAL "DYNAMICALLY" --- */}
      {selectedTransaction && (
        <ExpenseDetailModal 
          transaction={selectedTransaction} 
          onClose={() => setSelectedTransaction(null)} 
        />
      )}
    </div>
  );
}

export default TeacherDashboard;