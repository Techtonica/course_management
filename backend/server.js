const express = require("express")
const cors = require("cors")
const session = require("express-session")
const passport = require("./config/github-oauth")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session configuration (required for Passport)
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
)

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/users", require("./routes/users"))
app.use("/api/courses", require("./routes/courses"))
app.use("/api/assignments", require("./routes/assignments"))
app.use("/api/submissions", require("./routes/submissions"))
app.use("/api/feedback", require("./routes/feedback"))
app.use("/api/progress", require("./routes/progress"))
app.use("/api/surveys", require("./routes/surveys"))
app.use("/api/export", require("./routes/export"))
app.use("/api/notifications", require("./routes/notifications"))

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Course Management API is running" })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err)
  res.status(500).json({ error: "Internal server error" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`)
})
