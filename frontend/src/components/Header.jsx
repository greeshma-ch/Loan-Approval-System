import './Header.css';

function Header() {
  return (
    <header className="header" id="app-header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="url(#logoGrad)" />
              <text x="18" y="24.5" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="900" fontSize="22" fill="#fff" letterSpacing="-1">C</text>
              <circle cx="27" cy="10" r="4" fill="#34d399" />
              <path d="M25.2 10l1.2 1.2 2.4-2.4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="header-title">CREDO</h1>
            <p className="header-subtitle">Smart Loan Approval Engine</p>
          </div>
        </div>
        <div className="header-badge">
          <span className="badge-dot" aria-hidden="true"></span>
          <span>System Online</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
