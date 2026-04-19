const express = require('express');
const router = express.Router();
const LoanApplication = require('../models/LoanApplication');
const { runScoringEngine } = require('../utils/cppEngine');

router.post('/apply', async (req, res) => {
  try {
    const { name, age, income, loanAmount, creditHistory, hasLoans, expenses, assets } = req.body;

    const errors = [];
    if (!name || !name.trim()) errors.push('Name is required');
    if (!age || age < 18) errors.push('Valid age (18+) is required');
    if (!income || income <= 0) errors.push('Valid income is required');
    if (!loanAmount || loanAmount <= 0) errors.push('Valid loan amount is required');
    if (creditHistory === undefined || creditHistory < 0) errors.push('Valid credit history is required');
    if (hasLoans === undefined) errors.push('Existing loans field is required');
    if (!expenses && expenses !== 0) errors.push('Monthly expenses are required');
    if (!assets && assets !== 0) errors.push('Assets value is required');

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: errors,
      });
    }

    const engineInput = {
      name: name.trim(),
      age: parseInt(age),
      income: parseFloat(income),
      loanAmount: parseFloat(loanAmount),
      creditHistory: parseInt(creditHistory),
      hasLoans: Boolean(hasLoans),
      expenses: parseFloat(expenses),
      assets: parseFloat(assets),
    };

    console.log(`📊 Running C++ scoring engine for: ${engineInput.name}`);
    const engineResult = await runScoringEngine(engineInput);
    console.log(`✅ Score calculated: ${engineResult.score} → ${engineResult.status}`);

    const application = new LoanApplication({
      name: engineResult.name,
      age: engineResult.age,
      income: engineResult.income,
      loanAmount: engineResult.loanAmount,
      creditHistory: engineResult.creditHistory,
      hasExistingLoans: engineResult.hasLoans,
      monthlyExpenses: engineResult.expenses,
      assetsValue: engineResult.assets,
      score: engineResult.score,
      status: engineResult.status,
      approved: engineResult.approved,
      breakdown: engineResult.breakdown || [],
    });

    await application.save();
    console.log(`💾 Application saved to MongoDB (ID: ${application._id})`);

    res.status(201).json({
      success: true,
      data: {
        _id: application._id,
        name: application.name,
        age: application.age,
        score: application.score,
        status: application.status,
        approved: application.approved,
        breakdown: application.breakdown,
        appliedAt: application.appliedAt,
      },
    });
  } catch (err) {
    console.error('❌ Error processing application:', err.message);

    if (err.message.includes('not found')) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'C++ scoring engine is not available. Please compile it first.',
        details: err.message,
      });
    }
    if (err.message.includes('timed out')) {
      return res.status(504).json({
        error: 'Gateway Timeout',
        message: 'Scoring engine took too long to respond.',
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process loan application.',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined,
    });
  }
});

router.get('/history', async (req, res) => {
  try {
    const applications = await LoanApplication.find()
      .sort({ appliedAt: -1 })
      .select('name age score status approved appliedAt')
      .lean();

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    console.error('❌ Error fetching history:', err.message);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch application history.',
    });
  }
});

router.delete('/history', async (req, res) => {
  try {
    const result = await LoanApplication.deleteMany({});
    console.log(`🗑️ Cleared ${result.deletedCount} application(s) from database`);

    res.json({
      success: true,
      message: `Cleared ${result.deletedCount} application(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error('❌ Error clearing history:', err.message);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to clear application history.',
    });
  }
});

module.exports = router;
