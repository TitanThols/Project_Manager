const express = require("express");
const dotenv = require("dotenv");
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const connectDB = require("./config/db");
const projectRouter = require("./routes/projectRoutes");
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true
}));

app.use(helmet());

app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login/signup attempts from this IP, please try again in 15 minutes.',
  skipSuccessfulRequests: true,
});
app.use('/api/v1/users/signup', authLimiter);
app.use('/api/v1/users/login', authLimiter);

connectDB();

app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);


app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;