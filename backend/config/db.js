const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/recipebook');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.log("Running without database connection... Spoonacular API will still work!");
    // process.exit(1) removed so the server doesn't crash on Render without a DB
  }
};

module.exports = connectDB;
