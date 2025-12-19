const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Trigger restart 2
let isConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    console.log('MongoDB connected');
    isConnected = true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('Falling back to In-Memory storage');
    isConnected = false;
  }
};

connectDB();

// Middleware to inject connection status
app.use((req, res, next) => {
  req.isConnected = isConnected;
  next();
});

// Routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
