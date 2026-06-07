const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { Server } = require('socket.io');
require('dotenv').config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error('FATAL: JWT_SECRET is missing or too short in .env');
  process.exit(1);
}

const socketUtil = require('./utils/socket');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

socketUtil.init(io);

io.on('connection', (socket) => {
  socket.on('join-user', (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
    }
  });
});

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Serve React build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/ngos', require('./routes/ngos'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/notifications', require('./routes/notifications'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date()
  });
});

// Donation Verification
app.get('/api/verify/:transactionId', async (req, res) => {
  const Donation = require('./models/Donation');

  try {
    const donation = await Donation.findOne({
      transactionId: req.params.transactionId
    }).populate('campaign', 'title emoji');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found.'
      });
    }

    res.json({
      success: true,
      data: {
        donorName: donation.isAnonymous
          ? 'Anonymous'
          : donation.donorName,
        amount: donation.amount,
        campaign: donation.campaign?.title,
        receiptId: donation.receiptId,
        date: donation.createdAt,
        status: donation.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// React Catch-All Route
app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../frontend/build/index.html')
  );
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// Database Connection & Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    const PORT = parseInt(process.env.PORT, 10) || 5000;

    server.listen(PORT, () => {
      console.log(
        `NASEER server running at http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error('MongoDB error:', err.message);
    process.exit(1);
  });