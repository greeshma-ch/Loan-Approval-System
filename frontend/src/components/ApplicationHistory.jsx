import { useState, useEffect } from 'react';
import { getHistory, clearHistory as clearHistoryApi } from '../api/loanApi';
import './ApplicationHistory.css';

function ApplicationHistory() {
  const [applications, setApplications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setIsLoading(true);
    setError(null);
    try {
      // Try API first (MongoDB)
      const data = await getHistory();
      const formatted = data.map((app) => ({
        name: app.name,
        score: app.score,
        approved: app.approved,
        status: app.approved ? '✅ Approved' : '❌ Rejected',
        date: new Date(app.appliedAt).toLocaleDateString('en-IN'),
      }));
      setApplications(formatted);
    } catch {
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('loanApplications');
        if (saved) {
          setApplications(JSON.parse(saved));
        }
      } catch {
        setApplications([]);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleClear() {
    try {
      await clearHistoryApi();
    } catch {
      // Fallback: clear localStorage
      localStorage.removeItem('loanApplications');
    }
    setApplications([]);
  }

  if (applications.length === 0 && !isLoading) return null;

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
          {isLoading ? (
            <p style={{ textAlign: 'center', padding: '1rem', opacity: 0.6 }}>Loading history...</p>
          ) : (
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
                          {app.status || (app.approved ? '✅ Approved' : '❌ Rejected')}
                        </span>
                      </td>
                      <td className="cell-date">{app.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            className="history-clear-btn"
            onClick={handleClear}
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
