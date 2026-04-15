import { useState, useEffect } from 'react';
import './ApplicationHistory.css';

function ApplicationHistory() {
  const [applications, setApplications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('loanApplications');
    if (saved) {
      try {
        setApplications(JSON.parse(saved));
      } catch {
        setApplications([]);
      }
    }
  }, []);

  if (applications.length === 0) return null;

  return (
    <div className="history-card" id="application-history">
      <button
        className="history-toggle"
        onClick={() => setIsOpen(!isOpen)}
        id="toggle-history-btn"
        aria-expanded={isOpen}
      >
        <div className="history-toggle-left">
          <span aria-hidden="true">📁</span>
          <span className="history-toggle-title">Application History</span>
          <span className="history-count">{applications.length}</span>
        </div>
        <span className={`history-chevron ${isOpen ? 'chevron-open' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="history-content">
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice().reverse().map((app, i) => (
                  <tr key={i} className="history-row" style={{ animationDelay: `${i * 0.05}s` }}>
                    <td className="cell-name">{app.name}</td>
                    <td>
                      <span className="cell-score">{app.score}</span>
                    </td>
                    <td>
                      <span className={`cell-status ${app.approved ? 'cell-approved' : 'cell-rejected'}`}>
                        {app.approved ? '✅ Approved' : '❌ Rejected'}
                      </span>
                    </td>
                    <td className="cell-date">{app.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="history-clear-btn"
            onClick={() => {
              localStorage.removeItem('loanApplications');
              setApplications([]);
            }}
            id="clear-history-btn"
          >
            🗑️ Clear History
          </button>
        </div>
      )}
    </div>
  );
}

export default ApplicationHistory;
