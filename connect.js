const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


const mongoUrl = `mongodb+srv://ACE${process.env.DB_USER}:${process.env.DB_PASSWORD}${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(mongoUrl);
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1); 
});

db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to application termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

module.exports = mongoose;
