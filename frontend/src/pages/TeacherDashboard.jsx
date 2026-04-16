import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../api';
import './TeacherDashboard.css';
import ExpenseDetailModal from '../components/ExpenseDetailModal';

const FundsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h21a.75.75 0 0 1 .75.75Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5v15m0 0a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 1.5 0v14.25a.75.75 0 0 1-.75.75Z" clipRule="evenodd" /></svg>;
const ExpensesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 1.5 0v14.25a.75.75 0 0 1-.75.75Z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" /></svg>;
const SponsorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A1.875 1.875 0 0 1 18 22.5h-12a1.875 1.875 0 0 1-1.499-2.382Z" /></svg>;
const ChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>;

function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('pending');

  const [transactions, setTransactions] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [funds, setFunds] = useState({ totalFunds: 0, totalExpenses: 0 });
  const [announcements, setAnnouncements] = useState([]);

  const [expandedId, setExpandedId] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Rejection reason modal state
  const [rejectTarget, setRejectTarget] = useState(null); // { id }
  const [rejectionReason, setRejectionReason] = useState('');

  // Announcement form state
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [annLoading, setAnnLoading] = useState(false);
  const [annSuccess, setAnnSuccess] = useState('');
  const [annError, setAnnError] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => localStorage.getItem('token');
  const authConfig = { headers: { Authorization: `Bearer ${getToken()}` } };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fundData, expenseData, sponsorData, annData] = await Promise.all([
        axios.get(`${API_BASE}/api/funds/my-committee`, authConfig),
        axios.get(`${API_BASE}/api/transactions/committee`, authConfig),
        axios.get(`${API_BASE}/api/sponsorships/committee`, authConfig),
        axios.get(`${API_BASE}/api/announcements`),
      ]);
      setFunds(fundData.data);
      setTransactions(expenseData.data);
      setSponsorships(sponsorData.data);
      setAnnouncements(annData.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Could not fetch data.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Approve expense directly
  const handleApprove = async (id) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json', ...authConfig.headers } };
      await axios.put(`${API_BASE}/api/transactions/${id}/status`, { status: 'approved' }, config);
      fetchData();
    } catch (err) { console.error(err); }
  };

  // Open rejection modal
  const openRejectModal = (id) => {
    setRejectTarget({ id });
    setRejectionReason('');
  };

  // Confirm rejection with reason
  const handleConfirmReject = async () => {
    if (!rejectTarget) return;
    try {
      const config = { headers: { 'Content-Type': 'application/json', ...authConfig.headers } };
      await axios.put(
        `${API_BASE}/api/transactions/${rejectTarget.id}/status`,
        { status: 'rejected', rejectionReason },
        config
      );
      setRejectTarget(null);
      setRejectionReason('');
      fetchData();
    } catch (err) { console.error(err); }
  };

  // Sponsorship status update
  const handleUpdateSponsorshipStatus = async (id, newStatus) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json', ...authConfig.headers } };
      await axios.put(`${API_BASE}/api/sponsorships/${id}/status`, { status: newStatus }, config);
      fetchData();
    } catch (err) { console.error(err); }
  };

  // Post announcement
  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    setAnnLoading(true); setAnnSuccess(''); setAnnError('');
    try {
      const config = { headers: { 'Content-Type': 'application/json', ...authConfig.headers } };
      await axios.post(`${API_BASE}/api/announcements`, { title: annTitle, body: annBody }, config);
      setAnnTitle(''); setAnnBody('');
      setAnnSuccess('Announcement posted successfully!');
      fetchData();
    } catch (err) {
      setAnnError(err.response?.data?.message || 'Failed to post.');
    }
    setAnnLoading(false);
  };

  // Delete announcement
  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await axios.delete(`${API_BASE}/api/announcements/${id}`, authConfig);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const pendingSponsorships = sponsorships.filter(s => s.status === 'pending');
  const allOtherTransactions = transactions.filter(t => t.status !== 'pending');

  // Only show announcements posted by this teacher's committee
  const myAnnouncements = announcements.filter(
    a => a.postedBy?.committee === (JSON.parse(localStorage.getItem('user'))?.committee)
  );

  return (
    <div className="page-container">
      <div className="page-header" data-aos="fade-down">
        <h1>Faculty Dashboard</h1>
        <p>Review and approve committee submissions.</p>
      </div>

      {/* STAT CARDS */}
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

      {/* TABS */}
      <div className="card" data-aos="fade-up" data-aos-delay="200">
        <div className="dashboard-tabs">
          <button className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
            Expense Queue ({pendingTransactions.length})
          </button>
          <button className={`tab-button ${activeTab === 'sponsorships' ? 'active' : ''}`} onClick={() => setActiveTab('sponsorships')}>
            Sponsorship Queue ({pendingSponsorships.length})
          </button>
          <button className={`tab-button ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            Full Expense History
          </button>
          <button className={`tab-button ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}>
            Announcements
          </button>
        </div>

        <div className="tab-content">

          {/* Tab 1: Expense Queue */}
          {activeTab === 'pending' && (
            <div className="transaction-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th><th>Title</th><th>Amount</th><th>Receipt</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan="5">Loading...</td></tr>}
                  {!loading && pendingTransactions.length === 0 && <tr><td colSpan="5">No pending expenses.</td></tr>}
                  {!loading && pendingTransactions.map(t => (
                    <tr key={t._id}>
                      <td>{t.user.username}</td>
                      <td>{t.title}</td>
                      <td>₹{t.amount.toLocaleString('en-IN')}</td>
                      <td><a href={t.receiptLink} target="_blank" rel="noopener noreferrer">View Proof</a></td>
                      <td className="actions-cell">
                        <button className="btn-action btn-approve" onClick={() => handleApprove(t._id)}>Approve</button>
                        <button className="btn-action btn-reject" onClick={() => openRejectModal(t._id)}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Sponsorship Queue */}
          {activeTab === 'sponsorships' && (
            <div className="queue-card-list">
              {loading && <p>Loading...</p>}
              {!loading && pendingSponsorships.length === 0 && <p>No pending sponsorships.</p>}
              {!loading && pendingSponsorships.map(s => (
                <div className="card queue-card" key={s._id}>
                  <div className="queue-card-main">
                    <div className="queue-card-info">
                      <h3>{s.companyName}</h3>
                      <p>
                        <span>Pledged:</span> ₹{s.amountPledged.toLocaleString('en-IN')}
                        <span style={{ margin: '0 8px' }}>|</span>
                        <span>By:</span> {s.user.username}
                      </p>
                    </div>
                    <div className="queue-card-actions">
                      <button className="btn-action btn-expand" onClick={() => setExpandedId(expandedId === s._id ? null : s._id)}>
                        Details <ChevronDown />
                      </button>
                      <button className="btn-action btn-approve" onClick={() => handleUpdateSponsorshipStatus(s._id, 'confirmed')}>
                        Confirm Funds
                      </button>
                    </div>
                  </div>
                  {expandedId === s._id && (
                    <div className="queue-card-details">
                      <strong>Description:</strong><p>{s.description || 'N/A'}</p>
                      <strong>Contact:</strong><p>{s.contactPerson} ({s.contactEmail || 'N/A'})</p>
                      <strong>Company Origin:</strong><p>{s.companyOrigin}</p>
                      <strong>Documents:</strong>
                      <p><a href={s.documentLink} target="_blank" rel="noopener noreferrer">View Official Docs</a></p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Full History */}
          {activeTab === 'history' && (
            <div className="transaction-table">
              <table>
                <thead>
                  <tr><th>Student</th><th>Title</th><th>Amount</th><th>Status</th><th>Details</th></tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan="5">Loading...</td></tr>}
                  {!loading && allOtherTransactions.length === 0 && <tr><td colSpan="5">No approved or rejected expenses.</td></tr>}
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
                      <td>
                        <button className="btn-action btn-view" onClick={() => setSelectedTransaction(t)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 4: Announcements */}
          {activeTab === 'announcements' && (
            <div className="announcements-tab">
              <div className="ann-form-section">
                <h3>Post a New Announcement</h3>
                <p className="ann-form-sub">This will appear on the public Announcements page.</p>
                <form onSubmit={handlePostAnnouncement} className="ann-form">
                  <div className="form-group">
                    <label htmlFor="annTitle">Title</label>
                    <input
                      type="text" id="annTitle"
                      value={annTitle} onChange={e => setAnnTitle(e.target.value)}
                      placeholder="e.g., Q4 Budget Deadline Extended"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="annBody">Body</label>
                    <textarea
                      id="annBody"
                      value={annBody} onChange={e => setAnnBody(e.target.value)}
                      placeholder="Write the full announcement here..."
                      required
                    />
                  </div>
                  {annSuccess && <div className="form-success">{annSuccess}</div>}
                  {annError && <div className="form-error">{annError}</div>}
                  <button type="submit" className="btn btn-primary" disabled={annLoading}>
                    {annLoading ? 'Posting...' : 'Post Announcement'}
                  </button>
                </form>
              </div>

              <div className="ann-list-section">
                <h3>Your Posted Announcements</h3>
                {myAnnouncements.length === 0 && <p className="ann-empty">You haven't posted any announcements yet.</p>}
                {myAnnouncements.map(a => (
                  <div className="ann-posted-card" key={a._id}>
                    <div className="ann-posted-info">
                      <h4>{a.title}</h4>
                      <span className="ann-posted-date">
                        {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <p>{a.body}</p>
                    </div>
                    <button className="btn-delete-ann" onClick={() => handleDeleteAnnouncement(a._id)} title="Delete">
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expense Detail Modal */}
      {selectedTransaction && (
        <ExpenseDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}

      {/* Rejection Reason Modal */}
      {rejectTarget && (
        <div className="modal-backdrop" onClick={() => setRejectTarget(null)}>
          <div className="reject-modal" onClick={e => e.stopPropagation()}>
            <h2>Reason for Rejection</h2>
            <p>This will be visible to the student.</p>
            <div className="form-group">
              <label htmlFor="rejectionReason">Reason</label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="e.g., Receipt is unclear, amount exceeds budget limit..."
                rows={4}
              />
            </div>
            <div className="reject-modal-actions">
              <button className="btn btn-secondary" onClick={() => setRejectTarget(null)}>Cancel</button>
              <button className="btn btn-reject-confirm" onClick={handleConfirmReject}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
