const API_BASE = '/api/loan';

/**
 * Submit a loan application to the backend.
 * The backend forwards it to the C++ scoring engine and saves to MongoDB.
 */
export async function submitApplication(formData) {
  const response = await fetch(`${API_BASE}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name.trim(),
      age: parseInt(formData.age),
      income: parseFloat(formData.income),
      loanAmount: parseFloat(formData.loanAmount),
      creditHistory: parseInt(formData.creditHistory),
      hasLoans: formData.hasLoans === 'true' || formData.hasLoans === true,
      expenses: parseFloat(formData.expenses),
      assets: parseFloat(formData.assets),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.details
      ? (Array.isArray(data.details) ? data.details.join(', ') : data.details)
      : data.message || 'Failed to submit application';
    throw new Error(errorMsg);
  }

  return data.data;
}

/**
 * Fetch all loan application history from MongoDB.
 */
export async function getHistory() {
  const response = await fetch(`${API_BASE}/history`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch history');
  }

  return data.data;
}

/**
 * Clear all application history from MongoDB.
 */
export async function clearHistory() {
  const response = await fetch(`${API_BASE}/history`, {
    method: 'DELETE',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to clear history');
  }

  return data;
}
