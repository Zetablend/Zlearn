const dotenv = require("dotenv");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./models");
const sequelize = require("./models");
const cron = require("node-cron");
const { updateBayesianScores } = require("./services/updateBayesianScores");
const { updateSessionStatus } = require("./services/updateSessionStatus");

dotenv.config({ path: "./.env" });

const app = express();

// ------------------- Shared Config -------------------
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://zlearn.com",
  "https://www.zlearn.com"
];

// ------------------- Middleware -------------------
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"]
    // credentials: true  // uncomment if you use cookies/sessions
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// ------------------- Routes -------------------
app.use("/user", require("./routes/userRoutes"));
app.use("/mentor", require("./routes/mentorRoutes"));
app.use("/mentorresources", require("./routes/mentorResources"));
app.use("/usergoals", require("./routes/mentorgoaldetails"));
app.use("/review", require("./routes/mentorreview"));
app.use("/session", require("./routes/adminsessionroutes"));
app.use("/admin", require("./routes/changeMentorRoutes"));
app.use("/courses",require("./routes/coursesRoutes"));
app.use("/platform_articles", require("./routes/platformhelparticles"));
app.use("/feedback", require("./routes/platformfeedbackRoute"));

// ------------------- CRON jobs -------------------
cron.schedule("0 * * * *", () => {
  console.log("⏳ Running hourly Bayesian update & Session Status...");
  updateBayesianScores();
  updateSessionStatus();
});

// ------------------- Error Handler -------------------
app.use((err, req, res, next) => {
  console.error("Internal server error:", err);
  res.status(500).json({ error: "Something went wrong!" });
});

// ------------------- EXPRESS SERVER -------------------
const API_PORT = process.env.API_PORT || 3000;

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connection established.");

    if (process.env.NODE_ENV === "development") {
      console.log("⚙️ Running sequelize.sync() in development mode...");
      await sequelize.sync({ alter: true });
    } else if (process.env.NODE_ENV === "production") {
      console.log("🚫 Skipping sequelize.sync() in production. Use migrations instead.");
      // 🚨 Fail-safe: disable sync in production
      sequelize.sync = () => {
        throw new Error("❌ sequelize.sync() is disabled in production. Run migrations instead.");
      };
    } else {
      console.warn("⚠️ NODE_ENV not set. Defaulting to safe mode (no sync).");
    }

    app.listen(API_PORT, () => {
      console.log(`🚀 REST API running on port ${API_PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err.message);
    process.exit(1);
  }
})();

// ------------------- SOCKET.IO SERVER -------------------
const WS_PORT = process.env.WS_PORT || 4000;
const wsServer = http.createServer();
const io = new Server(wsServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"]
  }
});

io.on("connection", (socket) => {
  console.log("✅ WebSocket connected:", socket.id);
  require("./socket/chatHandlers")(io, socket, sequelize);

  socket.on("disconnect", () => {
    console.log("❌ WebSocket disconnected:", socket.id);
  });
});

wsServer.listen(WS_PORT, () => {
  console.log(`🌐 WebSocket server running on port ${WS_PORT}`);
});

// Export io so controllers can emit events directly
module.exports = io;
