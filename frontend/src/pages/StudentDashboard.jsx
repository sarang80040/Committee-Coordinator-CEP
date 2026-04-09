import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentDashboard.css';
import ExpenseDetailModal from '../components/ExpenseDetailModal';

// --- Categories (Same) ---
const categories = [
  'Marketing & Printing', 'Technology & Hardware', 'Food & Refreshments',
  'Logistics & Travel', 'Guest & Speaker Fees', 'Other'
];

// --- Icons (TYPO FIXED) ---
const FundsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h21a.75.75 0 0 1 .75.75Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5v15m0 0a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 1.5 0v14.25a.75.75 0 0 1-.75.75Z" clipRule="evenodd" /></svg>;
const ExpensesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 1.5 0v14.25a.75.75 0 0 1-.75.75Z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" /></svg>;


function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('expense');
  
  const [expenses, setExpenses] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [funds, setFunds] = useState({ totalFunds: 0, totalExpenses: 0 });

  // --- Form States ---
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [receiptLink, setReceiptLink] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyOrigin, setCompanyOrigin] = useState('');
  const [sponsorDesc, setSponsorDesc] = useState('');
  const [documentLink, setDocumentLink] = useState('');
  const [amountPledged, setAmountPledged] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // <-- CHANGE 1: NEW STATE FOR USER

  const getToken = () => localStorage.getItem('token');
  const authConfig = { headers: { Authorization: `Bearer ${getToken()}` } };

  // --- API Call: Fetch All Data ---
  const fetchData = async () => {
    try {
      const { data: fundData } = await axios.get('http://localhost:5000/api/funds/my-committee', authConfig);
      setFunds(fundData);
      
      const { data: expenseData } = await axios.get('http://localhost:5000/api/transactions/my-transactions', authConfig);
      setExpenses(expenseData);
      
      const { data: sponsorData } = await axios.get('http://localhost:5000/api/sponsorships/my-sponsorships', authConfig);
      setSponsorships(sponsorData);

    } catch (err) { console.error('Error fetching data:', err); }
  };

  useEffect(() => {
    fetchData();
    // --- CHANGE 2: "PROPERLY" LOAD USER FROM LOCALSTORAGE ---
    const userFromStorage = JSON.parse(localStorage.getItem('user'));
    if (userFromStorage) {
      setCurrentUser(userFromStorage);
    }
  }, []);

  // --- Form Submit: Expense ---
  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const config = { headers: { 'Content-Type': 'application/json', ...authConfig.headers } };
      const expenseData = { title, amount, category, description, receiptLink };
      await axios.post('http://localhost:5000/api/transactions', expenseData, config);
      setLoading(false);
      setSuccess('Expense submitted successfully!');
      setTitle(''); setAmount(''); setDescription(''); setReceiptLink('');
      fetchData(); // Refresh all data
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Submission failed.');
    }
  };
  
  // --- Form Submit: Sponsorship ---
  const handleSubmitSponsorship = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const config = { headers: { 'Content-Type': 'application/json', ...authConfig.headers } };
      const sponsorData = { 
        companyName, companyOrigin, description: sponsorDesc, documentLink, 
        amountPledged, contactPerson, contactEmail 
      };
      await axios.post('http://localhost:5000/api/sponsorships', sponsorData, config);
      
      setLoading(false);
      setSuccess('Sponsorship logged successfully!');
      setCompanyName(''); setCompanyOrigin(''); setSponsorDesc(''); setDocumentLink('');
      setAmountPledged(''); setContactPerson(''); setContactEmail('');
      fetchData(); // Refresh all data
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Submission failed.');
    }
  };

  // --- Renders the correct history based on the active tab ---
  const renderHistory = () => {
    if (activeTab === 'expense') {
      return (
        <div className="card" style={{ marginTop: '2rem' }} data-aos="fade-up" data-aos-delay="300">
          <div className="card-header"><h2>My Expense History</h2></div>
          <div className="card-body">
            <div className="expense-list">
              {expenses.length === 0 ? (<p>You have not submitted any expenses yet.</p>) : (
                expenses.map((expense) => (
                  <div 
                    className="expense-item clickable" 
                    key={expense._id}
                    onClick={() => setSelectedExpense(expense)} 
                  >
                    <div className="expense-item-info">
                      <h4>{expense.title}</h4>
                      <p>₹{expense.amount.toLocaleString('en-IN')}</p>
                    </div>
                    <span className={`status-badge ${expense.status === 'approved' ? 'status-approved' : expense.status === 'pending' ? 'status-pending' : 'status-rejected'}`}>
                      {expense.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }
    if (activeTab === 'sponsorship') {
      return (
        <div className="card" style={{ marginTop: '2rem' }} data-aos="fade-up" data-aos-delay="300">
          <div className="card-header"><h2>My Sponsorship History</h2></div>
          <div className="card-body">
            <div className="expense-list">
              {sponsorships.length === 0 ? (<p>You have not logged any sponsorships yet.</p>) : (
                sponsorships.map((sponsor) => (
                  <div className="expense-item" key={sponsor._id}>
                    <div className="expense-item-info">
                      <h4>{sponsor.companyName}</h4>
                      <p>₹{sponsor.amountPledged.toLocaleString('en-IN')}</p>
                    </div>
                    <span className={`status-badge ${sponsor.status === 'confirmed' ? 'status-approved' : 'status-pending'}`}>
                      {sponsor.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-container">
      <div className="page-header" data-aos="fade-down">
        <h1>Student Dashboard</h1>
        <p>Welcome, Student Treasurer!</p>
      </div>

      {/* --- 1. "FUND TOTALS" STAT CARDS --- */}
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
      </div>

      {/* --- 2. "TABBED" INTERFACE --- */}
      <div className="card" data-aos="fade-up" data-aos-delay="200">
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'expense' ? 'active' : ''}`}
            onClick={() => setActiveTab('expense')}
          >
            Log Expense
          </button>
          <button 
            className={`tab-button ${activeTab === 'sponsorship' ? 'active' : ''}`}
            onClick={() => setActiveTab('sponsorship')}
          >
            Log Sponsorship
          </button>
          <button 
            className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
        </div>

        {/* --- TAB CONTENT --- */}
        <div className="tab-content">
          
          {/* --- Tab 1: Log Expense --- */}
          {activeTab === 'expense' && (
            <div className="form-container">
              <form onSubmit={handleSubmitExpense}>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Banners for Techfest" required />
                </div>
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="amount">Amount (in ₹)</label>
                    <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 1500" required />
                  </div>
                  <div className="form-group" style={{ flex: 2 }}>
                    <label htmlFor="category">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                      {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., 2 large flex banners from PrintShop." />
                </div>
                <div className="form-group">
                  <label htmlFor="receiptLink">Receipt / Proof Link</label>
                  <input type="text" id="receiptLink" value={receiptLink} onChange={(e) => setReceiptLink(e.target.value)} placeholder="Paste a Google Drive, Dropbox, or Imgur link" required />
                  <p className="form-hint">Please upload your receipt (image or PDF) to a service like Google Drive and paste the public link here.</p>
                </div>
                {success && <div className="form-success">{success}</div>}
                {error && <div className="form-error">{error}</div>}
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Expense'}
                </button>
              </form>
            </div>
          )}

          {/* --- Tab 2: Log Sponsorship (NEW FORM) --- */}
          {activeTab === 'sponsorship' && (
            <div className="form-container">
              <form onSubmit={handleSubmitSponsorship}>
                <div className="form-row">
                  <div className="form-group" style={{ flex: 2 }}>
                    <label htmlFor="companyName">Company Name</label>
                    <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g., Red Bull" required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="companyOrigin">Company Website/Origin</label>
                    <input type="text" id="companyOrigin" value={companyOrigin} onChange={(e) => setCompanyOrigin(e.target.value)} placeholder="e.g., redbull.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" value={sponsorDesc} onChange={(e) => setSponsorDesc(e.target.value)} placeholder="e.g., Sponsorship for 3 events, in-kind drinks" required />
                </div>
                <div className="form-group">
                  <label htmlFor="documentLink">Official Docs Link</label>
                  <input type="text" id="documentLink" value={documentLink} onChange={(e) => setDocumentLink(e.target.value)} placeholder="Paste Google Drive link to proposal/MOU" required />
                </div>
                <div className="form-group">
                  <label htmlFor="amountPledged">Amount Pledged (in ₹)</label>
                  <input type="number" id="amountPledged" value={amountPledged} onChange={(e) => setAmountPledged(e.target.value)} placeholder="e.g., 50000" required />
                </div>
                <hr style={{border: 0, borderTop: '1px solid var(--border-color)', margin: '1.5rem 0'}} />
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="contactPerson">Contact Person (Optional)</label>
                    <input type="text" id="contactPerson" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="e.g., Mr. Sharma" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="contactEmail">Contact Email (Optional)</label>
                    <input type="email" id="contactEmail" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="e.g., sharma@redbull.com" />
                  </div>
                </div>
                
                {success && <div className="form-success">{success}</div>}
                {error && <div className="form-error">{error}</div>}
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Submitting...' : 'Log Sponsorship'}
                </button>
              </form>
            </div>
          )}

          {/* --- Tab 3: Messages (Placeholder) --- */}
          {activeTab === 'messages' && (
            <div className="form-container">
              <h2>Messages</h2>
              <p>This will be the chat application with your faculty advisor.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- 3. "SUBMISSION HISTORY" (Dynamic) --- */}
      {renderHistory()}

      {/* --- CHANGE 3: "DYNAMICALLY" PASS THE USER PROP --- */}
      {selectedExpense && (
        <ExpenseDetailModal
          transaction={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          user={currentUser} 
        />
      )}
    </div>
  );
}

export default StudentDashboard;