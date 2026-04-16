const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
dotenv.config();
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const sponsorshipRoutes = require('./routes/sponsorships');
const fundRoutes = require('./routes/funds');
const announcementRoutes = require('./routes/announcements');
const app = express();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/announcements', announcementRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the VJTI Fund Tracker API!' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
