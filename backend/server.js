require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// Enable CORS for frontend requests
app.use(cors());

// Body parser
app.use(express.json());

// Routes
app.use('/api/recipes', recipeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Fallback for page not found
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Setup Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in mode on port ${PORT}`);
});
