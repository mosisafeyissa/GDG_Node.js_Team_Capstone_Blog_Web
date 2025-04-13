// path to this file is app.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const bodyParser = require("body-parser");
const path = require('path');


const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"src","views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/posts", require("./src/routes/blogRoutes"));
app.use("/api/profile", require("./src/routes/profileRoutes"));

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const errorHandler = require("./src/middleware/errorMiddleware");
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
