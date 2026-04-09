import React, { useEffect } from 'react';
import './ExpenseDetailModal.css';

// --- Icons (Same as your project) ---
const CategoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A1.875 1.875 0 0 1 18 22.5h-12a1.875 1.875 0 0 1-1.499-2.382Z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>;

// --- CHANGE 1: "PROPERLY" ACCEPT THE 'user' PROP ---
function ExpenseDetailModal({ transaction, onClose, user }) {

  // This "properly" handles closing the modal when clicking outside of it
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  // This "dynamic" effect handles closing with the 'Escape' key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!transaction) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} data-aos="fade">
      <div className="modal-content" data-aos="fade-up" data-aos-delay="100">
        <div className="modal-header">
          <h2>{transaction.title}</h2>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="modal-top-info">
            <span className={`status-badge ${transaction.status === 'approved' ? 'status-approved' : transaction.status === 'pending' ? 'status-pending' : 'status-rejected'}`}>
              {transaction.status}
            </span>
            <div className="modal-amount">
              ₹{transaction.amount.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="modal-detail-grid">
            <div className="modal-detail-item">
              <UserIcon />
              {/* --- CHANGE 2: "DYNAMIC" LOGIC TO FIND USERNAME --- */}
              <span><strong>Submitted by:</strong> {
                transaction.user ? transaction.user.username : (user ? user.username : '...loading')
              }</span>
            </div>
            <div className="modal-detail-item">
              <CategoryIcon />
              <span><strong>Category:</strong> {transaction.category}</span>
            </div>
            <div className="modal-detail-item">
              <CalendarIcon />
              <span><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleDateString('en-GB')}</span>
            </div>
          </div>

          <div className="modal-description">
            <strong>Description:</strong>
            <p>{transaction.description || 'No description provided.'}</p>
          </div>
        </div>

        <div className="modal-footer">
          <a href={transaction.receiptLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            View Receipt / Proof
          </a>
        </div>
      </div>
    </div>
  );
}

export default ExpenseDetailModal;