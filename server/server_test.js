const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const workerRoutes = require('./routes/workerRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workers', workerRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/grievances', require('./routes/grievanceRoutes'));

// Database Connection
// TODO: Replace with your actual MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

app.get('/', (req, res) => {
    res.send('SafeHands API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
