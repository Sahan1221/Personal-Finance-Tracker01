require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI);

// security middlewares
app.use(helmet());
app.use(express.json());

// CORS: allow frontend origin and credentials (important for sessions)
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Session setup
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: 'sessions'
});

app.use(session({
  name: process.env.SESSION_NAME || 'ft.sid',
  secret: process.env.SESSION_SECRET || 'keyboard cat replace me',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: parseInt(process.env.SESSION_LIFETIME || '86400000', 10), // 1 day
    secure: process.env.NODE_ENV === 'production', // set true in production (requires HTTPS)
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => res.json({ message: 'Finance Tracker API' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
