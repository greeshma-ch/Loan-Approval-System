const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    age: { type: Number, required: true, min: 18, max: 120 },
    income: { type: Number, required: true, min: 0 },
    loanAmount: { type: Number, required: true, min: 0 },
    creditHistory: { type: Number, required: true, min: 0 },
    hasExistingLoans: { type: Boolean, required: true, default: false },
    monthlyExpenses: { type: Number, required: true, min: 0 },
    assetsValue: { type: Number, required: true, min: 0 },
    score: { type: Number, required: true, min: 0, max: 100 },
    status: { type: String, required: true, enum: ['Approved', 'Rejected'] },
    approved: { type: Boolean, required: true },
    breakdown: {
      type: [{ label: String, points: Number, maxPoints: Number }],
      default: [],
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

loanApplicationSchema.index({ appliedAt: -1 });

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);
