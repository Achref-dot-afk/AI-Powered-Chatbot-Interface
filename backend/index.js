const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const db = require("./config/db.js");

dotenv.config();
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes

app.use("/api/auth", require("./routes/authRoutes.js"));
app.use("/api/chat", require("./routes/chatRoutes.js"));
app.use("/api/user", require("./routes/userRoutes.js"));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
