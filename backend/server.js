const http      = require('http');
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const morgan    = require('morgan');
const path      = require('path');

const { Server } = require('socket.io');
require('dotenv').config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error('FATAL: JWT_SECRET is missing or too short in .env');
  process.exit(1);
}

const socketUtil = require('./utils/socket');
const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*', methods: ['GET','POST'] } });
socketUtil.init(io);

io.on('connection', (socket) => {
  socket.on('join-user', (userId) => { if (userId) socket.join(`user:${userId}`); });
});

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/campaigns',     require('./routes/campaigns'));
app.use('/api/donations',     require('./routes/donations'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/ai',            require('./routes/ai'));
app.use('/api/ngos',          require('./routes/ngos'));
app.use('/api/volunteers',    require('./routes/volunteers'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.get('/api/verify/:transactionId', async (req, res) => {
  const Donation = require('./models/Donation');
  try {
    const d = await Donation.findOne({ transactionId: req.params.transactionId }).populate('campaign','title emoji');
    if (!d) return res.status(404).json({ success: false, message: 'Donation not found.' });
    res.json({ success: true, data: { donorName: d.isAnonymous ? 'Anonymous' : d.donorName, amount: d.amount, campaign: d.campaign?.title, receiptId: d.receiptId, date: d.createdAt, status: d.status } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/build/index.html')));
app.use((err, req, res, next) => res.status(err.status||500).json({ success: false, message: err.message||'Server Error' }));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    const PORT = parseInt(process.env.PORT) || 5000;
   .then(() => {
    console.log('MongoDB connected');
    const PORT = parseInt(process.env.PORT) || 5000;
    server.listen(PORT, () => {
      console.log(`NASEER server running at http://localhost:${PORT}`);
    });
  })
    server.listen(PORT, () => {
      console.log(` NASEER server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => { console.error('MongoDB error:', err.message); process.exit(1); });