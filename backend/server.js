const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const loanRoutes = require('./routes/loanRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.use('/api/loan', loanRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CREDO Loan Approval API',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} does not exist`,
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err.message);
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message,
  });
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
  console.error('');
  console.error('═══════════════════════════════════════════════════════════');
  console.error('  ❌  MongoDB connection string not configured!');
  console.error('');
  console.error('  Please update backend/.env with your MongoDB Atlas URI:');
  console.error('  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/credo_loans');
  console.error('');
  console.error('  To get a free MongoDB Atlas cluster:');
  console.error('  1. Go to https://www.mongodb.com/atlas');
  console.error('  2. Create a free cluster');
  console.error('  3. Create a database user');
  console.error('  4. Whitelist your IP (or use 0.0.0.0/0)');
  console.error('  5. Copy the connection string');
  console.error('═══════════════════════════════════════════════════════════');
  console.error('');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  ✅  MongoDB connected successfully');
    console.log(`  📊  Database: ${mongoose.connection.db.databaseName}`);
    console.log('═══════════════════════════════════════════════════════════');

    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log(`  🚀  CREDO API Server running on http://localhost:${PORT}`);
      console.log(`  📡  Health check: http://localhost:${PORT}/api/health`);
      console.log(`  📋  API routes:`);
      console.log(`       POST   /api/loan/apply    → Submit loan application`);
      console.log(`       GET    /api/loan/history   → Get all applications`);
      console.log(`       DELETE /api/loan/history   → Clear all applications`);
      console.log('');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('');
    });
  })
  .catch((err) => {
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('  ❌  MongoDB connection failed!');
    console.error(`  Error: ${err.message}`);
    console.error('');
    console.error('  Common fixes:');
    console.error('  • Check your MONGODB_URI in backend/.env');
    console.error('  • Whitelist your IP in MongoDB Atlas');
    console.error('  • Check your username/password');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    process.exit(1);
  });

module.exports = app;
