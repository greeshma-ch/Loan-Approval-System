const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/loan` 
  : '/api/loan';

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

export async function getHistory() {
  const response = await fetch(`${API_BASE}/history`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch history');
  }

  return data.data;
}

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
