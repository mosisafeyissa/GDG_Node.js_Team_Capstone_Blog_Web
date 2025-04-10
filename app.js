// path to this file is app.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const bodyParser = require("body-parser");


const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(bodyParser.json());

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/posts", require("./src/routes/blogRoutes"));
app.use("/api/profile", require("./src/routes/profileRoutes"));

app.get("/test-error", (req, res) => {
  throw new CustomError("Test error", 500);
});

const errorHandler = require("./src/middleware/errorMiddleware");
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});