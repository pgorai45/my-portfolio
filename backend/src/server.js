const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const pool = require("./config/db");
const initDb = require("./config/initDb");
const contactRoutes = require("./routes/contactRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const adminRoutes = require("./routes/adminRoutes");
const rateLimit = require("express-rate-limit");

const app = express();
app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});
const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header (curl, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Serve uploaded static files (resumes, project images)
const uploadsPath = path.resolve(__dirname, "../uploads");
app.use(
  "/uploads",
  express.static(uploadsPath, {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.removeHeader("X-Frame-Options");
      res.setHeader(
        "Content-Security-Policy",
        "frame-ancestors 'self' https://my-portfolio-pgorai45.vercel.app"
      );
    },
  })
);

// API Routes
app.use("/api/contact", publicFormLimiter, contactRoutes);
app.use("/api/appointments", publicFormLimiter, appointmentRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/admin/login", adminLoginLimiter);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Portfolio backend is running",
      database: "PostgreSQL connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: "File upload error.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "An unexpected internal server error occurred.",
  });
});

const PORT = process.env.PORT || 5000;

// Initialize Database on Startup, then listen
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database on startup:", err);
    // Still start server so developer can inspect health
    app.listen(PORT, () => {
      console.log(`Backend server running (with DB warning) on http://localhost:${PORT}`);
    });
  });