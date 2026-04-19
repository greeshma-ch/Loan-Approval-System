/**
 * Calculate credit score based on customer financial data
 * Mirrors the C++ calculateScore(Customer& c) function exactly
 * @param {Object} c - Customer data object
 * @returns {number} - Computed credit score (0-100)
 */
export function calculateScore(c) {
  let score = 0;

  // Income-based score (max 25)
  if (c.income >= 50000) score += 25;
  else if (c.income >= 30000) score += 15;
  else score += 5;

  // Credit history score (max 20)
  if (c.creditHistory >= 5) score += 20;
  else if (c.creditHistory >= 2) score += 10;

  // Loan to income ratio (max 20)
  const ratio = c.loanAmount / c.income;
  if (ratio < 0.2) score += 20;
  else if (ratio < 0.5) score += 10;

  // Existing loan status (max 15)
  score += c.hasLoans ? 0 : 15;

  // Asset score (max 10)
  if (c.assets >= 50000) score += 10;

  // Monthly expense score (max 10)
  if (c.expenses < 2000) score += 10;
  else if (c.expenses < 4000) score += 5;

  return score;
}

/**
 * Evaluate loan approval based on calculated score
 * Mirrors the C++ evaluateCustomer() function
 * @param {Object} c - Customer data object
 * @returns {Object} - { score, status, approved }
 */
export function evaluateLoan(c) {
  const score = calculateScore(c);
  const approved = score >= 70;
  const status = approved ? "Approved ✅" : "Rejected ❌";
  return { score, status, approved };
}

/**
 * Generate a human-readable explanation of the loan decision
 * @param {number} score - The calculated credit score
 * @returns {string} - Explanation text
 */
export function getExplanation(score) {
  if (score >= 70) {
    return "Strong financial profile with good repayment capacity. Your income-to-loan ratio, credit history, and asset base demonstrate solid financial health.";
  } else if (score >= 50) {
    return "Moderate financial profile. Consider reducing existing debts, increasing credit history, or lowering the requested loan amount to improve eligibility.";
  } else {
    return "Financial risk detected due to income, expenses, or loan ratio. We recommend building credit history and improving your debt-to-income ratio.";
  }
}

/**
 * Get a detailed breakdown of the scoring factors
 * @param {Object} c - Customer data
 * @returns {Array} - Array of { label, points, maxPoints, tip }
 */
export function getScoreBreakdown(c) {
  const breakdown = [];

  // Income
  let incomePoints = 0;
  if (c.income >= 50000) incomePoints = 25;
  else if (c.income >= 30000) incomePoints = 15;
  else incomePoints = 5;
  breakdown.push({
    label: "Annual Income",
    points: incomePoints,
    maxPoints: 25,
    tip: c.income < 50000 ? "Income ≥ ₹50,000 earns max points" : "Maximum points earned!",
  });

  // Credit history
  let creditPoints = 0;
  if (c.creditHistory >= 5) creditPoints = 20;
  else if (c.creditHistory >= 2) creditPoints = 10;
  breakdown.push({
    label: "Credit History",
    points: creditPoints,
    maxPoints: 20,
    tip: c.creditHistory < 5 ? "5+ years of credit history earns max points" : "Maximum points earned!",
  });

  // Loan-to-income ratio
  const ratio = c.loanAmount / c.income;
  let ratioPoints = 0;
  if (ratio < 0.2) ratioPoints = 20;
  else if (ratio < 0.5) ratioPoints = 10;
  breakdown.push({
    label: "Loan-to-Income Ratio",
    points: ratioPoints,
    maxPoints: 20,
    tip: ratio >= 0.5 ? "Keep loan amount below 50% of income" : ratio >= 0.2 ? "Loan below 20% of income earns max" : "Maximum points earned!",
  });

  // Existing loans
  const loanPoints = c.hasLoans ? 0 : 15;
  breakdown.push({
    label: "No Existing Loans",
    points: loanPoints,
    maxPoints: 15,
    tip: c.hasLoans ? "Clear existing loans to earn 15 points" : "Maximum points earned!",
  });

  // Assets
  const assetPoints = c.assets >= 50000 ? 10 : 0;
  breakdown.push({
    label: "Asset Value",
    points: assetPoints,
    maxPoints: 10,
    tip: c.assets < 50000 ? "Assets ≥ ₹50,000 earns 10 points" : "Maximum points earned!",
  });

  // Expenses
  let expensePoints = 0;
  if (c.expenses < 2000) expensePoints = 10;
  else if (c.expenses < 4000) expensePoints = 5;
  breakdown.push({
    label: "Monthly Expenses",
    points: expensePoints,
    maxPoints: 10,
    tip: c.expenses >= 4000 ? "Keep expenses below ₹4,000 for points" : c.expenses >= 2000 ? "Expenses below ₹2,000 earns max" : "Maximum points earned!",
  });

  return breakdown;
}
