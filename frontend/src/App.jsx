import { useState, useRef } from 'react';
import Header from './components/Header';
import LoanForm from './components/LoanForm';
import ResultCard from './components/ResultCard';
import ScoreBreakdown from './components/ScoreBreakdown';
import ApplicationHistory from './components/ApplicationHistory';
import { evaluateLoan } from './utils/loanScoring';
import { submitApplication } from './api/loanApi';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);
  const [apiError, setApiError] = useState(null);
  const resultRef = useRef(null);

  async function handleSubmit(form) {
    setIsLoading(true);
    setResult(null);
    setCustomerData(null);
    setApiError(null);

    const data = {
      income: parseFloat(form.income),
      loanAmount: parseFloat(form.loanAmount),
      creditHistory: parseInt(form.creditHistory),
      expenses: parseFloat(form.expenses),
      assets: parseFloat(form.assets),
      hasLoans: form.hasLoans === 'true',
    };

    try {
      const apiResult = await submitApplication(form);

      const res = {
        score: apiResult.score,
        status: apiResult.approved ? 'Approved ✅' : 'Rejected ❌',
        approved: apiResult.approved,
      };

      setResult(res);
      setCustomerData(data);
      setCustomerName(form.name);
      setHistoryKey((prev) => prev + 1);
    } catch (err) {
      console.warn('API unavailable, falling back to local scoring:', err.message);
      setApiError('Backend unavailable — using local scoring engine');

      const res = evaluateLoan(data);
      setResult(res);
      setCustomerData(data);
      setCustomerName(form.name);

      const saved = JSON.parse(localStorage.getItem('loanApplications') || '[]');
      saved.push({
        name: form.name,
        score: res.score,
        approved: res.approved,
        status: res.status,
        date: new Date().toLocaleDateString('en-IN'),
        ...data,
      });
      localStorage.setItem('loanApplications', JSON.stringify(saved));
      setHistoryKey((prev) => prev + 1);
    } finally {
      setIsLoading(false);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  return (
    <div className="app">
      <Header />

      <main className="app-main">
        <section className="hero-section" id="hero">

          <h2 className="hero-title">
            Check Your Loan
            <span className="hero-gradient-text"> Eligibility</span>
          </h2>
          <p className="hero-description">
            Get instant approval decisions using our intelligent credit scoring algorithm.
            No credit check required — results in seconds.
          </p>
        </section>

        {apiError && (
          <div className="api-error-banner" id="api-error-banner">
            <span>⚠️</span>
            <span>{apiError}</span>
          </div>
        )}

        <section className="content-section" id="application-section">
          <LoanForm onSubmit={handleSubmit} isLoading={isLoading} />
        </section>

        {result && (
          <section className="result-section" ref={resultRef} id="result-section">
            <div className="result-grid">
              <ResultCard result={result} customerName={customerName} />
              <ScoreBreakdown customerData={customerData} />
            </div>
          </section>
        )}

        <section className="content-section" id="history-section">
          <ApplicationHistory key={historyKey} />
        </section>
      </main>

      <footer className="app-footer" id="app-footer">
        <div className="footer-inner">
          <p className="footer-text">
            CREDO — Intelligent Credit Scoring
          </p>
          <p className="footer-sub">
            © {new Date().getFullYear()} Greeshma · All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
