require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});