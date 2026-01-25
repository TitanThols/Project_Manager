const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const projectRouter = require("./routes/projectRoutes");
const userRouter = require("./routes/userRoutes");

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

// Test route
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
