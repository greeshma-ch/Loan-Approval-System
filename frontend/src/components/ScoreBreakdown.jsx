import { getScoreBreakdown } from '../utils/loanScoring';
import './ScoreBreakdown.css';

function ScoreBreakdown({ customerData }) {
  const breakdown = getScoreBreakdown(customerData);
  const totalScore = breakdown.reduce((sum, b) => sum + b.points, 0);
  const maxTotal = breakdown.reduce((sum, b) => sum + b.maxPoints, 0);

  return (
    <div className="breakdown-card" id="score-breakdown">
      <div className="breakdown-header">
        <h3 className="breakdown-title">
          <span aria-hidden="true">📊</span> Score Breakdown
        </h3>
        <span className="breakdown-total">
          {totalScore} / {maxTotal}
        </span>
      </div>

      <div className="breakdown-list">
        {breakdown.map((item, index) => {
          const percent = (item.points / item.maxPoints) * 100;
          const isMax = item.points === item.maxPoints;

          return (
            <div
              className="breakdown-item"
              key={item.label}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="breakdown-item-header">
                <span className="breakdown-item-label">{item.label}</span>
                <span className={`breakdown-item-score ${isMax ? 'score-max-reached' : ''}`}>
                  {item.points} / {item.maxPoints}
                </span>
              </div>

              <div className="breakdown-bar-track">
                <div
                  className={`breakdown-bar-fill ${isMax ? 'bar-max' : percent > 0 ? 'bar-partial' : 'bar-zero'}`}
                  style={{ width: `${percent}%`, animationDelay: `${index * 0.08 + 0.3}s` }}
                ></div>
              </div>

              <p className={`breakdown-tip ${isMax ? 'tip-success' : 'tip-warn'}`}>
                {isMax ? '✓' : '↗'} {item.tip}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ScoreBreakdown;
