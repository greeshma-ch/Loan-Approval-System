import { useEffect, useState } from 'react';
import { getExplanation } from '../utils/loanScoring';
import './ResultCard.css';

function ResultCard({ result, customerName }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Animate score counter from 0 → actual score
    let current = 0;
    const target = result.score;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        // Reveal details after score animation completes
        setTimeout(() => setShowDetails(true), 300);
      }
      setAnimatedScore(current);
    }, 30);

    return () => clearInterval(timer);
  }, [result.score]);

  const scorePercent = (result.score / 100) * 100;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

  return (
    <div className={`result-card ${result.approved ? 'result-approved' : 'result-rejected'}`} id="result-card">
      {/* Status Banner */}
      <div className={`result-banner ${result.approved ? 'banner-approved' : 'banner-rejected'}`}>
        <span className="banner-icon">{result.approved ? '🎉' : '⚠️'}</span>
        <span className="banner-text">
          {result.approved ? 'Congratulations!' : 'Application Not Approved'}
        </span>
      </div>

      <div className="result-body">
        {/* Score Circle */}
        <div className="score-section">
          <div className="score-ring-container">
            <svg className="score-ring" viewBox="0 0 120 120" aria-label={`Credit score: ${result.score} out of 100`}>
              {/* Background ring */}
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="8"
              />
              {/* Score ring */}
              <circle
                className="score-ring-progress"
                cx="60" cy="60" r="54"
                fill="none"
                stroke={result.approved ? 'url(#successGrad)' : 'url(#dangerGrad)'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 60 60)"
              />
              <defs>
                <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="dangerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
              </defs>
            </svg>
            <div className="score-value">
              <span className="score-number">{animatedScore}</span>
              <span className="score-max">/ 100</span>
            </div>
          </div>
          <p className="score-label">Credit Score</p>
        </div>

        {/* Details */}
        <div className={`result-details ${showDetails ? 'details-visible' : ''}`}>
          <div className="detail-row">
            <span className="detail-label">Applicant</span>
            <span className="detail-value">{customerName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className={`detail-status ${result.approved ? 'status-approved' : 'status-rejected'}`}>
              {result.status}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Threshold</span>
            <span className="detail-value">70 / 100</span>
          </div>

          {/* Explanation */}
          <div className="explanation-card">
            <div className="explanation-header">
              <span aria-hidden="true">💬</span>
              <span>Analysis</span>
            </div>
            <p className="explanation-text">{getExplanation(result.score)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
