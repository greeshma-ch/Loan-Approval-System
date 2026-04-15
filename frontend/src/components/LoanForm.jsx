import { useState } from 'react';
import './LoanForm.css';

const FIELD_CONFIG = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Greeshma', icon: '👤', required: true },
  { name: 'income', label: 'Annual Income (₹)', type: 'number', placeholder: 'e.g. 60000', icon: '💰', required: true, min: 0 },
  { name: 'loanAmount', label: 'Loan Amount (₹)', type: 'number', placeholder: 'e.g. 10000', icon: '🏦', required: true, min: 0 },
  { name: 'creditHistory', label: 'Credit History (Years)', type: 'number', placeholder: 'e.g. 6', icon: '📅', required: true, min: 0 },
  { name: 'expenses', label: 'Monthly Expenses (₹)', type: 'number', placeholder: 'e.g. 1500', icon: '🧾', required: true, min: 0 },
  { name: 'assets', label: 'Total Assets Value (₹)', type: 'number', placeholder: 'e.g. 75000', icon: '🏠', required: true, min: 0 },
];

function LoanForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState({
    name: '',
    income: '',
    loanAmount: '',
    creditHistory: '',
    expenses: '',
    assets: '',
    hasLoans: 'false',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function handleBlur(e) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.income || parseFloat(form.income) <= 0) newErrors.income = 'Enter valid income';
    if (!form.loanAmount || parseFloat(form.loanAmount) <= 0) newErrors.loanAmount = 'Enter valid loan amount';
    if (!form.creditHistory || parseInt(form.creditHistory) < 0) newErrors.creditHistory = 'Enter valid history';
    if (!form.expenses || parseFloat(form.expenses) < 0) newErrors.expenses = 'Enter valid expenses';
    if (!form.assets || parseFloat(form.assets) < 0) newErrors.assets = 'Enter valid asset value';
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched(
        Object.fromEntries(FIELD_CONFIG.map((f) => [f.name, true]))
      );
      return;
    }
    onSubmit(form);
  }

  function handleReset() {
    setForm({
      name: '',
      income: '',
      loanAmount: '',
      creditHistory: '',
      expenses: '',
      assets: '',
      hasLoans: 'false',
    });
    setErrors({});
    setTouched({});
  }

  return (
    <form className="loan-form" onSubmit={handleSubmit} id="loan-form" noValidate>
      <div className="form-header">
        <h2 className="form-title">Loan Application</h2>
        <p className="form-description">Fill in your financial details to check eligibility</p>
      </div>

      <div className="form-grid">
        {FIELD_CONFIG.map((field) => (
          <div
            className={`form-group ${errors[field.name] && touched[field.name] ? 'has-error' : ''}`}
            key={field.name}
          >
            <label className="form-label" htmlFor={`field-${field.name}`}>
              <span className="label-icon" aria-hidden="true">{field.icon}</span>
              {field.label}
            </label>
            <input
              id={`field-${field.name}`}
              className="form-input"
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              min={field.min}
              required={field.required}
              autoComplete="off"
            />
            {errors[field.name] && touched[field.name] && (
              <span className="form-error">{errors[field.name]}</span>
            )}
          </div>
        ))}

        {/* Existing Loans Dropdown */}
        <div className="form-group">
          <label className="form-label" htmlFor="field-hasLoans">
            <span className="label-icon" aria-hidden="true">📋</span>
            Existing Loans
          </label>
          <select
            id="field-hasLoans"
            className="form-input form-select"
            name="hasLoans"
            value={form.hasLoans}
            onChange={handleChange}
          >
            <option value="false">No — I have no existing loans</option>
            <option value="true">Yes — I have existing loans</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          id="check-eligibility-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="btn-loading">
              <span className="spinner" aria-hidden="true"></span>
              Analyzing...
            </span>
          ) : (
            <>
              <span aria-hidden="true">🔍</span>
              Check Eligibility
            </>
          )}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleReset}
          id="reset-form-btn"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export default LoanForm;
